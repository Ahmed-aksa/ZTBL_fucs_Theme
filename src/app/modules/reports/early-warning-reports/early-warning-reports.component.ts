/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'early-warning-reports',
  templateUrl: './early-warning-reports.component.html',
  styleUrls: ['./early-warning-reports.component.scss']
})
export class EarlyWarningReportsComponent implements OnInit {
  viewLoading = false;
  loadingAfterSubmit = false;
  constructor(
  public dialogRef: MatDialogRef<EarlyWarningReportsComponent>,
  ) { }

  ngOnInit(): void {
  }

  onCloseClick(res){
    this.dialogRef.close(res);
  }

  // dueInstallments(){
  //   var res = "a";
  //   this.dialogRef.close(res);
  // }

  // loanAmountsConvertToDefault(){
  //   var res = "b";
  //   this.dialogRef.close(res);
  // }

}
