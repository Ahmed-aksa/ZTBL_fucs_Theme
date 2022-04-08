import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Bufrication} from "../class/reports";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LovService} from "../../../shared/services/lov.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {ReportsService} from "../service/reports.service";
import {finalize} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";

@Component({
    selector: 'app-account-statement',
    templateUrl: './account-statement.html',
    styleUrls: ['./account-statement.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})

export class AccountStatementComponent implements OnInit {

    bufricationForm: FormGroup;
    loaded = true;
    LoggedInUserInfo: BaseResponseModel;
    statusLov: any;
    loading = false;
    LoanInfoDetail: any;

    public reports = new Bufrication();
    branch: any;
    zone: any;
    circle: any;
    user: any = {}

    constructor(
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
    }


    createForm() {
        this.bufricationForm = this.fb.group({
            LcNO: [null, Validators.required],
            GLCode: [null]
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
        this.reports.ReportsNo = "36";
        this.reports.ReportFormatType = "2";

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
        this.circle = data.final_circle;
    }


}

export interface Selection {
    Value: string;
    description: string;
}
