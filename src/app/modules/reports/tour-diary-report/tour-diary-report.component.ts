import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SearchLoanCaseByCnic} from "../class/reports";
import {MatTableDataSource} from "@angular/material/table";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {ReportsService} from "../service/reports.service";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {LovService} from "../../../shared/services/lov.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {ToastrService} from "ngx-toastr";
import {finalize} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";

@Component({
  selector: 'app-tour-diary-report',
  templateUrl: './tour-diary-report.component.html',
  styleUrls: ['./tour-diary-report.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class TourDiaryReportComponent implements OnInit {
    searchCnicForm: FormGroup;
    loaded = true;
    public reports = new SearchLoanCaseByCnic();
    public tourDiary = new TourDiaryReport();

    matTableLenght = false;
    loading = false;

    itemsPerPage = 10;
    pageIndex = 1;
    totalItems: number | any;
    dv: number | any; //use later

    dataSource: MatTableDataSource<searchLoanCasesByCnic>;

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
            Ppno: [null, Validators.required],
            StartDate: [null],
            EndDate: [null]
        })
    }


    find() {
        if (this.searchCnicForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.searchCnicForm.markAllAsTouched()
            return;
        }

        this.tourDiary = Object.assign(this.tourDiary, this.searchCnicForm.value);
        this.tourDiary.StartDate = this.datePipe.transform(this.tourDiary.StartDate, 'ddMMyyyy')
        this.tourDiary.EndDate = this.datePipe.transform(this.tourDiary.EndDate, 'ddMMyyyy')
        this.reports.ReportsNo = "33";
        this.reports.ReportFormatType = "2";
        this.spinner.show();
        this._reports.reportDynamic(this.reports, this.zone, this.branch, this.circle, this.tourDiary)
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
        this.circle = data.final_circle
    }
}

interface searchLoanCasesByCnic {
    LcNo: string;
}

export class TourDiaryReport{
    Ppno: string;
    StartDate: string;
    EndDate: string
}
