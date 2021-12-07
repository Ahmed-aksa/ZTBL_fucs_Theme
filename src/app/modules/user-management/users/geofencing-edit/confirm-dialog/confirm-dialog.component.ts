import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'kt-confirm-dialog',
    templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
    }

}
