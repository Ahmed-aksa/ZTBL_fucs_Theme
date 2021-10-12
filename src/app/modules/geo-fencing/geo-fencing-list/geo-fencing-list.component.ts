import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {GeoFencingService} from '../service/geo-fencing-service.service';
import {MatDialog} from "@angular/material/dialog";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Branch} from "../../../shared/models/branch.model";
import {Circle} from "../../../shared/models/circle.model";
import {MatTableDataSource} from "@angular/material/table";
import {Zone} from "../../../shared/models/zone.model";

import {finalize} from "rxjs/operators";
import {ViewGetFancingModalComponent} from '../view-get-fancing-modal/view-get-fancing-modal.component';

@Component({
    selector: 'app-geo-fencing-list',
    templateUrl: './geo-fencing-list.component.html',
    styleUrls: ['./geo-fencing-list.component.scss']
})
export class GeoFencingListComponent implements OnInit {
    displayedColumns = ['PPNo', 'BranchCode', 'CreatedDate', 'View'];
    itemsPerPage = 30;
    pageIndex = 1;
    offSet = 0;
    matTableLenght: boolean = false;
    totalItems: number | any;
    dv: number | any; //use later
    dataSource: MatTableDataSource<GeoFencingList>
    listForm: FormGroup
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
    public Circle = new Circle();

    selected_b;
    selected_z;
    selected_c;
    LoggedInUserInfo: BaseResponseModel;
    user: any = {};


    constructor(
        private router: Router,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private _geoFencingService: GeoFencingService,
        private dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private userUtilsService: UserUtilsService,
    ) {
    }

    ngOnInit(): void {
        this.createForm();
        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
        this.initValues();
        if (this.LoggedInUserInfo.Branch && this.LoggedInUserInfo.Branch.BranchCode != "All") {
            this.Circles = this.LoggedInUserInfo.UserCircleMappings;
            this.SelectedCircles = this.Circles;

            this.Branches = this.LoggedInUserInfo.Branch;
            this.SelectedBranches = this.Branches;

            this.Zone = this.LoggedInUserInfo.Zone;
            this.SelectedZones = this.Zone;

            this.selected_z = this.SelectedZones.ZoneId
            this.selected_b = this.SelectedBranches.BranchCode
            this.selected_c = this.SelectedCircles.Id
            this.listForm.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
            this.listForm.controls["BranchCode"].setValue(this.SelectedBranches.Name);
        }
    }

    initValues() {
        if (this.LoggedInUserInfo.Zone != undefined && this.LoggedInUserInfo.Branch != undefined) {
            this.user.ZoneId = this.LoggedInUserInfo.Zone.ZoneId;
            this.user.BranchCode = this.LoggedInUserInfo.Branch.BranchCode;
        }
        this.SearchGeoFensePoint();
    }

    createForm() {
        this.listForm = this.fb.group({
            PPNo: [null],
            ZoneId: [null],
            BranchCode: [null],
            CircleId: [null],
            StartDate: [null, [Validators.required]],
            EndDate: [null, [Validators.required]]
        })
    }

    find() {
        this.SearchGeoFensePoint()
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.offSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.SearchGeoFensePoint();
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }

    SearchGeoFensePoint() {

        this.offSet = 0;
        this.itemsPerPage = 10;
        this.spinner.show();

        if (this.listForm.controls.ZoneId.value != null && this.listForm.controls.BranchCode.value != null) {
            this.user.ZoneId = this.listForm.controls.ZoneId.value;
            this.user.CircleId = this.listForm.controls.CircleId.value;
            this.user.BranchCode = this.listForm.controls.BranchCode.value;
        }

        var request = {
            LocationHistory: {
                Limit: this.itemsPerPage,
                Offset: this.offSet,
                PPNo: this.listForm.controls.PPNo.value,
                StartDate: this.listForm.controls.StartDate.value,
                EndDate: this.listForm.controls.EndDate.value,
            },
            Circle: {
                Id: 53444
            },
            Zone: {
                ZoneId: 50055,//this.user.ZoneId,
                Id: 0
            },
            Branch: {
                BranchId: 102,
                BranchCode: "20238"
                //this.user.BranchCode
            }
        }

        this._geoFencingService.SearchGeoFensePoint(request).pipe(finalize(() => {
            this.spinner.hide()
        })).subscribe((baseResponse: BaseResponseModel) => {
            if (baseResponse.Success === true) {
                debugger;
                this.dataSource = baseResponse.LocationHistory.LocationHistories;
                this.dv = this.dataSource;
                // this.totalItems = baseResponse.LocationHistory.LocationHistories[0].TotalRecords
                this.matTableLenght = true
            } else {
                this.matTableLenght = false;
                this.layoutUtilsService.alertElement("", baseResponse.Message);
            }
        });
    }

    view(data: any) {
        const dialogRef = this.dialog.open(ViewGetFancingModalComponent, {
            width: "1200px",
            data: data,
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
        });
    }


    delete(data: any) {
    }

    edit(data: any) {
    }

    comparisonEnddateValidator(): any {
        let ldStartDate = this.listForm.value['StartDate'];
        let ldEndDate = this.listForm.value['EndDate'];

        let startnew = new Date(ldStartDate);
        let endnew = new Date(ldEndDate);
        if (startnew > endnew) {
            return this.listForm.controls['EndDate'].setErrors({'invaliddaterange': true});
        }

        let oldvalue = startnew;
        this.listForm.controls['StartDate'].reset();
        this.listForm.controls['StartDate'].patchValue(oldvalue);
        return this.listForm.controls['StartDate'].setErrors({'invaliddaterange': false});
    }

    comparisonStartdateValidator(): any {
        let ldStartDate = this.listForm.value['StartDate'];
        let ldEndDate = this.listForm.value['EndDate'];

        let startnew = new Date(ldStartDate);
        let endnew = new Date(ldEndDate);
        if (startnew > endnew) {
            return this.listForm.controls['StartDate'].setErrors({'invaliddaterange': true});
        }

        let oldvalue = endnew;
        this.listForm.controls['EndDate'].reset();
        this.listForm.controls['EndDate'].patchValue(oldvalue);
        return this.listForm.controls['EndDate'].setErrors({'invaliddaterange': false});
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.listForm.controls[controlName].hasError(errorName);
    }

    MathCeil(value: any) {
        return Math.ceil(value);
    }


}

interface GeoFencingList {
    User: string;
    Type: string;
    Date: string;

}
