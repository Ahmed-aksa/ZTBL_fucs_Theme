import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {finalize, tap} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RecoveryService} from 'app/shared/services/recovery.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {BaseResponseModel} from 'app/shared/models/base_response.model';


@Component({
    selector: 'kt-loan-receipt',
    templateUrl: './loan-receipt.component.html',
    styleUrls: ['./loan-receipt.component.scss'],
})
export class LoanReceiptComponent implements OnInit {

    @ViewChild('screen', {static: true}) screen: any;

    name = "Angular";
    receiptBase64 = "";
    receipt: any;
    receiptDetail: any;
    signature: any;
    barcode: string;
    submitted = false;

    constructor(public dialogRef: MatDialogRef<LoanReceiptComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private _recoveryService: RecoveryService,
                private spinner: NgxSpinnerService,
                private router: Router,
                private layoutUtilsService: LayoutUtilsService
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit() {
        this.receipt = this.data;


        this.submitted = true;
        this.spinner.show();


        //this.captureService
        //  .getImage(this.screen.nativeElement, true)
        //  .pipe(
        //    tap(img => {
        //      this.receiptBase64 = img;
        //    })
        //  )
        //  .subscribe();

        this._recoveryService
            .getReceiptDetail(this.receipt)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                    this.submitted = false;
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {


                if (baseResponse.Success === true) {
                    this.receiptDetail = baseResponse.Recovery.Receipt;
                    this.receiptDetail.forEach(function (part, index) {
                        if (this[index].LabelL == "Customer Name")
                            this[index].ValueL = this[index].ValueL.replace(/(?:\r\n|\r|\n)/g, '<br>');
                    }, this.receiptDetail);
                    //this.signature = "data:image/jpeg;base64," + baseResponse.Recovery.ReceiptSignature;
                    //this.barcode = this.receipt.TransactionID + "," + this.receipt.BranchWorkingDate;
                } else {
                    this.layoutUtilsService.alertMessage("", baseResponse.Message);
                }
            });

    }

    close(): void {
        this.dialogRef.close();
        this.router.navigateByUrl('/dashboard');
        //const url = this.router.serializeUrl(
        //  this.router.createUrlTree(['../../dashboard'], { relativeTo: this.activatedRoute })
        //);
        //window.open(url, '_blank');
    }

    downloadReceipt() {

        if (this.receiptBase64 != "") {


            this.receiptBase64 = this.receiptBase64.replace("data:image/png;base64,", "")
            const blobData = this.convertBase64ToBlobData(this.receiptBase64);


            if (true) { //IE// window.navigator && window.navigator.msSaveOrOpenBlob
                // window.navigator.msSaveOrOpenBlob(blobData, this.receipt.DisbursementID + ".jpeg");
            } else { // chrome
                const blob = new Blob([blobData], {type: "image/jpeg"});
                const url = window.URL.createObjectURL(blob);
                // window.open(url);
                const link = document.createElement('a');
                link.href = url;
                link.download = this.receipt.DisbursementID + ".jpeg";
                link.click();
            }
        }
    }

    convertBase64ToBlobData(base64Data: string, contentType: string = 'image/jpeg', sliceSize = 512) {
        const byteCharacters = atob(base64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }
}
