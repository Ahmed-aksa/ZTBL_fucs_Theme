import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Bufrication} from "../class/reports";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LovService} from "../../../shared/services/lov.service";
import {DatePipe} from "@angular/common";
import {ReportsService} from "../service/reports.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {DateFormats, Lov} from "../../../shared/classes/lov.class";
import {finalize} from "rxjs/operators";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {ProfileService} from "../../../shared/services/profile.service";
import {Profile} from "../../user-management/activity/activity.model";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-changes-to-user-access-rights',
    templateUrl: './changes-to-user-access-rights.component.html',
    styleUrls: ['./changes-to-user-access-rights.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class ChangesToUserAccessRightsComponent implements OnInit {

    bufricationForm: FormGroup;
    loaded = true;
    LoggedInUserInfo: BaseResponseModel;
    statusLov: any;
    loading = false;
    profile: Profile = new Profile();
    profiles: any[];
    dateDisable: boolean = false;

    public reports = new Bufrication();


    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];

    final_branch: any;
    final_zone: any;

    branch: any;
    zone: any;
    circle: any;

    //today = new Date();


    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];

    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];

    user: any = {}
    public LovCall = new Lov();

    constructor(
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private datePipe: DatePipe,
        private _profileService: ProfileService,
        private _bufrication: ReportsService,
        private datepipe: DatePipe,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private cdRef: ChangeDetectorRef,
        private toastr: ToastrService,
        private _reports: ReportsService,
    ) {
    }

    GetAllProfiles() {

        this._profileService.getAllProfiles()
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.profiles = baseResponse.Profiles;
                    this.cdRef.detectChanges();
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }
            });
    }

    ngOnInit(): void {
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();
        this.GetAllProfiles();
    }

    createForm() {
        this.bufricationForm = this.fb.group({
            ProfileID: [null, Validators.required],
            ToDate: [null, Validators.required],
            FromDate: [null, Validators.required]
        })
    }

    isEnableToDate() {
        this.bufricationForm.controls['FromDate'].setValidators(Validators.required);
        this.bufricationForm.controls['FromDate'].updateValueAndValidity()
        var toDate = this.bufricationForm.controls.ToDate.value;
        if (toDate._isAMomentObject == undefined) {
            try {
                var day = this.bufricationForm.controls.ToDate.value.getDate();
                var month = this.bufricationForm.controls.ToDate.value.getMonth() + 1;
                var year = this.bufricationForm.controls.ToDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchToDate = new Date(year, month - 1, day);
                this.bufricationForm.controls.ToDate.setValue(branchToDate);
            } catch (e) {

            }
        } else {
            try {
                var day = this.bufricationForm.controls.ToDate.value.toDate().getDate();
                var month = this.bufricationForm.controls.ToDate.value.toDate().getMonth() + 1;
                var year = this.bufricationForm.controls.ToDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                toDate = day + "" + month + "" + year;


                const branchToDate = new Date(year, month - 1, day);
                this.bufricationForm.controls.ToDate.setValue(branchToDate);
            } catch (e) {

            }
        }
    }

    isEnableFromDate() {
        this.bufricationForm.controls['ToDate'].setValidators(Validators.required);
        this.bufricationForm.controls['ToDate'].updateValueAndValidity()
        var toDate = this.bufricationForm.controls.FromDate.value;
        if (toDate._isAMomentObject == undefined) {
            try {
                var day = this.bufricationForm.controls.FromDate.value.getDate();
                var month = this.bufricationForm.controls.FromDate.value.getMonth() + 1;
                var year = this.bufricationForm.controls.FromDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchToDate = new Date(year, month - 1, day);
                this.bufricationForm.controls.FromDate.setValue(branchToDate);
            } catch (e) {

            }
        } else {
            try {
                var day = this.bufricationForm.controls.FromDate.value.toDate().getDate();
                var month = this.bufricationForm.controls.FromDate.value.toDate().getMonth() + 1;
                var year = this.bufricationForm.controls.FromDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                toDate = day + "" + month + "" + year;


                const branchToDate = new Date(year, month - 1, day);
                this.bufricationForm.controls.FromDate.setValue(branchToDate);
            } catch (e) {

            }
        }
    }

    controlReset() {
        this.bufricationForm.controls['ProfileID'].setValue(null)
        this.bufricationForm.controls['ToDate'].setValue(null)
        this.bufricationForm.controls['FromDate'].setValue(null)

        this.bufricationForm.markAsUntouched();
        this.bufricationForm.markAsPristine();
    }

    find() {
        if (this.bufricationForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.bufricationForm.markAllAsTouched();
            return;
        }
        this.user.Branch = this.branch;
        this.user.Zone = this.zone;
        this.user.Circle = this.circle;

        this.reports = Object.assign(this.reports, this.bufricationForm.value);
        this.reports.ReportsNo = "31";
        this.reports.ReportFormatType = "2";

        var toDate = this.datepipe.transform(this.bufricationForm.controls.ToDate.value, 'ddMMyyyy');

        var fromDate = this.datepipe.transform(this.bufricationForm.controls.FromDate.value, 'ddMMyyyy');
        this.reports.ToDate = toDate;
        this.reports.FromDate = fromDate;
        this.reports.ProfileID = this.reports?.ProfileID?.toString()

        // var myWorkingDate = this.bufricationForm.controls.WorkingDate.value;
        // this.reports.WorkingDate = this.datePipe.transform(myWorkingDate, 'ddMMyyyy')

        this.spinner.show();
        this._reports.reportDynamic(this.reports, this.zone, this.branch)
            .pipe(
                finalize(() => {
                    this.loaded = true;
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: any) => {
                if (baseResponse.Success === true) {
                    this.controlReset();
                    window.open(environment.apiUrl+"/"+baseResponse.ReportsFilterCustom.FilePath, 'Download');
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }


    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = null;
    }


}
