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
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";

@Component({
    selector: 'app-gl-move',
    templateUrl: './gl-move.component.html',
    styleUrls: ['./gl-move.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})

export class GlMoveComponent implements OnInit {

    bufricationForm: FormGroup;
    loaded = true;
    LoggedInUserInfo: BaseResponseModel;
    statusLov: any;
    loading = false;

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

    today = new Date();


    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];

    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];

    user: any = {}

    constructor(
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private datePipe: DatePipe,
        private _bufrication: ReportsService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private _reports: ReportsService,
    ) {
    }

    public LovCall = new Lov();

    select: Selection[] = [
        {Value: '2', description: 'Portable Document Format (PDF)'},
        {Value: '3', description: 'MS Excel (Formatted)'},
        {Value: '1', description: 'MS Excel (Data Only Non Formatted)'}
    ];

    ngOnInit(): void {
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();
        this.bufricationForm.controls["ReportFormatType"].setValue(this.select ? this.select[0].Value : "");

        //this.bufricationForm.controls["WorkingDate"].setValue(this.LoggedInUserInfo.Branch.WorkingDate);
        if (this.LoggedInUserInfo.Branch.WorkingDate) {
            let dateString = this.LoggedInUserInfo.Branch.WorkingDate;
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));

            this.today = new Date(year, month - 1, day);
            //const branchWorkingDate = new Date(year, month - 1, day);
            this.bufricationForm.controls.WorkingDate.setValue(this.today);
            this.dateDisable = true
        } else {
            this.bufricationForm.controls.WorkingDate.setValue(null);
        }
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

    isEnableToDate() {
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




    createForm() {
        this.bufricationForm = this.fb.group({
            WorkingDate: [null, Validators.required],
            GLCode: [null],
            ToDate: [null],
            FromDate: [null],
            ReportFormatType: [null, Validators.required]
        })
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
        this.reports.ReportsNo = "9";
        var myWorkingDate = this.bufricationForm.controls.WorkingDate.value, toDate= this.bufricationForm.controls.ToDate.value, fromDate= this.bufricationForm.controls.FromDate.value;
        this.reports.WorkingDate = this.datePipe.transform(myWorkingDate, 'ddMMyyyy')
        this.reports.FromDate = this.datePipe.transform(fromDate, 'ddMMyyyy')
        this.reports.ToDate = this.datePipe.transform(toDate, 'ddMMyyyy')
        this.spinner.show();
        this._reports.reportDynamic(this.reports)
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


}

export interface Selection {
    Value: string;
    description: string;
}
