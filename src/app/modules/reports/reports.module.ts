/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/semi */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReportsComponent} from './reports/reports.component';
import {EarlyWarningReportsComponent} from './early-warning-reports/early-warning-reports.component';
import {BufricationOfOsBalancesLcComponent} from './bufrication-of-os-balances-lc/bufrication-of-os-balances-lc.component';
import {LoanAmountsConvertToDefaultComponent} from './loan-amounts-convert-to-default/loan-amounts-convert-to-default.component';
import {UpdatedListOfDefaultersComponent} from './updated-list-of-defaulters/updated-list-of-defaulters.component';
import {SearchLoanCasesByCnicComponent} from './search-loan-cases-by-cnic/search-loan-cases-by-cnic.component';
import {FaViewCircleWiseComponent} from './fa-view-circle-wise/fa-view-circle-wise.component';
import {SharedModule} from 'app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {DailyVoucherProofComponent} from './daily-voucher-proof/daily-voucher-proof.component';
import {AffidavitForLegalHeirsComponent} from './affidavit-for-legal-heirs/affidavit-for-legal-heirs.component';
import {PaymentBehaviorComponent} from './payment-behavior/payment-behavior.component';
import {VoucherPostingDayComponent} from './voucher-posting-day/voucher-posting-day.component';
import {DisbursementPerformanceReportComponent} from './disbursement-performance-report/disbursement-performance-report.component';
import {DisbursementPerformancePurposeWiseComponent} from './disbursement-performance-purpose-wise/disbursement-performance-purpose-wise.component';
import {InsuranceReportComponent} from './insurance-report/insurance-report.component';
import {LoanAccountBalanceComponent} from './loan-account-balance/loan-account-balance.component';

const routing = [
    {
        path: '',
        component: ReportsComponent
    },
    {
        path: 'search-loan-case-by-cnic',
        component: SearchLoanCasesByCnicComponent
    },
    {
        path: 'fa-view-wise',
        component: FaViewCircleWiseComponent
    },
    {
        path: 'early-warning-reports',
        component: EarlyWarningReportsComponent
    },
    // {
    //     path: 'bifurction-of-os',
    //     component: BufricationOfOsBalancesLcComponent
    // },
    {
        path: 'updated-list',
        component: UpdatedListOfDefaultersComponent
    },
    {
        path: 'loan-amount',
        component: LoanAmountsConvertToDefaultComponent
    }
]


@NgModule({
    declarations: [
        ReportsComponent,
        EarlyWarningReportsComponent,
        BufricationOfOsBalancesLcComponent,
        LoanAmountsConvertToDefaultComponent,
        UpdatedListOfDefaultersComponent,
        SearchLoanCasesByCnicComponent,
        FaViewCircleWiseComponent,
        DailyVoucherProofComponent,
        AffidavitForLegalHeirsComponent,
        PaymentBehaviorComponent,
        VoucherPostingDayComponent,
        DisbursementPerformanceReportComponent,
        DisbursementPerformancePurposeWiseComponent,
        InsuranceReportComponent,
        LoanAccountBalanceComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routing),
        SharedModule
    ],
    entryComponents: [
        BufricationOfOsBalancesLcComponent
    ]

})
export class ReportsModule {
}
