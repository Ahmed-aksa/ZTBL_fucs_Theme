import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RecoveryService } from '../../../shared/services/recovery.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { LayoutUtilsService } from '../../../shared/services/layout_utils.service';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
    selector: 'app-signature-dailog-dairy',
    templateUrl: './signature-dailog-dairy.component.html',
    styleUrls: ['./signature-dailog-dairy.component.scss'],
})
export class SignatureDailogDairyComponent implements OnInit {
    @ViewChild(SignaturePad, { static: true }) signaturePad: SignaturePad;
    submitted = false;
    imageFile: any;
    isSignatureAdded = false;
    public signaturePadOptions: Object = {
        // passed through to szimek/signature_pad constructor
        minWidth: 5,
        canvasWidth: 500,
        canvasHeight: 300,
        backgroundColor: 'rgb(255,255,255)',
    };
    constructor(
        public dialogRef: MatDialogRef<SignatureDailogDairyComponent>,
        //@Inject(MAT_DIALOG_DATA) public data: any,
        private _recoveryService: RecoveryService,
        private spinner: NgxSpinnerService,
        private layoutUtilsService: LayoutUtilsService,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        // this.signaturePad is now available
        this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
        this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    }

    drawComplete() {
        this.isSignatureAdded = true;
        // will be notified of szimek/signature_pad's onEnd event
        var base64 = this.signaturePad.toDataURL('image/jpeg');
        this.imageFile = base64.replace('data:image/jpeg;base64,', '');
    }

    drawStart() {
        // will be notified of szimek/signature_pad's onBegin event
        
    }
    saveSignature() {}

    close(bySystem: Boolean): void {
        this.dialogRef.close(bySystem);
    }

    clearSignature(): void {
        this.signaturePad.clear();
        this.imageFile = '';
        this.isSignatureAdded = false;
    }
}
