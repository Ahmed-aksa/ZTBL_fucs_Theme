/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no- */
/* eslint-disable eol-last */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {SearchLoanCaseByCnic} from '../class/reports';
import {ReportsService} from '../service/reports.service';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'early-warning-reports',
    templateUrl: './early-warning-reports.component.html',
    styleUrls: ['./early-warning-reports.component.scss']
})
export class EarlyWarningReportsComponent implements OnInit, AfterViewInit {
    displayedColumns = ['GL','Zone', 'Branch', 'Circle','Ndd', 'DueAmount', 'Lcno', 'Cnic', 'PD','CD', 'Caste','Name', 'FatherName', 'Address', 'Los', 'descr', 'OtherCharges'];
    searchCnicForm: FormGroup;
    loaded = true;
    public reports = new SearchLoanCaseByCnic();

    matTableLenght = false;
    loading = false;

    daysLov;

    itemsPerPage = 10;
    pageIndex = 1;
    totalItems: number | any;
    dv: number | any; //use later
    gridHeight: string;

    dataSource: MatTableDataSource<searchLoanCasesByCnic>;

    LoggedInUserInfo: BaseResponseModel;

    user: any = {}
    private branch: any;
    private zone: any;
    private circle: any;

    statusLov: any;
    public LovCall = new Lov();


    constructor(
        private fb: FormBuilder,
        private _reports: ReportsService,
        private userUtilsService: UserUtilsService,
        private spinner: NgxSpinnerService,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private toastr: ToastrService
    ) {
    }


    ngOnInit(): void {

        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm()
        this.dayLov();

    }

    createForm() {
        this.searchCnicForm = this.fb.group({
            days: [null, Validators.required],
        })
    }

    async dayLov(){
        this.daysLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.EarlyWarningDays});
        this.daysLov = this.daysLov.LOVs;
        console.log(this.daysLov)
    }

    find() {

        if (this.searchCnicForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.searchCnicForm.markAllAsTouched()
            return;
        }


        this.reports = Object.assign(this.reports, this.searchCnicForm.value);
        this.reports.ReportsNo = "17";
        this.spinner.show();
        this._reports.reportDynamic(this.reports, this.zone, this.branch, this.circle)
            .pipe(
                finalize(() => {
                    this.loaded = true;
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {

                    this.loading = true;

                    this.dataSource = baseResponse.ReportsFilterCustom.SamNplLoans

                } else {

                    this.layoutUtilsService.alertElement("", baseResponse.Message);

                    this.dataSource = null;


                }
            })
    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle
    }



    // async typeLov() {
    //     this.statusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.BifurcationLCStatus});
    //     this.statusLov = this.statusLov.LOVs;
    //     this.searchCnicForm.controls["AccountStatus"].setValue(this.statusLov ? this.statusLov[0].Value : "")
    //
    // }

    ngAfterViewInit() {

        this.gridHeight = window.innerHeight - 335 + 'px';
    }


}

interface searchLoanCasesByCnic {
    LcNo: string;
}

export interface Selection {
    Value: string;
    description: string;
}
