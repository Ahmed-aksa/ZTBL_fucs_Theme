/* eslint-disable no- */
/* eslint-disable prefer-const */
/* eslint-disable eol-last */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {Branch} from 'app/shared/models/branch.model';
import {Zone} from 'app/shared/models/zone.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {KhaadSeedVendorService} from '../service/khaad-seed-vendor.service';
import {VendorDetail} from '../class/vendor-detail';
import {ViewMapsComponent} from "../../../shared/component/view-map/view-map.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-vendor-list',
    templateUrl: './vendor-list.component.html',
    styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {
    displayedColumns = ['CircleCode', 'Name', 'bDescription', 'Address', 'Type', 'Phone', 'Actions'];
    itemsPerPage = 10;
    pageIndex = 1;
    offSet = 0;

    matTableLenght: boolean = false;
    loading: boolean;

    public vendorObj = new VendorDetail();

    totalItems: number | any;
    dv: number | any; //use later

    vendor: any = {};
    vendorLov: any;

    dataSource: MatTableDataSource<VendorList>
    listForm: FormGroup;

    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();

    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];
    public Circle = new Branch();

    selected_b;
    selected_z;
    selected_c;
    loaded = true;
    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;

    branch: any;
    zone: any;
    circle: any;


    LoggedInUserInfo: BaseResponseModel;
    user: any = {};

    public LovCall = new Lov();


    constructor(
        private _khaadSeedVendor: KhaadSeedVendorService,
        private layoutUtilsService: LayoutUtilsService,
        private router: Router,
        private fb: FormBuilder,
        private _lovService: LovService,
        private activatedRoute: ActivatedRoute,
        private userUtilsService: UserUtilsService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog
    ) {
    }


    ngOnInit(): void {

        this.createForm();
        this.typeLov();
    }


    createForm() {
        this.listForm = this.fb.group({
            Type: [null],
            VendorName: [null],
            PhoneNumber: [null]
        })
    }

    find() {
        this.offSet = 0;
        this.itemsPerPage = 10;
        this.searchVendor()
    }

    async typeLov() {

        this.vendorLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.VendorTypes});
        var fi: any = []
        fi.Value = "null";
        fi.Name = "All";
        fi.LovId = "0"
        fi.TagName = "0";
        this.vendorLov.LOVs.splice(0, 0, fi)
        this.vendorLov = this.vendorLov.LOVs;

    }

    searchVendor() {

        this.loaded = false;
        this.loading = true;
        var phone, name, type;

        if (this.listForm.controls.ZoneId.value != null && this.listForm.controls.BranchCode.value != null) {
            this.user.ZoneId = this.zone?.ZoneId;
            this.user.CircleId = this.circle?.CircleId;
            this.user.BranchCode = this.branch?.BranchCode;
        }

        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

        name = this.listForm.controls.VendorName.value;
        phone = this.listForm.controls.PhoneNumber.value;
        type = this.listForm.controls.Type.value;

        this.vendorObj.Name = name;
        this.vendorObj.PhoneNumber = phone;
        this.vendorObj.Type = type;


        this.spinner.show();
        this._khaadSeedVendor.searchVendors(this.itemsPerPage, this.offSet, this.vendorObj, this.user, this.zone, this.branch, this.circle)
            .pipe(
                finalize(() => {
                    this.loaded = true;
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.loading = true;
                    this.dataSource = baseResponse.SeedKhadVendor.VendorDetails
                    this.dv = this.dataSource;
                    this.matTableLenght = true

                    this.totalItems = baseResponse.SeedKhadVendor.VendorDetails[0].TotalRecords
                } else {
                    this.loading = false;
                    this.matTableLenght = false;
                    this.dataSource = this.dv?.slice(1, 0);
                    this.offSet = 0;
                    this.pageIndex = 1;
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })

    }

    editDeleteStatus(vendor: any) {
        if (vendor.CreatedBy == this.LoggedInUserInfo.User.UserId) {
            return true
        } else {
            return false
        }
    }

    viewStatus(vendor: any) {
        if ((vendor.CreatedBy != this.LoggedInUserInfo.User.UserId) || (vendor.CreatedBy == this.LoggedInUserInfo.User.UserId)) {
            return true
        } else {
            return false
        }
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {

        this.itemsPerPage = pageSize;
        this.offSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.searchVendor();
        this.dataSource.data = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }

    editVendor(vendor: any) {
        localStorage.setItem('SearchVendorData', JSON.stringify(vendor));
        localStorage.setItem('EditVendorData', '1');
        localStorage.setItem('selected_single_zone', JSON.stringify(vendor.ZoneId));
        localStorage.setItem('selected_single_branch', JSON.stringify(vendor.BranchCode));
        localStorage.setItem('selected_single_circle', JSON.stringify(vendor.CircleId));
        this.router.navigate(['../add-vendor', {upFlag: "1"}], {relativeTo: this.activatedRoute});
    }

    viewVendor(vendor: any) {

        if (vendor.CreatedBy != this.LoggedInUserInfo.User.UserId) {
            vendor.obj = "o"
        } else {
            vendor.obj = "v"
        }


        localStorage.setItem('SearchVendorData', JSON.stringify(vendor));
        localStorage.setItem('EditVendorData', '1');
        localStorage.setItem('selected_single_zone', JSON.stringify(vendor.ZoneId));
        localStorage.setItem('selected_single_branch', JSON.stringify(vendor.BranchCode));
        localStorage.setItem('selected_single_circle', JSON.stringify(vendor.CircleId));

        this.router.navigate(['../add-vendor', {upFlag: "1"}], {relativeTo: this.activatedRoute});
    }

    deleteVendor(ind_vendor: any) {
        this.vendorObj.Id = ind_vendor.Id;

        this.user.ZoneId = ind_vendor.ZoneId
        this.user.BranchCode = ind_vendor.BranchCode
        this.user.CricleId = ind_vendor.CircleId


        this._khaadSeedVendor.deleteVendor(this.vendorObj, this.user)
            .pipe(
                finalize(() => {
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                    //window.location.reload();
                    this.vendorObj.Id = null;
                    this.searchVendor()
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }

    checkMap(data) {
        if (data.Lat.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    viewMap(data) {
        const dialogRef = this.dialog.open(ViewMapsComponent, {
            panelClass: ['h-screen', 'max-w-full', 'max-h-full'],
            width: '100%',
            data: data,
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
        });
    }

    getAllData(data) {

        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle;


    }


}

interface VendorList {
    Name: string;
    Description: string;
    Address: string;
    Type: string;
    PhoneNumber: string;
}
