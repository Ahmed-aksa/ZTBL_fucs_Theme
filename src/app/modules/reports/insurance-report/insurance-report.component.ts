import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Bufrication} from "../class/reports";
import {MatDialogRef} from "@angular/material/dialog";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LovService} from "../../../shared/services/lov.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {ReportsService} from "../service/reports.service";
import {DateFormats, Lov, LovConfigurationKey} from "../../../shared/classes/lov.class";
import {finalize} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {WorkingDate} from "../class/date";

@Component({
    selector: 'app-insurance-report',
    templateUrl: './insurance-report.component.html',
    styleUrls: ['./insurance-report.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})

export class InsuranceReportComponent implements OnInit {

    bufricationForm: FormGroup;
    loaded = true;
    LoggedInUserInfo: BaseResponseModel;
    instypeLov: any;
    categoryLov: any;
    criteriaLov: any;

    loading = false;

    public reports = new Bufrication();
    branch: any;
    zone: any;
    circle: any;
    user: any = {}

    //getWorkingDate = WorkingDate()
    constructor(
        private dialogRef: MatDialogRef<InsuranceReportComponent>,
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private datepipe: DatePipe,
        private _reports: ReportsService
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
        this.typeLov();
        this.bufricationForm.controls["ReportFormatType"].setValue(this.select ? this.select[0].Value : "");

        //this.bufricationForm.controls["WorkingDate"].setValue(this.LoggedInUserInfo.Branch.WorkingDate);
        if (this.branch) {
            let dateString = this.branch.WorkingDate;
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));

            const branchWorkingDate = new Date(year, month - 1, day);
            this.bufricationForm.controls.ToDate.setValue(branchWorkingDate);
            this.bufricationForm.controls.FromDate.setValue(branchWorkingDate);
        } else {
            let dateString = "11012021";
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));

            const branchWorkingDate = new Date(year, month - 1, day);
            this.bufricationForm.controls.ToDate.setValue(branchWorkingDate);
            this.bufricationForm.controls.FromDate.setValue(branchWorkingDate);
        }
    }

    async typeLov() {
        this.instypeLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.InsReportType});
        this.instypeLov = this.instypeLov.LOVs;
        this.bufricationForm.controls["Type"].setValue(this.instypeLov ? this.instypeLov[0].Value : "")

        this.categoryLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.InsReportType});
        this.categoryLov = this.categoryLov.LOVs;
        this.bufricationForm.controls["Category"].setValue(this.categoryLov ? this.categoryLov[0].Value : "")

        this.criteriaLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.InsReportType});
        this.criteriaLov = this.criteriaLov.LOVs;
        this.bufricationForm.controls["Criteria"].setValue(this.criteriaLov ? this.criteriaLov[0].Value : "")
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
            FromDate: [null, Validators.required],
            ToDate: [null, Validators.required],
            LcNO: [null],
            Type: [null, Validators.required],
            Category: [null, Validators.required],
            Criteria: [null, Validators.required],
            ReportFormatType: [null, Validators.required]
        })
    }


    find() {

        if (this.bufricationForm.invalid) {
            this.toastr.error("Please Enter Required values");
            return;
        }

        Object.keys(this.bufricationForm.controls).forEach((key) => {
            if (!(key != 'BranchCode' && key != 'CircleId' && key != 'ZoneId'))
                this.bufricationForm.get(key).reset();
        });
        this.reports = Object.assign(this.reports, this.bufricationForm.value);
        this.reports.ReportsNo = "10";
        var toDate = this.datepipe.transform(this.bufricationForm.controls.ToDate.value, 'ddMMyyyy');
        var fromDate = this.datepipe.transform(this.bufricationForm.controls.FromDate.value, 'ddMMyyyy');
        this.reports.ToDate = toDate;
        this.reports.FromDate = fromDate;

        // if(this.branch.WorkingDate == undefined){
        //     this.branch.WorkingDate = this.reports.WorkingDate;
        // }
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
        this.circle = data.final_circle;
    }

    close(res) {
        this.dialogRef.close(res)
    }


}

export interface Selection {
    Value: string;
    description: string;
}
