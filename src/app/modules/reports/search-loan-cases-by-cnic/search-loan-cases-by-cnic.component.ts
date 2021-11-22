/* eslint-disable max-len */
/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-debugger */
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
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {SearchLoanCaseByCnic} from '../class/reports';
import {ReportsService} from '../service/reports.service';

@Component({
    selector: 'search-loan-cases-by-cnic',
    templateUrl: './search-loan-cases-by-cnic.component.html',
    styleUrls: ['./search-loan-cases-by-cnic.component.scss']
})
export class SearchLoanCasesByCnicComponent implements OnInit {
    displayedColumns = ['Lcno', 'Cnic', 'Name', 'FatherName', 'Address', 'Agps','Bcl', 'Los'];
    searchCnicForm: FormGroup;
    selected_b;
    selected_z;
    selected_c;
    loaded = true;
    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;

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


    constructor(
        private fb: FormBuilder,
        private _reports: ReportsService,
        private userUtilsService: UserUtilsService,
        private spinner: NgxSpinnerService,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
    ) {
    }

    ngOnInit(): void {
        debugger
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();
    }

    createForm() {
        this.searchCnicForm = this.fb.group({
            Cnic: [null],
            CustomerName: [null],
            FatherName: [null]
        })
    }


    find() {

        if ((this.searchCnicForm.controls.Cnic.value == null || this.searchCnicForm.controls.Cnic.value == '') && (this.searchCnicForm.controls.CustomerName.value == null || this.searchCnicForm.controls.CustomerName.value == '') && (this.searchCnicForm.controls.FatherName.value == null || this.searchCnicForm.controls.FatherName.value == '')) {
            this.layoutUtilsService.alertElement('', 'Atleast add any one field among Cnic, Father Name or Customer Name')
            return
        }

        this.user.Zone = this.zone
        this.user.Branch = this.branch
        this.user.Circle = this.circle

        this.reports = Object.assign(this.reports, this.searchCnicForm.value);
        this.reports.ReportsNo = "14";
        this.spinner.show();
        this._reports.reportDynamic(this.user, this.reports)
            .pipe(
                finalize(() => {
                    this.loaded = true;
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: any) => {
                if (baseResponse.Success === true) {

                    this.loading = true;
                    this.dataSource = baseResponse.ReportsFilterCustom.LoanCaseByCNIC
                    this.dv = this.dataSource;
                    this.matTableLenght = true
                    this.totalItems = baseResponse.ReportsFilterCustom[0].TotalRecords
                } else {

                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    this.loading = false;
                    // this.matTableLenght = false;
                    // this.dataSource = this.dv.slice(1, 0);
                    //this.offSet = 0;
                    this.pageIndex = 1;

                }
            })
    }


    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = null
    }
}

interface searchLoanCasesByCnic {
    LcNo: string;
}
