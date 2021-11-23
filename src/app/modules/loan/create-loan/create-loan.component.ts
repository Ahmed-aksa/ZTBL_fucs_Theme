import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { Loan, LoanApplicationHeader } from 'app/shared/models/Loan.model';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LoanService } from 'app/shared/services/loan.service';
import { RecoveryService } from 'app/shared/services/recovery.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { ClApplicationHeaderComponent } from '../cl-application-header/cl-application-header.component';
import { ClAppraisalOfProposedInvestmentComponent } from '../cl-appraisal-of-proposed-investment/cl-appraisal-of-proposed-investment.component';
import { ClCustomersComponent } from '../cl-customers/cl-customers.component';
import { ClLegalHeirsComponent } from '../cl-legal-heirs/cl-legal-heirs.component';
import { ClLoanWitnessComponent } from '../cl-loan-witness/cl-loan-witness.component';
import { ClPurposeComponent } from '../cl-purpose/cl-purpose.component';
import { ClSecuritiesComponent } from '../cl-securities/cl-securities.component';
import { ClUploadDocumentComponent } from '../cl-upload-document/cl-upload-document.component';


@Component({
  selector: 'kt-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.scss']
})
export class CreateLoanComponent implements OnInit {

  @ViewChild(ClApplicationHeaderComponent, { static: false }) appHeaderComponent: ClApplicationHeaderComponent;
  @ViewChild(ClCustomersComponent, { static: false }) appCustomerComponent: ClCustomersComponent;
  @ViewChild(ClSecuritiesComponent, { static: false }) securityComponent: ClSecuritiesComponent;
  @ViewChild(ClLegalHeirsComponent, { static: false }) legalHeirsComponent: ClLegalHeirsComponent;
  @ViewChild(ClPurposeComponent, { static: false }) appPurposeComponent: ClPurposeComponent;
  @ViewChild(ClLoanWitnessComponent, { static: false }) loanWitnessComponent: ClLoanWitnessComponent;
  @ViewChild(ClAppraisalOfProposedInvestmentComponent, { static: false }) appraisalOfProposedComponent: ClAppraisalOfProposedInvestmentComponent;
  @ViewChild(ClUploadDocumentComponent, { static: false }) uploadDocumentComponent: ClUploadDocumentComponent;
  loanApplicationReq: Loan;
  constructor(private route: ActivatedRoute,
    private _recoveryService: RecoveryService,
    private _loanService: LoanService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {

    router.events.subscribe((val:any) => {

      if (val.url == "/loan/create") {

        this.onCreateRestForm();

      }
    })
  }
    viewPurpose:boolean;
  public LnTransactionID: string;
  public Lcno: string;
  dynamicList: any;

  // Objects
  applicationHeaderDetail: any;
  applicationCustomerDetail: any;
  applicationPurposeDetail: any;
  applicationSecuritiesDetail: any;
  applicationLegalHeirsDetail: any;
  applicationAppraisalOfProposed: any;
  applicationAppraisalOfProposedDetail: any;
  applicationUploadDocumentsDetail: any;
  witnesses: any;

  CustomersLoanAppList: any;

  ngOnInit() {
  }


  onCreateRestForm() {
    console.log("rest form")
    this.applicationHeaderDetail["DevAmount"] = "";
    this.appHeaderComponent.loadAppDataOnUpdate(this.applicationHeaderDetail)
  }

  ngAfterViewInit() {
    this.LnTransactionID = this.route.snapshot.params['LnTransactionID'];
    this.Lcno = this.route.snapshot.params['Lcno'];
    if ((this.LnTransactionID != undefined && this.LnTransactionID != null) && (this.Lcno != undefined && this.Lcno != null)) {
      this.getLoanDetail();

    }


  }



  onTabChangeClick($event) {
    if ($event.index == 2) {
      this.viewPurpose = this.appPurposeComponent.getCheckDisable(this.CustomersLoanAppList);
    }
    if ($event.index == 3) {
      this.securityComponent.getCustomerLand();
    }
    if ($event.index == 4) {
      this.legalHeirsComponent.loadCustomers(this.CustomersLoanAppList);
    }
    if ($event.index == 7) {
       this.loanWitnessComponent.getCheckList();
    }



  }

    checkValidation(data){

    }


  fillLoanApplicationObject(req: Loan) {
    this.loanApplicationReq = req;

  }

  fillLoanCustomerCall(req: Loan) {
    this.loanApplicationReq = req;
  }


  getLoanDetail() {

    var LoanAppID = this.LnTransactionID;
    var loanCaseNo = this.Lcno;


    if ((LoanAppID == undefined || LoanAppID == "") && (loanCaseNo == undefined || loanCaseNo == "")) {


      return;
    }

    this.spinner.show();

    this._loanService
      .getLoanDetails(loanCaseNo, LoanAppID)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {

        if (baseResponse.Success === true) {
          var loanRes = baseResponse.Loan;
          this.loanApplicationReq = new Loan();
          this.loanApplicationReq.TranId = baseResponse.TranId;
          this.loanApplicationReq.ApplicationHeader = new LoanApplicationHeader();
          this.loanApplicationReq.ApplicationHeader.LoanAppID = loanRes.ApplicationHeader.LoanAppID;
          this.applicationHeaderDetail = loanRes.ApplicationHeader;
          this.appHeaderComponent.loadAppDataOnUpdate(this.applicationHeaderDetail);

          this.CustomersLoanAppList = loanRes.CustomersLoanAppList

          this.appCustomerComponent.loadAppCustomerDataOnUpdate(loanRes.CustomersLoanAppList)

          this.appPurposeComponent.loadAppPurposeDataOnUpdate(loanRes.LoanApplicationpurposeList);

          this.securityComponent.loadAppSecuritiesDataOnUpdate(loanRes.LoanSecuritiesList);

          this.legalHeirsComponent.loadAppLegalHeirsDataOnUpdate(loanRes.LoanApplicationLegalHeirsList, loanRes.CustomersLoanAppList);

          this.appraisalOfProposedComponent.loadAppraisalOfProposedDataOnUpdate(loanRes.AppraisalProposedList, loanRes.CropProductionList);

          this.uploadDocumentComponent.loadUploadDocumentsOnUpdate(loanRes.DocumentUploadList, loanCaseNo);

          this.loanWitnessComponent.loadAppWitnessDataOnUpdate(loanRes.PersonalSuretiesList,
            loanRes.CorporateSuretyList, loanRes.LoanRefrencesList, loanRes.LoanPastPaidList,
            loanRes.LoanWitnessList, loanRes.CurrentLoansList);



          this.cdRef.detectChanges();
        }
        else {

          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }
      });
  }

}



