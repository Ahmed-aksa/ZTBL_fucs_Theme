/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BufricationOfOsBalancesLcComponent } from '../bufrication-of-os-balances-lc/bufrication-of-os-balances-lc.component';
import { EarlyWarningReportsComponent } from '../early-warning-reports/early-warning-reports.component';
import { FaViewCircleWiseComponent } from '../fa-view-circle-wise/fa-view-circle-wise.component';
import { SearchLoanCasesByCnicComponent } from '../search-loan-cases-by-cnic/search-loan-cases-by-cnic.component';
import { UpdatedListOfDefaultersComponent } from '../updated-list-of-defaulters/updated-list-of-defaulters.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  searchLoanCase(){
    const dialogRef = this.dialog.open(SearchLoanCasesByCnicComponent);
  }

  bufrictionOfOSBalances(){
    const dialogRef = this.dialog.open(BufricationOfOsBalancesLcComponent);
  }

  updatedListOfDefaulters(){
    const dialogRef = this.dialog.open(UpdatedListOfDefaultersComponent);
  }

  faViewCircleWise(){
    const dialogRef = this.dialog.open(FaViewCircleWiseComponent);
  }

  earlyWarningReports(){
    const dialogRef = this.dialog.open(EarlyWarningReportsComponent);
  }

}
