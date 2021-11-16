/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import { EarlyWarningReportsComponent } from './early-warning-reports/early-warning-reports.component';
import { BufricationOfOsBalancesLcComponent } from './bufrication-of-os-balances-lc/bufrication-of-os-balances-lc.component';
import { DueInstallmentsComponent } from './early-warning-reports/due-installments/due-installments.component';
import { LoanAmountsConvertToDefaultComponent } from './early-warning-reports/loan-amounts-convert-to-default/loan-amounts-convert-to-default.component';
import { UpdatedListOfDefaultersComponent } from './updated-list-of-defaulters/updated-list-of-defaulters.component';
import { SearchLoanCasesByCnicComponent } from './search-loan-cases-by-cnic/search-loan-cases-by-cnic.component';
import { FaViewCircleWiseComponent } from './fa-view-circle-wise/fa-view-circle-wise.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

const routing = [
  {
      path: '',
      component: ReportsComponent
  },
]


@NgModule({
  declarations: [
    ReportsComponent,
    EarlyWarningReportsComponent,
    BufricationOfOsBalancesLcComponent,
    DueInstallmentsComponent,
    LoanAmountsConvertToDefaultComponent,
    UpdatedListOfDefaultersComponent,
    SearchLoanCasesByCnicComponent,
    FaViewCircleWiseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routing),
    SharedModule
  ],
  entryComponents:[
    EarlyWarningReportsComponent,
    BufricationOfOsBalancesLcComponent,
    UpdatedListOfDefaultersComponent,
    SearchLoanCasesByCnicComponent,
    FaViewCircleWiseComponent,
    DueInstallmentsComponent,
    LoanAmountsConvertToDefaultComponent 
  ]
})
export class ReportsModule { }
