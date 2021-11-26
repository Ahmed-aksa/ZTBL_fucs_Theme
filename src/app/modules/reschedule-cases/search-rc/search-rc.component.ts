/* eslint-disable eol-last */
/* eslint-disable arrow-parens */
/* eslint-disable curly */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { LovService } from '../../../shared/services/lov.service';
import {
    DateFormats,
    Lov,
    LovConfigurationKey,
} from '../../../shared/classes/lov.class';
import { BaseResponseModel } from '../../../shared/models/base_response.model';
import { MatTableDataSource } from '@angular/material/table';
import { CircleService } from '../../../shared/services/circle.service';
import { UserUtilsService } from '../../../shared/services/users_utils.service';
import { finalize } from 'rxjs/operators';
import { ReschedulingService } from '../service/rescheduling.service';
import { Loan } from '../../../shared/models/Loan.model';
import { Branch } from 'app/shared/models/branch.model';
import { Zone } from 'app/shared/models/zone.model';
import { LayoutUtilsService } from '../../../shared/services/layout_utils.service';
import { DatePipe } from '@angular/common';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
    selector: 'app-search-rc',
    templateUrl: './search-rc.component.html',
    styleUrls: ['./search-rc.component.scss'],
    providers: [
        DatePipe,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: DateFormats },
    ],
})
export class SearchRcComponent implements OnInit {
    today = new Date();
    loading: boolean;
    rcSearch: FormGroup;
    LoggedInUserInfo: BaseResponseModel;
    isZoneReadOnly: boolean;
    isBranchReadOnly: boolean;

    single_zone: boolean = true;
    disable_zone: boolean = true;

    selected_z: any;
    selected_b: any;

    single_branch: any = true;
    disable_branch: any = true;

    branch: any;
    zone: any;
    Math: any;

    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    dv: number | any; //use later

    OffSet: any;

    matTableLenght: boolean;


    public search = new Loan();
    public LovCall = new Lov();

    //Loan Status inventory
    LoanStatus: any = [];
    loanStatus: any = [];
    SelectedLoanStatus: any = [];


    displayedColumns = [
        'Branch',
        'TransactionDate',
        'LoanApp',
        'GlDescription',
        'Status',
        'Scheme',
        'OldDate',
        'AcStatus',
    ];
    dataSource: MatTableDataSource<SearchRC>;
    ELEMENT_DATA: SearchRC[] = [];
    Mydata: any;
    //Zone inventory
    Circles: any = [];
    SelectedCircles: any = [];

    constructor(
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _circleService: CircleService,
        private cdRef: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private _reschedulingService: ReschedulingService,
        private spinner: NgxSpinnerService,
        private _lovService: LovService
    ) {
        this.Math = Math;
    }

    ngOnInit() {
        this.create();
        this.isZoneReadOnly = false;
        this.isBranchReadOnly = false;

        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

        if(this.LoggedInUserInfo.Branch.WorkingDate){
            let dateString = this.LoggedInUserInfo.Branch.WorkingDate;
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));
            this.today = new Date(year, month - 1, day);
        }else{
            let dateString = '11012021';
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));
            this.today = new Date(year, month - 1, day);}

        //-------------------------------Loading Zone-------------------------------//

        //-------------------------------Loading Circle-------------------------------//

        this.getLoanStatus();

    }



    create() {
        this.rcSearch = this.fb.group({
            TrDate: [''],
            Lcno: [''],
            Status: [''],
        });
    }

    //-------------------------------Loan Status Functions-------------------------------//
    async getLoanStatus() {
        this.LoanStatus = await this._lovService.CallLovAPI(
            (this.LovCall = { TagName: LovConfigurationKey.RescheduleStatus })
        );
        this.SelectedLoanStatus = this.LoanStatus.LOVs.reverse();


    }

    searchLoanStatus(loanStatusId) {
        loanStatusId = loanStatusId.toLowerCase();
        if (
            loanStatusId != null &&
            loanStatusId != undefined &&
            loanStatusId != ''
        )
            this.SelectedLoanStatus = this.LoanStatus.LOVs.filter(
                (x) => x.Name.toLowerCase().indexOf(loanStatusId) > -1
            );
        else this.SelectedLoanStatus = this.LoanStatus.LOVs;
    }

    validateLoanStatusOnFocusOut() {
        if (this.SelectedLoanStatus.length == 0)
            this.SelectedLoanStatus = this.LoanStatus;
    }

    find() {
        debugger
        this.spinner.show();
        this.search = Object.assign(this.rcSearch.getRawValue());


        this._reschedulingService
            .RescheduleSearch(this.search, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                this.dataSource = null;
                this.ELEMENT_DATA = [];
                if (baseResponse.Success === true) {

                    this.loading = false;
                    this.Mydata = baseResponse.Loan.ReschedulingSearch;

                    for (let data in this.Mydata) {
                        this.ELEMENT_DATA.push({
                            branch: this.Mydata[data].OrgUnitName,
                            transactionDate: this.Mydata[data].WorkingDate,
                            loanApp: this.Mydata[data].LoanCaseNo,
                            glDescription: this.Mydata[data].GlDesc,
                            status: this.Mydata[data].StatusName,
                            scheme: this.Mydata[data].SchemeCode,
                            oldDate: this.Mydata[data].LastDueDate,
                            acStatus: this.Mydata[data].DisbStatusName,
                        });
                    }

                    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

                    if (this.dataSource.data.length > 0)
                        this.matTableLenght = true;
                    else this.matTableLenght = false;

                    this.dv = this.dataSource.filteredData;

                    this.totalItems = this.dataSource.filteredData.length;
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                    //
                    //
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message
                    );
                    this.dataSource = this.dv.slice(1,0)
                }
                this.loading = false;
            });
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        this.OffSet = pageIndex;
        //this.SearchJvData();
        //this.dv.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
        this.dataSource = this.dv.slice(
            pageIndex * this.itemsPerPage - this.itemsPerPage,
            pageIndex * this.itemsPerPage
        ); //slice is used to get limited amount of data from APi
    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
    }
}

interface SearchRC {
    branch: string;
    transactionDate: string;
    loanApp: string;
    glDescription: string;
    status: string;
    scheme: string;
    oldDate: string;
    acStatus: string;
}
