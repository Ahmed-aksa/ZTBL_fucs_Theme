import { HttpClient } from '@angular/common/http';
import {AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
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
import {ToastrService} from "ngx-toastr";
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
    docId = [];
    first: boolean;

    page_number = [];
    description = [];
    private LoanCaseId: any;
    loan: any = {}
    pattern = /[^0-9]/g;

    uploaded = "File Uploaded"



    constructor(
        private frmbuilder: FormBuilder,
        private http: HttpClient,
        private _circleService: CircleService,
        private _cdf: ChangeDetectorRef,
        private _common: CommonService,
        private _lovService: LovService,
        private userUtilsService: UserUtilsService,
        private toastr: ToastrService,
        private _loanService: LoanService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private cdRef: ChangeDetectorRef,
    ) {
        this.PostDocument = frmbuilder.group({
            ParentDocId: [this.loanDocument.ParentDocId, Validators.required],//Document Type Lov
            LcNo: [this.loanDocument.LcNo, Validators.required],
            LoanStatus: [this.loanDocument.LoanStatus],
            DocLoanId: [this.loanDocument.DocLoanId, Validators.required],//Document Type Lov
            CategoryName: [this.loanDocument.CategoryName],
            Description: [this.loanDocument.Description, Validators.required],
            PageNumber: [this.loanDocument.PageNumber, Validators.required],
            DescriptionTab: ['', Validators.required],
            DocumentRefNo: ['', Validators.required],
            NoOfFilesToUpload: [this.loanDocument.NoOfFilesToUpload, Validators.required],
            file: ['', Validators.required],
        });
    }

    ngOnInit() {

        this.getLoanType();
        this.getDocument();
        this.getDocumentLoanType();

    }

    PostDocuments(PostDocument: any) {
        //
    }

    controlReset(){
        //Document Info
        this.PostDocument.controls['ParentDocId'].reset();
        this.PostDocument.controls['DocumentRefNo'].reset();
        this.PostDocument.controls['NoOfFilesToUpload'].reset();
        this.PostDocument.controls['Description'].reset();

        //Attachments
        this.PostDocument.controls['file'].reset();
        this.PostDocument.controls['PageNumber'].reset();
        this.PostDocument.controls['DescriptionTab'].reset();
    }

    loadUploadDocumentsOnUpdate(appUploadDocumentsData, loanApplicationHeader) {
        this.applicationHeader = loanApplicationHeader;

            this.PostDocument.controls['LcNo'].setValue(loanApplicationHeader.LoanCaseNo)
        if(loanApplicationHeader?.LoanCaseNo?.length>0){
            this.PostDocument.controls['LcNo'].disable();
        }
            this.loanCase(true);
            this.getLoanDocument();


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
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            });
    }


    validateLoanTypeOnFocusOut() {
        if (this.SelectedLoanType.length == 0) {
            this.SelectedLoanType = this.LoanTypes;
        }
    }


    deleteDocument(id){
        this.spinner.show();
        this._loanService.documentDelete(id, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe((baseResponse) => {
            if (baseResponse.Success === true) {
                this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);
                this.getLoanDocument();
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
        //this.PostDocument.value.ParentDocId = '25';
    }

    getLoanDocument(){

        var loanId = this.applicationHeader.LoanAppID;
        this._loanService.getLoanDocuments(loanId, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe((baseResponse) => {
            if (baseResponse.Success === true) {
                this.loanDocumentArray = baseResponse.Loan.DocumentUploadList;
                //this.layoutUtilsService.alertElementSuccess('', baseResponse.Message)
            } else {
                this.loanDocumentArray.length = 0;
                //this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });
    }

    onFileChange(event) {

        for(let i = 0; i < this.docId.length; i++){
            this.rawData.splice(i,1)
        }

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
        var totLength = this.PostDocument.controls.NoOfFilesToUpload.value;

        if (this.PostDocument.invalid) {
            const controls = this.PostDocument.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            this.toastr.error("Please Enter Required values");
            return;
        }

        if(this.rawData.length != 1){
            this.rawData = this.rawData.reverse();
        }

        totLength = Number(totLength)
        this.rawData.forEach((single_file, index) => {
            this.loanDocument.file = single_file;

            // @ts-ignore
            let page_number = document.getElementById(`page_${index}`).value;
            // @ts-ignore
            let description = document.getElementById(`description_${index}`).value;


            if(single_file == undefined || single_file == null || page_number == "" || description == ""){
                this.layoutUtilsService.alertElement('', 'Please add File, Page Number and Description same as No. of Pages');
                return
            }else if(this.docId[index]){
                count = count+1;
                return
            }
            else if(page_number > this.loanDocument.NoOfFilesToUpload){
                this.layoutUtilsService.alertElement('', 'Page Number should not be greater than No. of Files to upload')
                return false;
            }
            else{
                this.loanDocument.PageNumber = page_number;
                this.loanDocument.Description = description;

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

                        this.docId.push(baseResponse.DocumentDetail.Id);
                        //this.rawData.push(this.uploaded)
                        if(count == totLength){
                            this.getLoanDocument();
                            this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);
                            this.docId = [];
                            this.controlReset();
                            this.rawData.length = 0;
                        }else if(this.rawData.length != totLength && count == this.rawData.length){
                            this.layoutUtilsService.alertElement('', 'Please add Remaining Entries');
                        }


                    } else {
                        this.layoutUtilsService.alertMessage('', baseResponse.Message);
                        //this.rawData.length = 0;
                        return false;

                    }

                });
            }

        })

    }

    loanCase(bool) {

        this.first = bool;
        this._loanService.getLoanDetailsByLcNo(this.PostDocument.controls.LcNo.value, this.branch)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe((baseResponse) => {
            if (baseResponse.Success === true) {
                this.PostDocument.controls['LoanStatus'].setValue("New Case");
                var response = baseResponse.Loan.ApplicationHeader;
                this.PostDocument.controls['LoanStatus'].setValue(response.AppStatusName);
                this.PostDocument.controls['CategoryName'].setValue(response.CategoryName);
                this.LoanCaseId = response.DocumentLoanCaseID;


            } else {
                if(this.first == false){
                    // this.layoutUtilsService.alertElement('', baseResponse.Message);

                }
                this.PostDocument.controls['LoanStatus'].setValue("New Case");
                //
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
