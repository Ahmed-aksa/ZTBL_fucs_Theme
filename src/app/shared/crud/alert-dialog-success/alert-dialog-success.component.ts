import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'kt-alert-dialog-success',
  templateUrl: './alert-dialog-success.component.html'
})
export class AlertDialogSuccessComponent implements OnInit {
  viewLoading = false;
  headerLogo: string;
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<DeleteEntityDialogComponent>
	 * @param data: any
	 */
  constructor(
    public dialogRef: MatDialogRef<AlertDialogSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
  ngOnInit() {
    debugger;
    if (this.data.code == "00" || this.data.code == "0")
      this.data.code = "";
      this.headerLogo = './assets/media/logos/ZTBL-logo.png';
  }

	/**
	 * Close dialog with false result
	 */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
