import {Component, OnInit, ViewChild} from '@angular/core';
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

import {finalize} from "rxjs/operators";
import {ViewGetFancingModalComponent} from '../view-get-fancing-modal/view-get-fancing-modal.component';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
    selector: 'app-geo-fencing-list',
    templateUrl: './geo-fencing-list.component.html',
    styleUrls: ['./geo-fencing-list.component.scss']
})
export class GeoFencingListComponent implements OnInit {
    disable_branch = true;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;


    disable_circle = true;
    disable_zone = true;

    single_branch = true;
    single_circle = true;
    single_zone = true;
    products: any
    displayedColumns = ['PPNo', 'BranchCode', 'CreatedDate', 'View'];
    itemsPerPage = 5;
    pageIndex = 1;
    offSet = 0;
    totalItems: number | any = 50;
    dv: number | any; //use later
    dataSource = new MatTableDataSource();
    listForm: FormGroup
    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    Zone: any;

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
        private _geoFencingService: GeoFencingService,
        private dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private userUtilsService: UserUtilsService,
        private spinner: NgxSpinnerService
    ) {
    }

    ngOnInit(): void {
        this.createForm();

        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();

        if (this.LoggedInUserInfo.Branch && this.LoggedInUserInfo.Branch.BranchCode != "All") {
            this.SelectedCircles = this.LoggedInUserInfo.UserCircleMappings;
            this.SelectedBranches = this.LoggedInUserInfo.Branch;
            this.SelectedZones = this.LoggedInUserInfo.Zone;

            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.listForm.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
            this.listForm.controls["BranchCode"].setValue(this.SelectedBranches.BranchCode);
            if (this.listForm.value.BranchCode) {
                this.changeBranch(this.listForm.value.BranchCode)
            }

        } else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
            this.spinner.show();

            this.userUtilsService.getZone().subscribe((data: any) => {
                this.Zone = data.Zones;
                this.SelectedZones = this.Zone;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();

            });


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


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }


    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.offSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.SearchGeoFensePoint();
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }

    SearchGeoFensePoint() {
        let circle = this.SelectedCircles?.filter((circ) => circ.Id == this.selected_c)[0]
        let branch = null;
        if (this.SelectedBranches.length)
            branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0]
        else
            branch = this.SelectedBranches;
        let zone = null;
        if (this.SelectedZones.length)
            zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
        else
            zone = this.SelectedZones;
        var request = {
            LocationHistory: {
                Limit: this.itemsPerPage,
                Offset: this.offSet,
                PPNo: this.listForm.controls.PPNo.value,
                StartDate: this.listForm.controls.StartDate.value,
                EndDate: this.listForm.controls.EndDate.value,
            },
            Circle: circle,
            Zone: zone,
            Branch:  branch,
        }
        this.spinner.show();
        this._geoFencingService.SearchGeoFensePoint(request).pipe(finalize(() => {
            this.spinner.hide();
        })).subscribe((baseResponse: BaseResponseModel) => {
            this.spinner.hide();

            if (baseResponse.Success === true) {
                this.dataSource = baseResponse.LocationHistory.LocationHistories;
                this.totalItems = baseResponse.LocationHistory.LocationHistories[0].TotalRecords
                this.dv = this.dataSource.data;

            } else {

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


    changeZone(changedValue) {
        let changedZone = {Zone: {ZoneId: changedValue.value}}
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }


    changeBranch(changedValue) {
        let changedBranch = null;
        if (changedValue.value)
            changedBranch = {Branch: {BranchCode: changedValue.value}}
        else
            changedBranch = {Branch: {BranchCode: changedValue}}
        this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {
            this.SelectedCircles = data.Circles;
            this.selected_c = this.SelectedCircles[0].Id;
            this.SearchGeoFensePoint()
            this.disable_circle = false;
        });
    }
}

interface GeoFencingList {
    User: string;
    Type: string;
    Date: string;

}
