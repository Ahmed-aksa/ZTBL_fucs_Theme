import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LayoutUtilsService} from "../../../shared/services/layout-utils.service";
import {TourPlan} from '../Model/tour-plan.model';
import {TourPlanService} from "../Service/tour-plan.service";
import {CircleService} from "../../../shared/services/circle.service";
import {CommonService} from "../../../shared/services/common.service";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Circle} from 'app/shared/models/circle.model';
import {Branch} from 'app/shared/models/branch.model';
import {Zone} from 'app/shared/models/zone.model';
import {SlashDateFormats} from "../../../shared/models/slash-format.class";

@Component({
    selector: 'loan-utilization',
    templateUrl: './tour-plan.component.html',
    styleUrls: ['./tour-plan.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: SlashDateFormats}

    ],

})
export class TourPlanComponent implements OnInit {
    @Input() tourplan: any;
    @Input() flag: any;
    id;
    displayedColumns = ["VisitedDate", "Purpose", "Edit", "Delete"]
    dataSource: [] = [];
    TourForm: FormGroup;
    loggedInUser: any;
    onAdd: boolean = false;
    hasFormErrors = false;
    minDate = new Date();
    sign;
    circle;
    VisitedDate;
    TourPlan = new TourPlan;
    isAdd: boolean = true;
    isUpdate: boolean = false;
    isTable: boolean = true;
    isSubmit: boolean = false;
    isAuthorize: boolean = false;
    isApproval: boolean = false;
    isView: boolean = false;
    readonly: boolean = false;

    //Start ZBC

    LoggedInUserInfo: BaseResponseModel;
    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();
    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;
    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];
    public Circle = new Circle();
    selected_b;
    selected_z;
    selected_c;

    //final

    final_branch: any;
    final_zone: any;
    final_cricle: any;

    //End ZBC

    constructor(
        private fb: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private userUtilsService: UserUtilsService,
        private datePipe: DatePipe,
        public dialog: MatDialog,
        private router: Router,
        private _circleService: CircleService,
        private tourPlanService: TourPlanService,
        private commonService: CommonService,
    ) {
        this.loggedInUser = userUtilsService.getUserDetails();
        if (this.router.getCurrentNavigation().extras.state !== undefined) {
            this.TourPlan = this.router.getCurrentNavigation().extras.state.example;
            this.flag = this.router.getCurrentNavigation().extras.state.flag;


        } else {
            this.isAdd = true;
            this.isUpdate = false;
        }
    }

    ngOnInit() {

        this.createForm();
        this.setValues();
        this.setValuesForEdit();
    }

    //Start ZBC
    userInfo = this.userUtilsService.getUserDetails();

    settingZBC() {

        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if (this.LoggedInUserInfo.Branch && this.LoggedInUserInfo.Branch.BranchCode != "All") {
            this.SelectedCircles = this.LoggedInUserInfo.UserCircleMappings;
            this.SelectedBranches = this.LoggedInUserInfo.Branch;
            this.SelectedZones = this.LoggedInUserInfo.Zone;
            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.TourForm.controls["Zone"].setValue(this.SelectedZones?.Id);
            this.TourForm.controls["Branch"].setValue(this.SelectedBranches?.BranchCode);
            this.TourForm.controls["Circle"].setValue(this.SelectedCircles?.Id);
            // if (this.customerForm.value.Branch) {
            //     this.changeBranch(this.customerForm.value.Branch);
            // }
        } else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.UserCircleMappings) {
            this.spinner.show();
            this.userUtilsService.getZone().subscribe((data: any) => {
                this.Zone = data?.Zones;
                this.SelectedZones = this?.Zone;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();
            });
        }
    }

    private assignBranchAndZone() {

        //Circle
        if (this.SelectedCircles.length) {
            this.final_cricle = this.SelectedCircles?.filter((circ) => circ.Id == this.selected_c)[0]
            this.userInfo.Circles = this.final_cricle;
        } else {
            this.final_cricle = this.SelectedCircles;
            this.userInfo.Circles = this.final_cricle;
        }
        //Branch
        if (this.SelectedBranches.length) {
            this.final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0];
            this.userInfo.Branch = this.final_branch;
        } else {
            this.final_branch = this.SelectedBranches;
            this.userInfo.Branch = this.final_branch;
        }
        //Zone
        if (this.SelectedZones.length) {
            this.final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
            this.userInfo.Zone = this.final_zone;
        } else {
            this.final_zone = this.SelectedZones;
            this.userInfo.Zone = this.final_zone;
        }

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
            this.Circles = data.Circles;
            this.SelectedCircles = this.Circles;
            // this.selected_c = this.SelectedCircles?.Id
            this.disable_circle = false;
            if (changedValue.value) {
                // this.getBorrower();
            }
        });
    }

    //End ZBC


    setValuesForEdit() {
        if (this.TourPlan.TourPlanId) {
            this.TourForm.controls['CircleId'].setValue(this.TourPlan.CircleId);
            this.TourForm.controls['VisitedDate'].setValue(this.commonService.stringToDate(this.TourPlan.VisitedDate));
            // this.isTable=false;
            this.isAdd = false;
            this.isUpdate = true;
            if (this.flag == 2) {
                this.isAdd = false;
                this.isUpdate = false;
                this.isSubmit = true;
                this.isApproval = true;
            }
            if (this.TourPlan["view"] == "1") {
                this.readonly = true;
                this.isView = true;
            }
        }
    }

    setValues() {
        var circleId = [], circleCode = [], name, ppno, circleName, circleNo, date, branch, zone;

        name = this.loggedInUser.User.DisplayName;
        zone = this.loggedInUser?.Zone?.ZoneName;
        branch = this.loggedInUser?.Branch?.Name;
        ppno = this.loggedInUser?.User?.UserName;
        this.circle = this.loggedInUser?.UserCircleMappings;
        if (this.circle?.length == 0) {

            this.GetCircles()
        }
        this.TourForm.controls['ZoneName'].setValue(zone);
        this.TourForm.controls['BranchName'].setValue(branch);
        this.TourForm.controls['McoName'].setValue(name);
        this.TourForm.controls['PPNO'].setValue(ppno);
        this.TourForm.controls['CircleName'].setValue(circleName);
        this.TourForm.controls['CircleId'].setValue(circleNo);
    }


    createForm() {
        this.TourForm = this.fb.group({
            ZoneName: [],
            BranchName: [],
            McoName: [],
            PPNO: [],
            TourPlanId: [this.TourPlan.TourPlanId],
            CircleId: [this.TourPlan.CircleId],
            CircleName: [],
            ZoneId: [this.loggedInUser.User.ZoneId],
            UserId: [this.loggedInUser.User.UserId],
            BranchId: [this.loggedInUser.User.BranchId],
            VisitedDate: [this.TourPlan.VisitedDate],
            Purpose: [this.TourPlan.Purpose],
            Remarks: [this.TourPlan.Remarks],
            Status: [this.TourPlan.Status],
        })
        this.ApprovalMode();
    }

    ApprovalMode() {
        //
        if (this.flag == "2") {

            this.isView = true;
            this.TourForm.controls['Remarks'].setValidators(Validators.required);
        }
    }

    setVisitedDate() {

        var VisitedDate = this.TourForm.controls.VisitedDate.value;
        if (VisitedDate._isAMomentObject == undefined) {
            try {
                var day = this.TourForm.controls.VisitedDate.value.getDate();
                var month = this.TourForm.controls.VisitedDate.value.getMonth() + 1;
                var year = this.TourForm.controls.VisitedDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.TourForm.controls.VisitedDate.setValue(branchWorkingDate)
            } catch (e) {
            }
        } else {
            try {
                var day = this.TourForm.controls.VisitedDate.value.toDate().getDate();
                var month = this.TourForm.controls.VisitedDate.value.toDate().getMonth() + 1;
                var year = this.TourForm.controls.VisitedDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                VisitedDate = day + "" + month + "" + year;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.VisitedDate = VisitedDate;
                this.TourForm.controls.VisitedDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }

    reset() {
    }

    CheckEditStatus(tourPlan) {
    }

    CheckDeleteStatus(tourPlan) {
    }

    deleteList(tourPlan) {

    }

    editList(tourPlan) {
        this.TourPlan = new TourPlan();
        this.TourPlan = Object.assign(tourPlan);
        this.createForm();
        this.setValues();
        this.setValuesForEdit();
        this.isAdd = false;
        this.isUpdate = true;
        // this.isTable=false;
    }

    Update() {
        this.Add();

    }

    // delete(){}
    Add() {
        if (this.TourForm.invalid) {
            const controls = this.TourForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            this.hasFormErrors = true;
            return;
        }
        // this.customerForm.controls.Status.setValue("P");
        var v = JSON.stringify(this.TourForm.value)


        this.TourPlan = Object.assign(this.TourForm.value);
        this.TourPlan.VisitedDate = this.VisitedDate;
        this.TourPlan.Status = "P";
        // if(this.flag==1)
        // {this.TourPlan.TourPlanId=this.id;
        // }

        this.spinner.show();
        this.tourPlanService
            .createTourPlan(this.TourPlan)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe(
                (baseResponse) => {
                    if (baseResponse.Success) {

                        this.isAdd = true;
                        this.isUpdate = false;

                        this.TourForm.controls.TourPlanId.reset();
                        this.TourForm.controls.CircleId.reset();
                        this.TourForm.controls.VisitedDate.reset();
                        this.TourForm.controls.Purpose.reset();
                        this.TourForm.controls.Remarks.reset();

                        this.dataSource = baseResponse.TourPlan.TourPlans;
                        this.layoutUtilsService.alertElementSuccess(
                            "",
                            baseResponse.Message,
                            baseResponse.Code = null
                        );
                        if (this.flag) {
                            this.router.navigate(['/tour-plan/search-tour-plan']);
                        }


                    } else {

                        this.layoutUtilsService.alertElement(
                            "",
                            baseResponse.Message,
                            baseResponse.Code = null
                        );
                    }
                });
    }

    Submit() {


    }

    hasError(controlName: string, errorName: string): boolean {
        return this.TourForm.controls[controlName].hasError(errorName);
    }

    ChanageTourStatus(value: string) {

        this.TourPlan = Object.assign(this.TourForm.value);
        this.TourPlan.VisitedDate = this.VisitedDate;
        this.TourPlan.Status = value;
        debugger;


        this.spinner.show();
        this.tourPlanService
            .ChanageTourStatus(this.TourPlan)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe(
                (baseResponse) => {
                    if (baseResponse.Success) {
                        this.layoutUtilsService.alertElementSuccess(
                            "",
                            baseResponse.Message,
                            baseResponse.Code = null
                        );

                    } else {

                        this.layoutUtilsService.alertElement(
                            "",
                            baseResponse.Message,
                            baseResponse.Code = null
                        );
                    }
                });
    }

    ngOnDestroy() {
        this.isAdd = true;
        this.isUpdate = false;
    }

    GetCircles() {
        this._circleService
            .getCircles(this.loggedInUser.Branch)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe(
                (baseResponse) => {
                    if (baseResponse.Success) {
                        this.circle = baseResponse.Circles;

                    }
                });
    }
}
