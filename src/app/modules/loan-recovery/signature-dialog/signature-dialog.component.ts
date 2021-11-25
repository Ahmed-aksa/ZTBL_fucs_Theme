import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { SignaturePad } from 'angular2-signaturepad';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecoveryService } from 'app/shared/services/recovery.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { BaseResponseModel } from 'app/shared/models/base_response.model';


@Component({
  selector: 'kt-signature-dialog',
  templateUrl: './signature-dialog.component.html',
  styles: []
})
export class SignatureDialogComponent implements OnInit {

  @ViewChild(SignaturePad, { static: true }) signaturePad: SignaturePad;
  submitted = false;
  imageFile: any;
  isSignatureAdded = false;
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300,
    'backgroundColor': "rgb(255,255,255)"
  };

  receipt: any;
  receiptDetail: any;
  constructor(public dialogRef: MatDialogRef<SignatureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _recoveryService: RecoveryService,
    private spinner: NgxSpinnerService,
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
    public dialog: MatDialog,
    
  ) { }

  ngOnInit() {
    this.receipt = this.data;
    //
    //


  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete() {
    this.isSignatureAdded = true;
    // will be notified of szimek/signature_pad's onEnd event
    var base64 = this.signaturePad.toDataURL('image/jpeg');
    this.imageFile = base64.replace("data:image/jpeg;base64,", "");
    
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    
  }
  close(bySystem: Boolean): void {
    this.dialogRef.close(bySystem);
  }

  saveSignature(): void {
    
    if (this.receipt.isInterBranchRecovery) {
      this.dialogRef.close(this.imageFile);
      return;
    }
    this.submitted = true;
    this.spinner.show();

    this._recoveryService
      .updateSignature(this.imageFile,this.receipt.TransactionID, this.receipt.ReceiptId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
          this.submitted = false;
        }) 
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        
        
        if (baseResponse.Success === true) {
          //this.receiptDetail = baseResponse.Recovery.Receipt;

          this.close(true);
         
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
        }
      });
  }

  clearSignature(): void {
    this.signaturePad.clear();
    this.imageFile = "";
    this.isSignatureAdded = false;
  }
}
