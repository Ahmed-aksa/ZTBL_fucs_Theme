/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable arrow-parens */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateFormats, Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {Bufrication} from '../class/reports';
import {ReportsService} from '../service/reports.service';
import {ToastrService} from "ngx-toastr";
import {DatePipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'bufrication-of-os-balances-lc',
    templateUrl: './bufrication-of-os-balances-lc.component.html',
    styleUrls: ['./bufrication-of-os-balances-lc.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class BufricationOfOsBalancesLcComponent implements OnInit {

    bufricationForm: FormGroup;
    loaded = true;
    LoggedInUserInfo: BaseResponseModel;
    statusLov: any;
    loading = false;

    public reports = new Bufrication();
    branch: any;
    zone: any;
    circle: any;
    user: any = {}
    public LovCall = new Lov();
    select: Selection[] = [
        {Value: '2', description: 'Portable Document Format (PDF)'},
        {Value: '3', description: 'MS Excel (Formatted)'},
        {Value: '1', description: 'MS Excel (Data Only Non Formatted)'}
    ];

    constructor(
        //private dialogRef: MatDialogRef<BufricationOfOsBalancesLcComponent>,
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private _reports: ReportsService
    ) {
    }

    ngOnInit(): void {
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();
        this.typeLov();
        this.bufricationForm.controls["ReportFormatType"].setValue(this.select ? this.select[0].Value : "");

        //this.bufricationForm.controls["WorkingDate"].setValue(this.LoggedInUserInfo.Branch.WorkingDate);
        if (this.LoggedInUserInfo.Branch.WorkingDate) {
            let dateString = this.LoggedInUserInfo.Branch.WorkingDate;
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));

            const branchWorkingDate = new Date(year, month - 1, day);
            this.bufricationForm.controls.WorkingDate.setValue(branchWorkingDate);
        } else {
            this.bufricationForm.controls.WorkingDate.setValue(null);
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
            LcNo: [null],
            Status: [null, Validators.required],
            ReportFormatType: [null, Validators.required]
        })
    }


    find() {

        if (this.bufricationForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.bufricationForm.markAllAsTouched();
            return;
        }

        // Object.keys(this.bufricationForm.controls).forEach((key) => {
        //     if (!(key != 'BranchCode' && key != 'CircleId' && key != 'ZoneId'))
        //         this.bufricationForm.get(key).reset();
        // });
        this.reports = Object.assign(this.reports, this.bufricationForm.value);
        this.reports.ReportsNo = "18";
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
        this._reports.reportDynamic(this.reports, this.zone, this.branch, this.circle)
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

    // close(res) {
    //     this.dialogRef.close(res)
    // }


}

export interface Selection {
    Value: string;
    description: string;
}
