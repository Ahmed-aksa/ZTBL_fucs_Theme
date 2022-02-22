import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SignaturePad} from "angular2-signaturepad";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {environment} from "../../../../environments/environment";
import {map} from "rxjs/operators";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-signature-pad-for-diary-approval',
    templateUrl: './app-signature-pad-for-diary-approval.html',
    styleUrls: ['./app-signature-pad-for-diary-approval.scss']
})
export class SignaturePadForDiaryApproval implements OnInit {
    @ViewChild(SignaturePad, {static: true}) signaturePad: SignaturePad;
    imageFile: any;
    isSignatureAdded = false;
    is_referback = true;

    public signaturePadOptions: Object = {
        // passed through to szimek/signature_pad constructor
        minWidth: 5,
        canvasWidth: 800,
        canvasHeight: 350,
        backgroundColor: 'rgb(255,255,255)',
    };
    remarks = '';

    constructor(
        public dialogRef: MatDialogRef<SignaturePadForDiaryApproval>,
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
        var base64 = this.signaturePad?.toDataURL('image/jpeg');
        this.imageFile = base64?.replace('data:image/jpeg;base64,', '');
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
        this.signaturePad?.clear();
        this.imageFile = '';
        this.isSignatureAdded = false;
        this.remarks = '';
    }

    submit() {
        let diaries=[]
        for(let i=0;i<this.data?.data?.length;i++){
            diaries.push((this.data?.data[i]?.ProfileID).toString()+"#"+(this.data?.data[i]?.DiaryId).toString())
        }
        let formdata = new FormData();
        formdata.append('UserID', String(this.data.userId));
        formdata.append('DiaryIds', diaries.toString());
        formdata.append('Status', this.data.status);
        if (this.data.status == 'A') {
            if (this.imageFile)
                formdata.append('Signature', this.imageFile);
            else {
                this.toaster.error("Please add Signature");
                return;
            }
        }
        if (this.remarks)
            formdata.append('Remarks', this.remarks);
        else {
            this.toaster.error("Please add Remarks");
            return;
        }
        this.http
            .post<any>(
                `${environment.apiUrl}/TourPlanAndDiary/ApproveReferbackTourDiary`,
                formdata
            ).subscribe((data) => {
            if (data.Success) {
                this.toaster.success(data.Message);
                this.dialogRef.close(true);
            } else {
                this.toaster.error(data.Message);
            }
        });
    }

    classDesign() {
        if (this.is_referback) {
            return "border-none"
        } else {
            return "border-t"
        }

    }
}
