import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Bufrication} from "../class/reports";
import {MatDialogRef} from "@angular/material/dialog";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LovService} from "../../../shared/services/lov.service";
import {ReportsService} from "../service/reports.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {DateFormats, Lov, LovConfigurationKey} from "../../../shared/classes/lov.class";
import {finalize} from "rxjs/operators";
import {Selection} from "../voucher-posting-day/voucher-posting-day.component";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";

@Component({
    selector: 'app-recovery-schedule',
    templateUrl: './recovery-schedule.component.html',
    styleUrls: ['./recovery-schedule.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})

export class RecoveryScheduleComponent implements OnInit {

    bufricationForm: FormGroup;
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
    LoggedInUserInfo: BaseResponseModel;
    statusLov: any;
    loading = false;

    public reports = new Bufrication();


    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];

    final_branch: any;
    final_zone: any;

    branch: any;
    zone: any;
    circle: any;

    dateDisable: boolean = false;
    today = new Date();


    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];

    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];

    user: any = {}

    constructor(
        private dialogRef: MatDialogRef<RecoveryScheduleComponent>,
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private _bufrication: ReportsService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private _reports: ReportsService
    ) {
    }

    public LovCall = new Lov();


    ngOnInit(): void {
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();
        //this.typeLov();

        //this.bufricationForm.controls["WorkingDate"].setValue(this.LoggedInUserInfo.Branch.WorkingDate);
        if (this.branch) {
            let dateString = this.branch.WorkingDate;
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));

            const branchWorkingDate = new Date(year, month - 1, day);
            this.bufricationForm.controls.WorkingDate.setValue(branchWorkingDate);
        } else {
            let dateString = "11012021";
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));

            const branchWorkingDate = new Date(year, month - 1, day);
            this.bufricationForm.controls.WorkingDate.setValue(branchWorkingDate);
        }
    }

    async typeLov() {
        this.statusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.BifurcationLCStatus});
        this.statusLov = this.statusLov.LOVs;
        this.bufricationForm.controls["Status"].setValue(this.statusLov ? this.statusLov[0].Value : "")
    }

    isEnableWorkingDate() {
        var workingDate = this.bufricationForm.controls.WorkingDate.value;
        if (workingDate._isAMomentObject == undefined) {
            try {
                var day = this.bufricationForm.controls.WorkingDate.value.getDate();
                var month = this.bufricationForm.controls.WorkingDate.value.getMonth() + 1;
                var year = this.bufricationForm.controls.WorkingDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);

                this.bufricationForm.controls.WorkingDate.setValue(branchWorkingDate);
            } catch (e) {

            }
        } else {
            try {
                var day = this.bufricationForm.controls.WorkingDate.value.toDate().getDate();
                var month = this.bufricationForm.controls.WorkingDate.value.toDate().getMonth() + 1;
                var year = this.bufricationForm.controls.WorkingDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                workingDate = day + "" + month + "" + year;


                const branchWorkingDate = new Date(year, month - 1, day);
                this.bufricationForm.controls.WorkingDate.setValue(branchWorkingDate);
            } catch (e) {

            }
        }
    }


    createForm() {
        this.bufricationForm = this.fb.group({
            WorkingDate: [null, Validators.required],
            LcNO: [null],
        })
    }


    find() {

        if (this.bufricationForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.bufricationForm.markAllAsTouched();
            return;
        }
        this.reports = Object.assign(this.reports, this.bufricationForm.value);
        this.reports.ReportsNo = "4";
        this.reports.ReportFormatType = "2";
        var myWorkingDate = this.bufricationForm.controls.WorkingDate.value;
        if (myWorkingDate._isAMomentObject == undefined) {

            try {
                var day = this.bufricationForm.controls.WorkingDate.value.getDate();
                var month = this.bufricationForm.controls.WorkingDate.value.getMonth() + 1;
                var year = this.bufricationForm.controls.WorkingDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                myWorkingDate.WorkingDate = day + "" + month + "" + year;
                this.reports.WorkingDate = myWorkingDate.WorkingDate;
            } catch (e) {

            }
        } else {
            try {
                var day = this.bufricationForm.controls.WorkingDate.value.toDate().getDate();
                var month = this.bufricationForm.controls.WorkingDate.value.toDate().getMonth() + 1;
                var year = this.bufricationForm.controls.WorkingDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                this.reports.WorkingDate = day + "" + month + "" + year;
            } catch (e) {

            }
        }

        if (this.branch.WorkingDate == undefined) {
            this.branch.WorkingDate = this.reports.WorkingDate;
        }

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
                    window.open(baseResponse.ReportsFilterCustom.FilePath, 'Download');
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

    close(res) {
        this.dialogRef.close(res)
    }


}
