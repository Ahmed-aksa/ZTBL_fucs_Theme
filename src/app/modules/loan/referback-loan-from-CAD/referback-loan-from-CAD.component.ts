import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DatePipe} from '@angular/common';
import {NgxSpinnerService} from 'ngx-spinner';

import {finalize} from 'rxjs/operators';

import {ActivatedRoute, Router} from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {DateFormats, Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {Loan, SearchLoan} from 'app/shared/models/Loan.model';
import {MatTableDataSource} from '@angular/material/table';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LoanService} from 'app/shared/services/loan.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {LovService} from 'app/shared/services/lov.service';


@Component({
    selector: 'kt-referback-loan-from-CAD',
    templateUrl: './referback-loan-from-CAD.component.html',
    styles: [],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ]
})
export class ReferbackLoanFromCADComponent implements OnInit {

    @Input() loanDetail: Loan;
    loanSearch: FormGroup;
    loanFilter = new SearchLoan();
    LoggedInUserInfo: BaseResponseModel;
    dataSource = new MatTableDataSource();
    loggedInUserDetails: any;
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

    editLoan(updateLoan) {
        console.log(this.activatedRoute)
        this.router.navigate(['../create', {
            LnTransactionID: updateLoan.LoanAppID,
            Lcno: updateLoan.LoanCaseNo
        }], {relativeTo: this.activatedRoute});
    }

    CheckEditStatus(loan) {

        if (loan.CreatedBy == this.LoggedInUserInfo.User.UserId) {
            return true
        } else {
            return false
        }
    }

    createForm() {
        this.loanSearch = this.filterFB.group({
            LcNo: [this.loanFilter.LcNo],
            AppNo: [this.loanFilter.AppNo],
            Appdt: [this.loanFilter.Appdt],
            Status: ["9"]
        });
    }

    CheckViewStatus(loan: any) {


                if (loan.CreatedBy == this.LoggedInUserInfo.User.UserId) {
                    return true;
                } else {
                    return false;
                }

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
            this.searchLoan();
        }

    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
    }

    searchLoan() {
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
        this.loanFilter.Appdt = this.datePipe.transform(this.loanFilter.Appdt, 'ddMMyyyy');

        this.spinner.show();
        this._loanService.searchLoanApplication(this.loanFilter, this.zone, this.branch)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.dataSource.data = baseResponse.Loan.ApplicationHeaderList;
                } else {
                    this.dataSource.data = [];
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code)
                }
            });

    }

    ApplyOrr(updateLoan) {
        this.router.navigate(
            ['../save-orr',
                {LnTransactionID: updateLoan.LoanAppID, Lcno: updateLoan.LoanCaseNo}],
            {relativeTo: this.activatedRoute}
        );
    }

    ViewOrr(updateLoan) {
        this.router.navigate(
            ['../../loan-recovery/loan-inquiry',
                {LnTransactionID: updateLoan.LoanAppID, Lcno: updateLoan.LoanCaseNo}],
            {relativeTo: this.activatedRoute}
        );
    }
}
