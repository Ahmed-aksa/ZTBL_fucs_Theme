import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {Loan, LoanApplicationHeader} from 'app/shared/models/Loan.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LoanService} from 'app/shared/services/loan.service';
import {RecoveryService} from 'app/shared/services/recovery.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {ClApplicationHeaderComponent} from '../cl-application-header/cl-application-header.component';
import {ClAppraisalOfProposedInvestmentComponent} from '../cl-appraisal-of-proposed-investment/cl-appraisal-of-proposed-investment.component';
import {ClCustomersComponent} from '../cl-customers/cl-customers.component';
import {ClLegalHeirsComponent} from '../cl-legal-heirs/cl-legal-heirs.component';
import {ClLoanWitnessComponent} from '../cl-loan-witness/cl-loan-witness.component';
import {ClPurposeComponent} from '../cl-purpose/cl-purpose.component';
import {ClSecuritiesComponent} from '../cl-securities/cl-securities.component';
import {ClUploadDocumentComponent} from '../cl-upload-document/cl-upload-document.component';
import {ToastrService} from "ngx-toastr";
import {ElementRef} from '@angular/core';

@Component({
    selector: 'kt-create-loan',
    templateUrl: './create-loan.component.html',
    styleUrls: ['./create-loan.component.scss']
})
export class CreateLoanComponent implements OnInit {

    @ViewChild(ClApplicationHeaderComponent, {static: false}) appHeaderComponent: ClApplicationHeaderComponent;
    @ViewChild(ClCustomersComponent, {static: false}) appCustomerComponent: ClCustomersComponent;
    @ViewChild(ClSecuritiesComponent, {static: false}) securityComponent: ClSecuritiesComponent;
    @ViewChild(ClLegalHeirsComponent, {static: false}) legalHeirsComponent: ClLegalHeirsComponent;
    @ViewChild(ClPurposeComponent, {static: false}) appPurposeComponent: ClPurposeComponent;
    @ViewChild(ClLoanWitnessComponent, {static: false}) loanWitnessComponent: ClLoanWitnessComponent;
    @ViewChild(ClAppraisalOfProposedInvestmentComponent, {static: false}) appraisalOfProposedComponent: ClAppraisalOfProposedInvestmentComponent;
    @ViewChild(ClUploadDocumentComponent, {static: false}) uploadDocumentComponent: ClUploadDocumentComponent;
    loanApplicationReq: Loan;

    constructor(private route: ActivatedRoute,
                private _recoveryService: RecoveryService,
                private _loanService: LoanService,
                private cdRef: ChangeDetectorRef,
                private layoutUtilsService: LayoutUtilsService,
                private spinner: NgxSpinnerService,
                private router: Router,
                private toastr: ToastrService,
    ) {

        router.events.subscribe((val: any) => {
            if (val.url == "/loan/create") {
                localStorage.removeItem('customer_loan_list');
                this.onCreateRestForm();

            }
        })
    }

    checkError(val: boolean) {
    }

    viewPurpose: boolean;
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
    disabled_tab: boolean = true;
    @ViewChild(ClCustomersComponent) child: ClCustomersComponent;
    @ViewChild(ClLegalHeirsComponent) legal_child: ClLegalHeirsComponent;

    ngOnInit() {
    }


    onCreateRestForm() {

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
        if ($event.index == 3) {
            this.securityComponent.getCustomerLand();
        }
        if ($event.index == 4) {
            this.legal_child.loadCustomers()
        }
        if ($event.index == 7) {
            this.loanWitnessComponent.getCheckList();
        }
        if ($event.index == 1) {
            this.child.callfromPartnet()
        }
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
                    localStorage.setItem('customer_loan_list', JSON.stringify(loanRes.CustomersLoanAppList.reverse()));
                    this.CustomersLoanAppList = loanRes.CustomersLoanAppList
                    this.loanApplicationReq = new Loan();
                    this.loanApplicationReq.TranId = baseResponse.TranId;
                    this.loanApplicationReq.ApplicationHeader = loanRes.ApplicationHeader;
                    this.loanApplicationReq.ApplicationHeader.LoanAppID = loanRes.ApplicationHeader.LoanAppID;
                    this.applicationHeaderDetail = loanRes.ApplicationHeader;
                    this.appHeaderComponent.loadAppDataOnUpdate(this.applicationHeaderDetail);
                    if (this.CustomersLoanAppList[0]?.Agps == 'A' || this.CustomersLoanAppList[0]?.RelationID == '8') {
                        this.disabled_tab = false;
                    } else {
                        this.disabled_tab = true;
                    }

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
                } else {

                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }
            });
    }

    check_disabled(event: any) {
        this.disabled_tab = event;


    }

    check_localstroage() {
        let customers_loan_data = JSON.parse(localStorage.getItem('customer_loan_list'));

        if (customers_loan_data && customers_loan_data[0] && customers_loan_data?.Agps == 'A' && customers_loan_data.RelationID == '8') {
            return false;
        } else {
            return true;
        }
    }
}



