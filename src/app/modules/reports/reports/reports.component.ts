/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BufricationOfOsBalancesLcComponent } from '../bufrication-of-os-balances-lc/bufrication-of-os-balances-lc.component';
import { EarlyWarningReportsComponent } from '../early-warning-reports/early-warning-reports.component';
import { LoanAmountsConvertToDefaultComponent } from '../loan-amounts-convert-to-default/loan-amounts-convert-to-default.component';
import { FaViewCircleWiseComponent } from '../fa-view-circle-wise/fa-view-circle-wise.component';
import { SearchLoanCasesByCnicComponent } from '../search-loan-cases-by-cnic/search-loan-cases-by-cnic.component';
import { UpdatedListOfDefaultersComponent } from '../updated-list-of-defaulters/updated-list-of-defaulters.component';
import { VoucherPostingDayComponent } from '../voucher-posting-day/voucher-posting-day.component';
import { DailyVoucherProofComponent } from '../daily-voucher-proof/daily-voucher-proof.component';
import { PaymentBehaviorComponent } from '../payment-behavior/payment-behavior.component';
import { AffidavitForLegalHeirsComponent } from '../affidavit-for-legal-heirs/affidavit-for-legal-heirs.component';
import { DisbursementPerformanceReportComponent } from '../disbursement-performance-report/disbursement-performance-report.component';
import { DisbursementPerformancePurposeWiseComponent } from '../disbursement-performance-purpose-wise/disbursement-performance-purpose-wise.component';
import { LoanAccountBalanceComponent } from '../loan-account-balance/loan-account-balance.component';
import { InsuranceReportComponent } from '../insurance-report/insurance-report.component';
import { LaFileProgressComponent } from '../la-file-progress/la-file-progress.component';
import { LoanInformationDetailComponent } from '../loan-information-detail/loan-information-detail.component';
import { UserUtilsService } from '../../../shared/services/users_utils.service';
import { HoZonalExpenseComponent } from '../ho-zonal-expense/ho-zonal-expense.component';
import { MarkOnCaComponent } from '../mark-on-ca/mark-on-ca.component';
import { RecoveryScheduleComponent } from '../recovery-schedule/recovery-schedule.component';
import { LoanMoveComponent } from '../loan-move/loan-move.component';
import { StatementOfAffairsComponent } from '../statement-of-affairs/statement-of-affairs.component';
import { ReschedulementOfLoanComponent } from '../reschedulement-of-loan/reschedulement-of-loan.component';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
    rowLength : number;
    constructor(
        private dialog: MatDialog,
        private user: UserUtilsService,
        private router: Router
    ) {
        this.reportLength()
    }

    ngOnInit(): void {
    }

    reportLength(){
        
        var reportMenu = localStorage.getItem("ZTBLUser");
        var report = JSON.parse(reportMenu)
        report.MenuBar.forEach(x => {
            if(x.parentId == '165'){
                this.rowLength = x.children.length;
            }
        });
    }

    IsReportCardVisable(url) {
        var ismatch = false
        var user = localStorage.getItem("ZTBLUser")
        if (user) {
        var userdate = JSON.parse(user);
            userdate.MenuBar.forEach(x => {
                var childURl = x?.children?.find(y => y.link?.includes(url))
                if (childURl) {
                    ismatch = true;
                }
                else {

                }

            });
        return ismatch;
    }}
}
