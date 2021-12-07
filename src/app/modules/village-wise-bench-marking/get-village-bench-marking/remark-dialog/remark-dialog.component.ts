/* eslint-disable arrow-parens */
/* eslint-disable no- */
/* eslint-disable prefer-const */
/* eslint-disable eol-last */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {LayoutUtilsService} from "../../../../shared/services/layout-utils.service";

@Component({
    selector: 'app-remark-dialog',
    templateUrl: './remark-dialog.component.html',
    styleUrls: ['./remark-dialog.component.scss']
})
export class RemarkDialogComponent implements OnInit {

    remarkForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<RemarkDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder, private layoutUtilsService: LayoutUtilsService,
    ) {
    }


    ngOnInit() {
        this.remarkForm = this.fb.group({
            Remarks: ['', Validators.required]
        })
    }

    close(result: any): void {
        this.dialogRef.close(result);
    }

    submit() {

        if (!this.remarkForm.controls.Remarks.value) {
            var Message = 'Please Enter Remarks';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }


        var res = this.remarkForm.controls.Remarks.value;
        this.dialogRef.close(res)
    }

}
