/* eslint-disable no-var */
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

import {Component, OnInit} from '@angular/core';
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
    selector: 'updated-list-of-defaulters',
    templateUrl: './updated-list-of-defaulters.component.html',
    styleUrls: ['./updated-list-of-defaulters.component.scss']
})
export class UpdatedListOfDefaultersComponent implements OnInit {
    displayedColumns = ['Zone', 'Branch', 'Circle','Dob','Ndd','MajorBorrower', 'Lsn','Lcno', 'Cnic', 'Name', 'FatherName', 'Address', 'Bcl', 'Los',  'descr', 'l_stats', 'empp','OtherCharges' ];
    searchCnicForm: FormGroup;
    selected_b;
    selected_z;
    selected_c;
    loaded = true;


    public reports = new SearchLoanCaseByCnic();

    matTableLenght = false;
    loading = false;

    itemsPerPage = 10;
    pageIndex = 1;
    totalItems: number | any;
    dv: number | any; //use later

    dataSource: MatTableDataSource<searchLoanCasesByCnic>;

    LoggedInUserInfo: BaseResponseModel;

    //Zone inventory
    Zones: any = [];
    user: any = {}
    SelectedZones: any = [];

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];

    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];
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
        // this.typeLov();
    }

    createForm() {
        this.searchCnicForm = this.fb.group({})
    }


    select: Selection[] = [
        {Value: '2', description: 'Portable Document Format (PDF)'},
        {Value: '1', description: 'MS Excel (Formatted)'},
        {Value: '3', description: 'MS Excel (Data Only Non Formatted)'}
    ];

    find() {

        if (this.searchCnicForm.invalid) {
            this.toastr.error("Please enter required values");
            return;
        }
        this.user.Branch = this.branch;
        this.user.Zone = this.zone;
        this.user.Circle = this.circle


        this.reports = Object.assign(this.reports, this.searchCnicForm.value);
        this.reports.ReportsNo = "20";
        this.spinner.show();
        this._reports.updatedList(this.user, this.reports)
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
                    console.log(baseResponse);
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


    // async typeLov() {
    //     this.statusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.BifurcationLCStatus});
    //     this.statusLov = this.statusLov.LOVs;
    //     this.searchCnicForm.controls["Status"].setValue(this.statusLov ? this.statusLov[0].Value : "")
    //     console.log(this.statusLov)
    // }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle
    }

}

export interface Selection {
    Value: string;
    description: string;
}

interface searchLoanCasesByCnic {
    LcNo: string;
}

