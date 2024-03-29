import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SearchLoanCaseByCnic} from "../class/reports";
import {MatTableDataSource} from "@angular/material/table";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {ReportsService} from "../service/reports.service";
import {DatePipe} from "@angular/common";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {LovService} from "../../../shared/services/lov.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {ToastrService} from "ngx-toastr";
import {finalize} from "rxjs/operators";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-status-lc-initiate-by-mco',
  templateUrl: './status-lc-initiate-by-mco.component.html',
  styleUrls: ['./status-lc-initiate-by-mco.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class StatusLcInitiateByMcoComponent implements OnInit {
    searchCnicForm: FormGroup;
    loaded = true;
    public reports = new SearchLoanCaseByCnic();
    matTableLenght = false;
    loading = false;

    itemsPerPage = 10;
    pageIndex = 1;
    totalItems: number | any;
    dv: number | any; //use later

    LoggedInUserInfo: BaseResponseModel;

    SelectedZones: any = [];

    private branch: any;
    private zone: any;
    private circle: any;


    constructor(
        private fb: FormBuilder,
        private _reports: ReportsService,
        private datePipe: DatePipe,
        private userUtilsService: UserUtilsService,
        private spinner: NgxSpinnerService,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void {

        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();
    }

    createForm() {
        this.searchCnicForm = this.fb.group({
            PPNO: [null, Validators.required],
            FromDate: [null, Validators.required],
            ToDate: [null, Validators.required]
        })
    }


    find() {
        if (this.searchCnicForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.searchCnicForm.markAllAsTouched()
            return;
        }

        this.reports = Object.assign(this.reports, this.searchCnicForm.value);
        this.reports.FromDate = this.datePipe.transform(this.reports.FromDate, 'ddMMyyyy')
        this.reports.ToDate = this.datePipe.transform(this.reports.ToDate, 'ddMMyyyy')
        this.reports.ReportsNo = "34";
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
        this.circle = null
    }
}
