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
import {DatePipe} from "@angular/common";
import {DateFormats, Lov} from "../../../shared/classes/lov.class";
import {finalize} from "rxjs/operators";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";

@Component({
    selector: 'app-disbursement-performance-purpose-wise',
    templateUrl: './disbursement-performance-purpose-wise.component.html',
    styleUrls: ['./disbursement-performance-purpose-wise.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class DisbursementPerformancePurposeWiseComponent implements OnInit {

    bufricationForm: FormGroup;
    loaded = true;
    LoggedInUserInfo: BaseResponseModel;
    statusLov: any;
    loading = false;

    public reports = new Bufrication();

    workingDate = new Date();

    branch: any;
    zone: any;
    circle: any;


    user: any = {}

    constructor(
        private dialogRef: MatDialogRef<DisbursementPerformancePurposeWiseComponent>,
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private _bufrication: ReportsService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private _reports: ReportsService,
        private datepipe: DatePipe
    ) {
    }

    public LovCall = new Lov();


    ngOnInit(): void {
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();

        let dateString = this.datepipe.transform(this.workingDate, 'ddMMyyyy');
        var day = parseInt(dateString.substring(0, 2));
        var month = parseInt(dateString.substring(2, 4));
        var year = parseInt(dateString.substring(4, 8));

        const branchWorkingDate = new Date(year, month - 1, day);
        this.bufricationForm.controls['WorkingDate'].setValue(branchWorkingDate);
    }


    createForm() {
        this.bufricationForm = this.fb.group({
            WorkingDate: [null, Validators.required],
            GLCode: [null]
        })
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

    find() {
        debugger
        if (this.bufricationForm.invalid) {
            this.toastr.error("Please Enter Required values");
            return;
        }

        var dateFormat = this.datepipe.transform(this.bufricationForm.controls.WorkingDate.value, 'ddMMyyyy');

        this.reports = Object.assign(this.reports, this.bufricationForm.value);
        this.reports.ReportsNo = "23";
        this.reports.WorkingDate = dateFormat;
        this.reports.ReportFormatType = "2";
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
