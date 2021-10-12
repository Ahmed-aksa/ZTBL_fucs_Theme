// Angular
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'kt-alert-dialog',
  templateUrl: './alert-dialog-warn.component.html',
  styles: []
})
export class AlertDialogWarnComponent implements OnInit {
  // Public properties
  viewLoading = false;
  Remarks: string = "";
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<DeleteEntityDialogComponent>
	 * @param data: any
	 */
  constructor(
    public dialogRef: MatDialogRef<AlertDialogWarnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
  ngOnInit() {
  }

	/**
	 * Close dialog with false result
	 */
  onNoClick(): void {
    this.dialogRef.close();
  }

  getTitle() {

    debugger;
    if (this.data.bit > 0) {
      return 'Unblock';
    }
    return 'Block';
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
