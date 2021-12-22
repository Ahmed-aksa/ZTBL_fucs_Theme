import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DatePipe} from '@angular/common';
import {NgxSpinnerService} from 'ngx-spinner';

import {finalize} from 'rxjs/operators';

import {ActivatedRoute, Router} from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {DateFormats, Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {Loan, SearchDBR, SearchLoan} from 'app/shared/models/Loan.model';
import {MatTableDataSource} from '@angular/material/table';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LoanService} from 'app/shared/services/loan.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {LovService} from 'app/shared/services/lov.service';


@Component({
    selector: 'kt-search-dbr',
    templateUrl: './search-dbr.component.html',
    styles: [],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ]
})
export class SearchDbrComponent implements OnInit {

    @Input() loanDetail: Loan;
    loanSearch: FormGroup;
    loanFilter = new SearchDBR();
    LoggedInUserInfo: BaseResponseModel;
    dataSource = new MatTableDataSource();

    public LovCall = new Lov();

    //Loan Status inventory
    LoanStatus: any = [];
    loanStatus: any = [];
    SelectedLoanStatus: any = [];

    circle: any = [];

    loggedInUserIsAdmin: boolean = false;

    displayedColumns = ['BranchName', 'AppDate', 'AppNumberManual', 'LoanCaseNo', 'ApplicationTitle', 'DevAmount', 'ProdAmount', 'StatusName', 'Action'];

    gridHeight: string;

    zone: any;
    branch: any;

    matTableLenght = false;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    OffSet: number = 0;
    dv: number | any; //use later

    constructor(
        private spinner: NgxSpinnerService,
        private filterFB: FormBuilder,
        private _loanService: LoanService,
        private layoutUtilsService: LayoutUtilsService,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private datePipe: DatePipe
    ) {
    }

    ngOnInit() {
        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

        if (this.LoggedInUserInfo.Branch?.BranchCode == 'All') {
            this.loggedInUserIsAdmin = true;
        }

        this.createForm();
        this.getLoanStatus();
    }


    createForm() {
        this.loanSearch = this.filterFB.group({
            LcNo: [this.loanFilter.LcNo],
        });
    }

    //-------------------------------Loan Status Functions-------------------------------//
    async getLoanStatus() {
        this.LoanStatus = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.LoanStatus});
        this.SelectedLoanStatus = this.LoanStatus.LOVs;

    }

    searchLoanStatus(loanStatusId) {
        loanStatusId = loanStatusId.toLowerCase();
        if (loanStatusId != null && loanStatusId != undefined && loanStatusId != '') {
            this.SelectedLoanStatus = this.LoanStatus.LOVs.filter(x => x.Name.toLowerCase().indexOf(loanStatusId) > -1);
        } else {
            this.SelectedLoanStatus = this.LoanStatus.LOVs;
        }
    }

    validateLoanStatusOnFocusOut() {
        if (this.SelectedLoanStatus.length == 0) {
            this.SelectedLoanStatus = this.LoanStatus;
        }
    }


    ngAfterViewInit() {
        this.gridHeight = window.innerHeight - 400 + 'px';
        if (this.zone) {
            this.searchDBR();
        }

    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
    }

    searchDBR(from_Search = false) {
        const controls = this.loanSearch.controls;
        if (this.loanSearch.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            return;
        }
        Object.keys(controls).forEach(controlName =>
            controls[controlName].value == undefined || controls[controlName].value == null ? controls[controlName].setValue('') : controls[controlName].value
        );
        this.loanFilter = Object.assign(this.loanFilter, this.loanSearch.getRawValue());
        this.loanFilter.ZoneId = this.zone.ZoneId;
        this.loanFilter.BranchId = this.branch.BranchId;
        // this.loanFilter.Appdt = this.datePipe.transform(this.loanFilter.Appdt, 'ddMMyyyy');

        if (from_Search == true) {
            this.OffSet = 0;
        }
        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();

        this.spinner.show();
        this._loanService.searchDBR(this.loanFilter, this.zone, this.branch, count, currentIndex)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.matTableLenght = true;
                    this.dataSource.data = baseResponse.Loan.ApplicationHeaderList;
                    this.dv = this.dataSource.data;
                    this.dataSource = this.dv?.slice(0, this.itemsPerPage);
                } else {

                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code)
                    this.dataSource = this.dv?.splice(1, 0);
                    this.matTableLenght = false;
                }
            });

    }
    CheckEditStatus(loan) {
        if (loan.CreatedBy == this.LoggedInUserInfo.User.UserId) {
            return true
        } else {
            return false
        }
    }

    CheckViewStatus(loan) {
        if (loan.CreatedBy == this.LoggedInUserInfo.User.UserId) {
            return true
        } else {
            return false
        }
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {

        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.searchDBR()
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }


    paginateAs(pageIndex: any, pageSize: any = this.itemsPerPage) {

    }

    EditDBR(updateLoan) {
        // this.router.navigate(
        //     ['../save-orr',
        //         {LnTransactionID: updateLoan.LoanAppID, Lcno: updateLoan.LoanCaseNo}],
        //     {relativeTo: this.activatedRoute}
        // );
        this.router.navigate(
            ['../calculte-dbr',
                { LnTransactionID: updateLoan.LoanAppID,Lcno: updateLoan.LoanCaseNo ,Flag:"1"}],
            { relativeTo: this.activatedRoute }
        );
    }

    ViewDBR(updateLoan) {
        this.router.navigate(
            ['../../loan-recovery/loan-inquiry',
                {LnTransactionID: updateLoan.LoanAppID, Lcno: updateLoan.LoanCaseNo}],
            {relativeTo: this.activatedRoute}
        );
    }
}
