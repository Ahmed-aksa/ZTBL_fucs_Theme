/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {BufricationOfOsBalancesLcComponent} from '../bufrication-of-os-balances-lc/bufrication-of-os-balances-lc.component';
import {EarlyWarningReportsComponent} from '../early-warning-reports/early-warning-reports.component';
import {LoanAmountsConvertToDefaultComponent} from '../loan-amounts-convert-to-default/loan-amounts-convert-to-default.component';
import {FaViewCircleWiseComponent} from '../fa-view-circle-wise/fa-view-circle-wise.component';
import {SearchLoanCasesByCnicComponent} from '../search-loan-cases-by-cnic/search-loan-cases-by-cnic.component';
import {UpdatedListOfDefaultersComponent} from '../updated-list-of-defaulters/updated-list-of-defaulters.component';
import {VoucherPostingDayComponent} from "../voucher-posting-day/voucher-posting-day.component";
import {DailyVoucherProofComponent} from "../daily-voucher-proof/daily-voucher-proof.component";
import {PaymentBehaviorComponent} from "../payment-behavior/payment-behavior.component";
import {AffidavitForLegalHeirsComponent} from "../affidavit-for-legal-heirs/affidavit-for-legal-heirs.component";
import {DisbursementPerformanceReportComponent} from "../disbursement-performance-report/disbursement-performance-report.component";
import {DisbursementPerformancePurposeWiseComponent} from "../disbursement-performance-purpose-wise/disbursement-performance-purpose-wise.component";
import {LoanAccountBalanceComponent} from "../loan-account-balance/loan-account-balance.component";
import {InsuranceReportComponent} from "../insurance-report/insurance-report.component";
import {LaFileProgressComponent} from "../la-file-progress/la-file-progress.component";
import {LoanInformationDetailComponent} from "../loan-information-detail/loan-information-detail.component";

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

    constructor(
        private dialog: MatDialog,
        private router: Router
    ) {
    }

    ngOnInit(): void {
    }

    bufrictionOfOSBalances(){
        const dialogRef = this.dialog.open(BufricationOfOsBalancesLcComponent, {panelClass: ['w-8/12'], height: "700px", disableClose: true });
        dialogRef.afterClosed().subscribe((res)=>{
            if(!res){
                return
            }
        })
    }

    voucherPostingDay(){
        const dialogRef = this.dialog.open(VoucherPostingDayComponent, {panelClass: ['w-8/12'], height: "700px", disableClose: true });
        dialogRef.afterClosed().subscribe((res)=>{
            if(!res){
                return
            }
        })
    }

    dailyVoucherProof(){
        const dialogRef = this.dialog.open(DailyVoucherProofComponent, {panelClass: ['w-8/12'], height: "700px", disableClose: true });
        dialogRef.afterClosed().subscribe((res)=>{
            if(!res){
                return
            }
        })
    }

    paymentBehavior(){
        const dialogRef = this.dialog.open(PaymentBehaviorComponent, {panelClass: ['w-8/12'], height: "700px", disableClose: true });
        dialogRef.afterClosed().subscribe((res)=>{
            if(!res){
                return
            }
        })
    }

    affidavitForLegalHeirs(){
        const dialogRef = this.dialog.open(AffidavitForLegalHeirsComponent, {panelClass: ['w-8/12'], height: "700px", disableClose: true });
        dialogRef.afterClosed().subscribe((res)=>{
            if(!res){
                return
            }
        })
    }

    disbursement(){
        const dialogRef = this.dialog.open(DisbursementPerformanceReportComponent, {panelClass: ['w-8/12'], height: "700px", disableClose: true });
        dialogRef.afterClosed().subscribe((res)=>{
            if(!res){
                return
            }
        })
    }

    disbursementPurposeWise(){
        const dialogRef = this.dialog.open(DisbursementPerformancePurposeWiseComponent, {panelClass: ['w-8/12'], height: "700px", disableClose: true });
        dialogRef.afterClosed().subscribe((res)=>{
            if(!res){
                return
            }
        })
    }

    loanAccountBalance(){
        const dialogRef = this.dialog.open(LoanAccountBalanceComponent, {panelClass: ['w-8/12'], height: "700px", disableClose: true });
        dialogRef.afterClosed().subscribe((res)=>{
            if(!res){
                return
            }
        })
    }

    insuranceReport(){
        const dialogRef = this.dialog.open(InsuranceReportComponent, {panelClass: ['w-8/12'], height: "700px", disableClose: true });
        dialogRef.afterClosed().subscribe((res)=>{
            if(!res){
                return
            }
        })
    }

    laFileProgress(){
        const dialogRef = this.dialog.open(LaFileProgressComponent, {panelClass: ['w-8/12'], height: "700px", disableClose: true });
        dialogRef.afterClosed().subscribe((res)=>{
            if(!res){
                return
            }
        })
    }

    loanInfoDetails(){
        const dialogRef = this.dialog.open(LoanInformationDetailComponent, {panelClass: ['w-8/12'], height: "700px", disableClose: true });
        dialogRef.afterClosed().subscribe((res)=>{
            if(!res){
                return
            }
        })
    }
}
