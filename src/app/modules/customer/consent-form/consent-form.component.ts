import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-consent-form',
    templateUrl: './consent-form.component.html',
    styleUrls: ['./consent-form.component.scss']
})


export class ConsentFormComponent implements OnInit {


    viewLoading = false;
    Remarks: string = "";

    /**
     * Component constructor
     *
     * @param dialogRef: MatDialogRef<DeleteEntityDialogComponent>
     * @param data: any
     */
    constructor(
        public dialogRef: MatDialogRef<ConsentFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private toaster: ToastrService
    ) {
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */
    agreed: boolean = false;

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

    /**
     * Close dialog with true result
     */
    onYesClick(): void {
        /* Server loading imitation. Remove this */
        if (this.agreed) {
            this.viewLoading = true;
            setTimeout(() => {
                this.dialogRef.close({data: this.Remarks}); // Keep only this row
            }, 2500);
        } else {
            this.toaster.error("Please accept terms and conditions")
        }
    }
}
