/* eslint-disable no-var */
/* eslint-disable no-trailing-spaces */
/* eslint-disable eqeqeq */
/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
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
    selector: 'fa-view-circle-wise',
    templateUrl: './fa-view-circle-wise.component.html',
    styleUrls: ['./fa-view-circle-wise.component.scss']
})
export class FaViewCircleWiseComponent implements OnInit, AfterViewInit {
    displayedColumns = ['Zone', 'Branch', 'Circle', 'Dob', 'Ndd', 'MajorBorrower', 'Lcno', 'Cnic', 'Name', 'FatherName', 'Address', 'Bcl', 'Los', 'descr', 'OtherCharges'];
    searchCnicForm: FormGroup;
    loaded = true;

    public reports = new SearchLoanCaseByCnic();

    matTableLenght = false;
    loading = false;

    itemsPerPage = 10;
    pageIndex = 1;
    totalItems: number | any;
    dv: number | any; //use later
    gridHeight: string;

    dataSource: MatTableDataSource<searchLoanCasesByCnic>;

    LoggedInUserInfo: BaseResponseModel;
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
        this.typeLov();
        //this.searchCnicForm.controls["PPNO"].setValue(this.LoggedInUserInfo.User.UserName);
    }

    value(event) {


    }

    createForm() {
        this.searchCnicForm = this.fb.group({
            Status: [null, Validators.required]
        })
    }

    find() {


        if (this.searchCnicForm.invalid) {
            this.toastr.error("Please enter required fields");
            this.searchCnicForm.markAllAsTouched()
            return;
        }

        this.reports = Object.assign(this.reports, this.searchCnicForm.value);
        this.reports.ReportsNo = "16";
        this.reports.BranchName = this.branch.BranchName;
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
                    this.dv = this.dataSource;
                    this.matTableLenght = true

                    this.totalItems = baseResponse.ReportsFilterCustom.SamNplLoans[0].TotalRecords
                } else {

                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    this.loading = false;
                    // this.matTableLenght = false;
                    this.dataSource = null;
                    //this.offSet = 0;
                    this.pageIndex = 1;

                }
            })
    }


    async typeLov() {

        this.statusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.BifurcationLCStatus});
        this.statusLov = this.statusLov.LOVs;
        this.searchCnicForm.controls["Status"].setValue(this.statusLov ? this.statusLov[0].Value : "")

    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle
    }

    ngAfterViewInit() {

        this.gridHeight = window.innerHeight - 200 + 'px';
    }
}

interface searchLoanCasesByCnic {
    LcNo: string;
}
