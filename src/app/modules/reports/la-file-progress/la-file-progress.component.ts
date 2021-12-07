import { Component, OnInit } from '@angular/core';
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats, Lov} from "../../../shared/classes/lov.class";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Bufrication} from "../class/reports";
import {LovService} from "../../../shared/services/lov.service";
import {NgxSpinnerService} from "ngx-spinner";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {ToastrService} from "ngx-toastr";
import {ReportsService} from "../service/reports.service";
import {MatDialogRef} from "@angular/material/dialog";
import {AffidavitForLegalHeirsComponent} from "../affidavit-for-legal-heirs/affidavit-for-legal-heirs.component";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {finalize} from "rxjs/operators";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";


@Component({
    selector: 'app-la-file-progress',
    templateUrl: './la-file-progress.component.html',
    styleUrls: ['./la-file-progress.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})

export class LaFileProgressComponent implements OnInit {

    bufricationForm: FormGroup;
    loaded = true;
    LoggedInUserInfo: BaseResponseModel;
    statusLov: any;
    loading = false;

    public reports = new Bufrication();


    //Zone inventory

    branch: any;
    zone: any;
    circle: any;


    user: any = {}

    constructor(
        private dialogRef: MatDialogRef<AffidavitForLegalHeirsComponent>,
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private _bufrication: ReportsService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private _reports: ReportsService,
    ) {
    }

    public LovCall = new Lov();



    ngOnInit(): void {
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();
    }


    createForm() {
        this.bufricationForm = this.fb.group({

        })
    }


    find() {

        if (this.bufricationForm.invalid) {
            this.toastr.error("Please Enter Required values");
            return;
        }
        this.reports = Object.assign(this.reports, this.bufricationForm.value);
        this.reports.ReportsNo = "8";
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
