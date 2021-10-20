// Angular
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'kt-alert-message',
  templateUrl: './alert-message.component.html',
  styles: []
})
export class AlertMessageComponent implements OnInit {
// Public properties
	viewLoading = false;
  headerLogo: string;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<DeleteEntityDialogComponent>
	 * @param data: any
	 */
	constructor(
    public dialogRef: MatDialogRef<AlertMessageComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		
		if (this.data.code == "00" || this.data.code == "0")

    this.headerLogo = './assets/media/logos/ZTBL-logo.png';
	}

	/**
	 * Close dialog with false result
	 */
	onNoClick(): void {
		this.dialogRef.close();
	}


}
