import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SignaturePad} from "angular2-signaturepad";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {environment} from "../../../../environments/environment";
import {map} from "rxjs/operators";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-signature-pad-for-tour',
    templateUrl: './signature-pad-for-tour.component.html',
    styleUrls: ['./signature-pad-for-tour.component.scss']
})
export class SignaturePadForTourComponent implements OnInit {
    @ViewChild(SignaturePad, {static: true}) signaturePad: SignaturePad;
    imageFile: any;
    isSignatureAdded = false;
    is_referback = true;
    public signaturePadOptions: Object = {
        // passed through to szimek/signature_pad constructor
        minWidth: 5,
        canvasWidth: 500,
        canvasHeight: 300,
        backgroundColor: 'rgb(255,255,255)',
    };
    remarks = '';

    constructor(
        public dialogRef: MatDialogRef<SignaturePadForTourComponent>,
        private http: HttpClient,
        private toaster: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit(): void {
        if (this.data.status == 'A') {
            this.is_referback = false;
        }
    }


    drawComplete() {
        this.isSignatureAdded = true;
        var base64 = this.signaturePad.toDataURL('image/jpeg');
        this.imageFile = base64.replace('data:image/jpeg;base64,', '');
    }

    drawStart() {
        // will be notified of szimek/signature_pad's onBegin event

    }

    saveSignature() {
    }

    close(bySystem: Boolean): void {
        this.dialogRef.close(bySystem);
    }

    clearSignature(): void {
        this.signaturePad.clear();
        this.imageFile = '';
        this.isSignatureAdded = false;
        this.remarks = '';
    }

    submit() {

        let formdata = new FormData();
        formdata.append('UserID', String(this.data.userId));
        formdata.append('PlanIds', this.data.ids.toString());
        formdata.append('Status', this.data.status);
        formdata.append('Remarks', this.remarks);
        if (this.data.status == 'A')
            formdata.append('Signature', this.imageFile);
        this.http
            .post<any>(
                `${environment.apiUrl}/TourPlanAndDiary/ApproveTourPlan`,
                formdata
            ).subscribe((data) => {
            if (data.Success) {
                this.toaster.success(data.Message);
                this.dialogRef.close();
            } else {
                this.toaster.error(data.Message);
            }
        });
    }
}
