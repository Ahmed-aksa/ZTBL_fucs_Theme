import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'kt-alert-dialog-confirmation',
  templateUrl: './alert-dialog-confirmation.component.html'
})
export class AlertDialogConfirmationComponent implements OnInit {

  viewLoading = false;
  Remarks: string = "";
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<DeleteEntityDialogComponent>
	 * @param data: any
	 */
  constructor(
    public dialogRef: MatDialogRef<AlertDialogConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
  ngOnInit() {
    console.log(this.data);
  }

	/**
	 * Close dialog with false result
	 */
  onNoClick(): void {
    this.dialogRef.close();
  }

	/**
	 * Close dialog with true result
	 */
  onYesClick(): void {
    /* Server loading imitation. Remove this */
    this.viewLoading = true;
    setTimeout(() => {
      this.dialogRef.close({ data: this.Remarks }); // Keep only this row
    }, 2500);
  }
}
