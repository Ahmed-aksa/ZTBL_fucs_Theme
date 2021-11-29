import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { KtDialogService } from 'app/shared/services/kt-dialog.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { RecoveryService } from 'app/shared/services/recovery.service';

@Component({
  selector: 'kt-loan-inquiry',
  templateUrl: './loan-inquiry.component.html',
  styles: []
})
export class LoanInquiryComponent implements OnInit {

  submitted = false;
  dynamicList: any;
  recoveryList: any;
  dataFetched = false;
  recoveryDataFetched = false;
  RecoveryForm: FormGroup;
  hasFormErrors = false;
  dataFound = false;

  zone;
  branch;

  constructor(
    private _recoveryService: RecoveryService,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private userUtilsService: UserUtilsService,
    private spinner: NgxSpinnerService,
  ) { }

  createForm() {
    this.RecoveryForm = this.formBuilder.group({
      TransactionId: [''],
      LoanCaseNo: [''],
      Zone: [''],
      Branch: [''],
    });
  }

  ngOnInit() {
    this.createForm();
    var LnTransactionID = this.route.snapshot.params['LnTransactionID'];
    var lcno = this.route.snapshot.params['Lcno'];
    var userInfo = this.userUtilsService.getUserDetails();

    this.RecoveryForm.controls.Zone.setValue(userInfo?.Zone?.ZoneName);
    this.RecoveryForm.controls.Branch.setValue(userInfo?.Branch?.Name);
    this.RecoveryForm.controls.LoanCaseNo.setValue(lcno == "undefined" ? "" : lcno);
    this.RecoveryForm.controls.TransactionId.setValue(LnTransactionID == "undefined" ? "" : LnTransactionID);

    if (this.RecoveryForm.controls.LoanCaseNo.value != undefined && this.RecoveryForm.controls.TransactionId.value != undefined) {
      this.find();
    }

    //this.getLoanApplicationsInquiry();
  }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
    }

  find() {
    var transactionId = this.RecoveryForm.controls.TransactionId.value;
    var loanCaseNo = this.RecoveryForm.controls.LoanCaseNo.value;
    this.hasFormErrors = false;
    if ((transactionId == undefined || transactionId == "") && (loanCaseNo == undefined || loanCaseNo == "")) {
      this.hasFormErrors = true;
      return;
    }

    this.spinner.show();
    this.submitted = true;
    this._recoveryService
      .getLoanApplicationsInquiry(loanCaseNo, transactionId, this.zone, this.branch)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.dataFetched = true;
          this.spinner.hide();
          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {

        if (baseResponse.Success === true) {
          this.dynamicList = JSON.parse(baseResponse.Recovery.DynamicDataList);



          this.dataFound = true;
          this.cdRef.detectChanges();
        }
        else {
          this.dataFound = false;
          this.layoutUtilsService.alertMessage("", baseResponse.Message);
        }
      });
  }

  getDocument(documentType: string, documentId: string) {

    this.spinner.show();
    this.submitted = true;
    this._recoveryService
      .getViewLoanDocument(documentType, documentId, this.zone, this.branch)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.dataFetched = true;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        if (baseResponse.Success === true) {
          var documents = baseResponse.ViewDocumnets;
          window.open(documents.Path, "_blank");
          this.cdRef.detectChanges();
        }
        else {
          this.layoutUtilsService.alertMessage("", baseResponse.Message);
        }
      });
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.RecoveryForm.controls[controlName].hasError(errorName);
  }

  getDisbursments(loanDisbursmentId: string) {
    this.spinner.show();
    this.submitted = true;
    this._recoveryService
      .getLoanApplicationsInquiryDisbursment(loanDisbursmentId.toString(), this.zone, this.branch)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.recoveryDataFetched = true;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        if (baseResponse.Success === true) {
          this.recoveryList = JSON.parse(baseResponse.Recovery.DynamicDataList);
          this.cdRef.detectChanges();
        }
        else {
          this.layoutUtilsService.alertMessage("", baseResponse.Message);
        }

      });
  }
}
