import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { Branch } from 'app/shared/models/branch.model';
import { Loan, LoanApplicationHeader, LoanDocuments } from 'app/shared/models/Loan.model';
import { CircleService } from 'app/shared/services/circle.service';
import { CommonService } from 'app/shared/services/common.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LoanService } from 'app/shared/services/loan.service';
import { LovService } from 'app/shared/services/lov.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { ClDocumentViewComponent } from '../cl-document-view/cl-document-view.component';
import {Zone } from '../../user-management/users/utils/zone.model'
@Component({
  selector: 'kt-cl-upload-document',
  templateUrl: './cl-upload-document.component.html',
  styleUrls: ['./cl-upload-document.component.scss'],
})
export class ClUploadDocumentComponent implements OnInit {

    @Input() loanDetail: Loan;

    PostDocument: FormGroup;
    loanDocument = new LoanDocuments();
    rawData: LoanDocuments[] = [];

    url: string;
    loanDocumentArray: LoanDocuments[] = [];

    //Zone inventory
    LoggedInUserInfo: BaseResponseModel;
    applicationHeaderForm: FormGroup;
    public loanApplicationHeader = new LoanApplicationHeader();

    LoanTypes: any = [];
    loanType: any = [];
    SelectedLoanType: any = [];
    applicationHeader: any;

    //Document Loan Type inventory
    documentLoanTypes: any = [];
    documentloanType: any = [];
    documentSelectedLoanType: any = [];

    loanCaseNo: string;

    //Document inventory
    document: any = [];
    SelectedDocument: any = [];

    public LovCall = new Lov();
    public lovDoc = new Lov();
    isZoneReadOnly: boolean;
    isBranchReadOnly: boolean;

    isUserAdmin: boolean = false;

    zone: any;
    branch: any;
    circle: any;
    disable_lc = false;
    number_of_files: number;


    page_number = [];
    description = [];
    private LoanCaseId: any;
    loan: any = {}



    constructor(
        private frmbuilder: FormBuilder,
        private http: HttpClient,
        private _circleService: CircleService,
        private _cdf: ChangeDetectorRef,
        private _common: CommonService,
        private _lovService: LovService,
        private userUtilsService: UserUtilsService,
        private _loanService: LoanService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private cdRef: ChangeDetectorRef,
    ) {

        this.PostDocument = frmbuilder.group({
            ParentDocId: [this.loanDocument.ParentDocId, Validators.required],//Document Type Lov
            LcNo: [this.loanDocument.LcNo, Validators.required],
            LoanStatus: [this.loanDocument.LoanStatus, Validators.required],
            DocLoanId: [this.loanDocument.DocLoanId, Validators.required],//Document Type Lov
            CategoryName: [this.loanDocument.CategoryName, Validators.required],
            Description: [this.loanDocument.Description, Validators.required],
            PageNumber: [this.loanDocument.PageNumber, Validators.required],
            DescriptionTab: ['', Validators.required],
            DocumentRefNo: ['', Validators.required],
            NoOfFilesToUpload: ['', Validators.required],
            file: ['', Validators.required],
        });
    }

    ngOnInit() {
        debugger
        this.getLoanType();
        this.getDocument();
        this.getDocumentLoanType();
    }

    PostDocuments(PostDocument: any) {
        //
    }

    controlReset(){
        this.PostDocument.controls['file'].reset();
        this.PostDocument.controls['PageNumber'].reset();
        this.PostDocument.controls['DescriptionTab'].reset();
    }

    loadUploadDocumentsOnUpdate(appUploadDocumentsData, loanApplicationHeader) {
        debugger
        if (appUploadDocumentsData.length != 0) {
            this.loanDocumentArray = appUploadDocumentsData;
            console.log()
        }
        this.applicationHeader = loanApplicationHeader;
        this.PostDocument.controls['LcNo'].setValue(loanApplicationHeader.LoanCaseNo)
        this.loanCase();

    }

    async getDocumentLoanType() {
        this.documentLoanTypes = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.ActiveLoanType});
        this.documentSelectedLoanType = this.documentLoanTypes.LOVs;
    }


    //-------------------------------Loan Type Core Functions-------------------------------//
    async getLoanType() {

        this.LoanTypes = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.LoanTypes});
        this.SelectedLoanType = this.LoanTypes.LOVs;
        console.log(this.SelectedLoanType)
    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
    }

    viewDocument(documentType: string, documentId: string) {
        debugger
        this.spinner.show();
        this._loanService
            .getViewLoanDocument(documentType, documentId, this.zone, this.branch)
            .pipe(
                finalize(() => {
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


    validateLoanTypeOnFocusOut() {
        if (this.SelectedLoanType.length == 0) {
            this.SelectedLoanType = this.LoanTypes;
        }
    }

    onChangeLoanType(loanType) {
        if (loanType.value == '1') {

            //this.applicationHeaderForm.controls["ProdAmount"].setValidators([Validators.required]);
            //this.applicationHeaderForm.controls["ProdAmount"].updateValueAndValidity();
            //this.applicationHeaderForm.controls["DevAmount"].clearValidators();
            //this.applicationHeaderForm.controls["DevAmount"].updateValueAndValidity();
        } else if (loanType.value == '2') {
            // this.applicationHeaderForm.controls["DevAmount"].setValidators([Validators.required]);
            // this.applicationHeaderForm.controls["DevAmount"].updateValueAndValidity();
            // this.applicationHeaderForm.controls["ProdAmount"].clearValidators();
            // this.applicationHeaderForm.controls["ProdAmount"].updateValueAndValidity();
        } else if (loanType.value == '3') {
            // this.applicationHeaderForm.controls["DevAmount"].setValidators([Validators.required]);
            // this.applicationHeaderForm.controls["DevAmount"].updateValueAndValidity();
            // this.applicationHeaderForm.controls["ProdAmount"].setValidators([Validators.required]);
            // this.applicationHeaderForm.controls["ProdAmount"].updateValueAndValidity();
        }
    }

    deleteDocument(id){
        debugger
        this._loanService.documentDelete(id, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe((baseResponse) => {
            if (baseResponse.Success === true) {
                this.layoutUtilsService.alertElementSuccess('', baseResponse.Message)
            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });    }

    hasError(controlName: string, errorName: string): boolean {
        return this.PostDocument.controls[controlName].hasError(errorName);
    }

    async getDocument() {

        this.document = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.DocumentType});

        this.SelectedDocument = this.document.LOVs;
        this.PostDocument.value.ParentDocId = '25';
    }

    onFileChange(event) {

        if (event.target.files && event.target.files[0]) {
            const filesAmount = event.target.files.length;
            const file = event.target.files[0];
            const Name = file.name.split('.').pop();
            if (Name != undefined) {
                if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'jpeg' || Name.toLowerCase() == 'png') {
                    const reader = new FileReader();
                    reader.onload = (event: any) => {
                        this.rawData.push(file);

                    };
                    reader.readAsDataURL(file);

                } else {
                    this.layoutUtilsService.alertElement('', 'Only jpeg,jpg and png files are allowed', '99');
                    event.target.files = null;
                    return;
                }
            }
        }


    }

    saveLoanDocuments() {
        this.loanDocument = Object.assign(this.loanDocument, this.PostDocument.getRawValue());
        var count = 0;
        this.rawData.forEach((single_file, index) => {
            this.loanDocument.file = single_file;

            // @ts-ignore
            let page_number = document.getElementById(`page_${index}`).value;
            // @ts-ignore
            let description = document.getElementById(`description_${index}`).value;
            this.loanDocument.PageNumber = page_number;
            this.loanDocument.Description = description;
            if (this.PostDocument.invalid) {
                const controls = this.PostDocument.controls;
                Object.keys(controls).forEach(controlName =>
                    controls[controlName].markAsTouched()
                );
                return;
            }
            this.loanDocument.LcNo = this.LoanCaseId;

            this.spinner.show();
            this._loanService.documentUpload(this.loanDocument)
                .pipe(
                    finalize(() => {
                        this.spinner.hide();
                    })
                ).subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    debugger
                    count = count+1;
                    if(count == this.rawData.length){
                        this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);
                    }
                    this.controlReset();
                } else {
                    this.layoutUtilsService.alertMessage('', baseResponse.Message);
                    return

                }

            });
        })

    }

    loanCase() {
        this._loanService.getLoanDetailsByLcNo(this.PostDocument.controls.LcNo.value, this.branch)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe((baseResponse) => {
            if (baseResponse.Success === true) {
                var response = baseResponse.Loan.ApplicationHeader;
                this.PostDocument.controls['LoanStatus'].setValue(response.AppStatusName);
                this.PostDocument.controls['CategoryName'].setValue(response.CategoryName);
                this.LoanCaseId = response.DocumentLoanCaseID;


            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });
    }

    changeFilesQuantity() {

        this.number_of_files = parseInt(this.PostDocument.value.NoOfFilesToUpload);
    }
}

export class LoanDocumentsGrid {
  ZoneId: number;
  BranchID: number;
  LoanType: string;
  LoanStatus: string;
  DocumentId: number;
  Description: string;
  PageNumber: number;
  DocumentNumber: number;
  DocumentType: string;
  OwnerName: string;
  LoanCaseID: number;
  ParentDocId: number;
  DocLoanId: string;
  CreatedUpdatedBy: number;
  EnteredBy: number;
  file: any;
  DocumentRefNo: string;
}
