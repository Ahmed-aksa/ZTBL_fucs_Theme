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
import { DailyVoucherProofComponent } from './daily-voucher-proof/daily-voucher-proof.component';
import { AffidavitForLegalHeirsComponent } from './affidavit-for-legal-heirs/affidavit-for-legal-heirs.component';
import { PaymentBehaviorComponent } from './payment-behavior/payment-behavior.component';
import { VoucherPostingDayComponent } from './voucher-posting-day/voucher-posting-day.component';
import { DisbursementPerformanceReportComponent } from './disbursement-performance-report/disbursement-performance-report.component';
import { DisbursementPerformancePurposeWiseComponent } from './disbursement-performance-purpose-wise/disbursement-performance-purpose-wise.component';
import { InsuranceReportComponent } from './insurance-report/insurance-report.component';
import { LoanAccountBalanceComponent } from './loan-account-balance/loan-account-balance.component';
import { LaFileProgressComponent } from './la-file-progress/la-file-progress.component';
import { LoanInformationDetailComponent } from './loan-information-detail/loan-information-detail.component';
import { GetUnsuccessfulLoginComponent } from './get-unsuccessful-login/get-unsuccessful-login.component';
import { HoZonalExpenseComponent } from './ho-zonal-expense/ho-zonal-expense.component';
import { MarkOnCaComponent } from './mark-on-ca/mark-on-ca.component';
import { RecoveryScheduleComponent } from './recovery-schedule/recovery-schedule.component';
import { LoanMoveComponent } from './loan-move/loan-move.component';
import { GlMoveComponent } from './gl-move/gl-move.component';
import { StatementOfAffairsComponent } from './statement-of-affairs/statement-of-affairs.component';
import { ReschedulementOfLoanComponent } from './reschedulement-of-loan/reschedulement-of-loan.component';
import { GetCustomerLegalHeirsComponent } from './get-customer-legal-heirs/get-customer-legal-heirs.component';
import { CustomerCwrComponent } from './customer-cwr/customer-cwr.component';
import { PrintLoanBookletComponent } from './print-loan-booklet/print-loan-booklet.component';
import { UserActivityBasedReportComponent } from './user-activity-based-report/user-activity-based-report.component';
import { EnablingDisablingUserOvertimeComponent } from './enabling-disabling-user-overtime/enabling-disabling-user-overtime.component';

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
        path: 'bifurcation-of-os-balances-lc',
        component: BufricationOfOsBalancesLcComponent
    },
    {
        path: 'fa-view-wise',
        component: FaViewCircleWiseComponent
    },
    {
        path: 'early-warning-reports',
        component: EarlyWarningReportsComponent
    },
    {
        path: 'updated-list-of-defaulter',
        component: UpdatedListOfDefaultersComponent
    },
    {
        path: 'loan-amount',
        component: LoanAmountsConvertToDefaultComponent
    },
    {
        path: 'voucher-posting-day-book',
        component: VoucherPostingDayComponent
    },
    {
        path: 'daily-voucher-proof-listing',
        component: DailyVoucherProofComponent
    },
    {
        path: 'affidavit-for-legal-heirs',
        component: AffidavitForLegalHeirsComponent
    },
    {
        path: 'payment-behavior',
        component: PaymentBehaviorComponent
    },
    {
        path: 'disbursement-performance-report',
        component: DisbursementPerformanceReportComponent
    },
    {
        path: 'disbursement-performance-report-purpose-wise',
        component: DisbursementPerformancePurposeWiseComponent
    },
    {
        path: 'loan-account-balance',
        component: LoanAccountBalanceComponent
    },
    {
        path: 'insurance-report',
        component: InsuranceReportComponent
    },
    {
        path: 'la-file-progress-summary',
        component: LaFileProgressComponent
    },
    {
        path: 'loan-information-details',
        component: LoanInformationDetailComponent
    },
    {
        path: 'get-unsuccessful-login',
        component: GetUnsuccessfulLoginComponent
    },
    {
        path: 'ho-zonal-expense-report',
        component: HoZonalExpenseComponent
    },
    {
        path: 'mark-on-ca-report',
        component: MarkOnCaComponent
    },
    {
        path: 'recovery-schedule',
        component: RecoveryScheduleComponent
    },
    {
        path: 'loan-move',
        component: LoanMoveComponent
    },
    {
        path: 'statement-of-affairs-report',
        component: StatementOfAffairsComponent
    },
    {
        path: 'reschedulement-of-loan',
        component: ReschedulementOfLoanComponent
    },
    {
        path: 'get-customer-legal-heirs',
        component: GetCustomerLegalHeirsComponent
    },
    {
        path: 'customer-cwr',
        component: CustomerCwrComponent
    },
    {
        path: 'gl-move',
        component: GlMoveComponent
    },
    {
        path: 'print-loan-booklet',
        component: PrintLoanBookletComponent
    },
    {
        path: 'user-activity-based-report',
        component: UserActivityBasedReportComponent
    },
    {
        path: 'enabling-disabling-user-overtime',
        component: EnablingDisablingUserOvertimeComponent
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
        LoanAccountBalanceComponent,
        LaFileProgressComponent,
        LoanInformationDetailComponent,
        GetUnsuccessfulLoginComponent,
        HoZonalExpenseComponent,
        MarkOnCaComponent,
        RecoveryScheduleComponent,
        LoanMoveComponent,
        GlMoveComponent,
        StatementOfAffairsComponent,
        ReschedulementOfLoanComponent,
        GetCustomerLegalHeirsComponent,
        CustomerCwrComponent,
        PrintLoanBookletComponent,
        UserActivityBasedReportComponent,
        EnablingDisablingUserOvertimeComponent,
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
export class ReportsModule {}
