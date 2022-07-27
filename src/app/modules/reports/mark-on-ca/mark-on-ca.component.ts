import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Bufrication} from "../class/reports";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LovService} from "../../../shared/services/lov.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {ReportsService} from "../service/reports.service";
import {DateFormats, Lov} from "../../../shared/classes/lov.class";
import {finalize} from "rxjs/operators";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-mark-on-ca',
    templateUrl: './mark-on-ca.component.html',
    styleUrls: ['./mark-on-ca.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})

export class MarkOnCaComponent implements OnInit {

    bufricationForm: FormGroup;
    loaded = true;
    LoggedInUserInfo: BaseResponseModel;


    dateCheck = new Date();

    loading = false;

    public reports = new Bufrication();
    branch: any;
    zone: any;
    circle: any;
    user: any = {}
    public LovCall = new Lov();

    //getWorkingDate = WorkingDate()
    constructor(
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

    ngOnInit(): void {
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();

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
            ToDate: [null, Validators.required]
        })
    }


    find() {

        if (this.bufricationForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.bufricationForm.markAllAsTouched();
            return;
        }

        this.reports = Object.assign(this.reports, this.bufricationForm.value);
        this.reports.ReportsNo = "3";

        var toDate = this.datepipe.transform(this.bufricationForm.controls.ToDate.value, 'ddMMyyyy');

        var fromDate = this.datepipe.transform(this.bufricationForm.controls.FromDate.value, 'ddMMyyyy');
        this.reports.ToDate = toDate;
        this.reports.FromDate = fromDate;
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
                    window.open(environment.apiUrl+"/documents/"+baseResponse.ReportsFilterCustom.FilePath, 'Download');
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


}
