/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BufricationOfOsBalancesLcComponent } from '../bufrication-of-os-balances-lc/bufrication-of-os-balances-lc.component';
import { DueInstallmentsComponent } from '../early-warning-reports/due-installments/due-installments.component';
import { EarlyWarningReportsComponent } from '../early-warning-reports/early-warning-reports.component';
import { LoanAmountsConvertToDefaultComponent } from '../early-warning-reports/loan-amounts-convert-to-default/loan-amounts-convert-to-default.component';
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
    const dialogRef = this.dialog.open(SearchLoanCasesByCnicComponent, { width: "w-100", height: "700px", disableClose: true });
    dialogRef.afterClosed().subscribe((res)=>{
      if(!res){
        return
      }
    })
  }

  bufrictionOfOSBalances(){
    const dialogRef = this.dialog.open(BufricationOfOsBalancesLcComponent, { width: "w-100", height: "700px", disableClose: true });
    dialogRef.afterClosed().subscribe((res)=>{
      if(!res){
        return
      }
    })
  }

  updatedListOfDefaulters(){
    const dialogRef = this.dialog.open(UpdatedListOfDefaultersComponent, { width: "w-100", height: "700px", disableClose: true });
    dialogRef.afterClosed().subscribe((res)=>{
      if(!res){
        return
      }
    })
  }

  faViewCircleWise(){
    const dialogRef = this.dialog.open(FaViewCircleWiseComponent, { width: "w-100", height: "700px", disableClose: true });
    dialogRef.afterClosed().subscribe((res)=>{
      if(!res){
        return
      }
    })
  }

  earlyWarningReports(){
    const dialogRef = this.dialog.open(EarlyWarningReportsComponent, { width: "w-100", height: "700px", disableClose: true });
    dialogRef.afterClosed().subscribe((res)=>{
      if(!res){
        return
      }
    })
  }

  dueInstallments(){
    const dialogRef = this.dialog.open(DueInstallmentsComponent, { width: "w-100", height: "700px", disableClose: true });
    dialogRef.afterClosed().subscribe((res)=>{
      if(!res){
        return
      }
    })
  }

  loanAmountConvertToDefault(){
    const dialogRef = this.dialog.open(LoanAmountsConvertToDefaultComponent, { width: "w-100", height: "700px", disableClose: true });
    dialogRef.afterClosed().subscribe((res)=>{
      if(!res){
        return
      }
    })
  }

}
