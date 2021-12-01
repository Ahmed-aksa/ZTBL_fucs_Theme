import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-eligibility-log-detail',
    templateUrl: './eligibility-log-detail.component.html',
    styleUrls: ['./eligibility-log-detail.component.scss']
})
export class EligibilityLogDetailComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<EligibilityLogDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }

    ngOnInit(): void {
        this.data = this.data.EligibilityLog;
    }

    onNoClick() {
        this.dialogRef.close();
    }
}
