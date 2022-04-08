import {HttpClient} from '@angular/common/http';
import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {Loan, LoanApplicationHeader, LoanDocuments} from 'app/shared/models/Loan.model';
import {CircleService} from 'app/shared/services/circle.service';
import {CommonService} from 'app/shared/services/common.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LoanService} from 'app/shared/services/loan.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {ToastrService} from "ngx-toastr";
import {Activity} from "../../../shared/models/activity.model";
import {EncryptDecryptService} from "../../../shared/services/encrypt_decrypt.service";

@Component({
    selector: 'kt-cl-upload-document',
    templateUrl: './cl-upload-document.component.html',
    styleUrls: ['./cl-upload-document.component.scss'],
})
export class ClUploadDocumentComponent implements OnInit {

    @Input() loanDetail: Loan;

    previous_loan_type: string;

    PostDocument: FormGroup;
    loanDocument = new LoanDocuments();
    rawData = [];
    imgData = [];
    refDepositAccount: any;

    matched = false;
    bit;
    maxLength: number;
    docPage = false;

    url: string;
    loanDocumentArray: LoanDocuments[] = [];
    descriptionFalse = false;

    //Zone inventory
    LoggedInUserInfo: BaseResponseModel;
    applicationHeaderForm: FormGroup;
    public loanApplicationHeader = new LoanApplicationHeader();

    LoanTypes: any = [];
    loanType: any = [];
    SelectedLoanType: any = [];
    applicationHeader: any;

    loanId: any = {}

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
    index = 0;

    zone: any;
    branch: any;
    circle: any;
    disable_lc = false;
    number_of_files: number = 0;
    docId = [];
    numArray = [];
    fallout: boolean = false;

    checkCompare = false;

    page_number = [];
    description = [];
    loan: any = {}
    pattern = /[^0-9]/g;
    loanAppID: any;
    showGrid = false;
    uploaded = "File Uploaded"
    currentActivity: Activity
    private LoanCaseId: any;

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
        private enc: EncryptDecryptService
    ) {
        this.PostDocument = frmbuilder.group({
            ParentDocId: [this.loanDocument.ParentDocId, Validators.required],//Document Type Lov
            LcNo: [this.loanDocument.LcNo, Validators.required],
            LoanStatus: [this.loanDocument.LoanStatus],
            DocLoanId: [this.loanDocument.DocLoanId, Validators.required],//Document Type Lov
            CategoryName: [this.loanDocument.CategoryName],
            Description: [this.loanDocument.Description, Validators.required],
            DocumentRefNo: ['', Validators.required],
            NoOfFilesToUpload: [this.loanDocument.NoOfFilesToUpload, Validators.required],
        });
    }

    ngOnInit() {

        this.currentActivity = this.userUtilsService.getActivity('Create Loan')
        this.getLoanType();
        this.getDocument();
        this.getDocumentLoanType();
        this.checkReadOnly();
    }

    PostDocuments(PostDocument: any) {
        //
    }

    checkReadOnly() {

        if (!this.loanAppID) {
            this.docPage = true;
        } else {
            this.docPage = false;
        }
    }


    controlReset() {
        //Document Info
        this.index = 0;
        this.numArray.length = 0;
        this.imgData.length = 0;
        this.PostDocument.controls['ParentDocId'].reset();
        this.PostDocument.controls['DocumentRefNo'].reset();
        this.PostDocument.controls['NoOfFilesToUpload'].reset();
        this.PostDocument.controls['Description'].reset();

    }

    loadUploadDocumentsOnUpdate(loanApplicationHeader) {
        this.applicationHeader = loanApplicationHeader;

        this.PostDocument.controls['LcNo'].setValue(loanApplicationHeader.LoanCaseNo)
        this.loanAppID = this.applicationHeader.LoanAppID;
        // if (loanApplicationHeader?.LoanCaseNo?.length > 0) {
        //     this.PostDocument.controls['LcNo'].disable();
        // }
        //this.loanCase(true);

        this.getLoanDocument();
        this.checkReadOnly();


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
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            });
    }


    validateLoanTypeOnFocusOut() {
        if (this.SelectedLoanType.length == 0) {
            this.SelectedLoanType = this.LoanTypes;
        }
    }


    deleteDocument(id) {
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
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.PostDocument.controls[controlName].hasError(errorName);
    }

    async getDocument() {

        this.document = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.DocumentType});

        this.SelectedDocument = this.document.LOVs;
        //this.PostDocument.value.ParentDocId = '25';
    }

    getLoanDocument() {

        this._loanService.getLoanDocuments(this.loanAppID, this.branch, this.zone)
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

    onFileChange(event, i) {

        let totNumber = Number(this.PostDocument.controls.NoOfFilesToUpload.value);
        if (event.target.files && event.target.files[0]) {
            const filesAmount = event.target.files.length;
            const file = event.target.files[0];
            const Name = file.name.split('.').pop();
            if (Name != undefined) {
                if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'jpeg' || Name.toLowerCase() == 'png') {
                    const reader = new FileReader();
                    reader.onload = (event: any) => {
                        if (this.rawData[i]) {
                            this.rawData.splice(i, 1);
                            //this.imgData.splice(i, 1);
                            this.rawData.splice(i, 0, file);
                            console.log(this.rawData)
                        } else {
                            this.numArray.push(i)
                            this.imgData.push(file);
                            if (this.imgData.length == totNumber) {
                                this.getFile()
                            }
                        }
                    };
                    reader.readAsDataURL(file);

                } else {
                    this.layoutUtilsService.alertElement('', 'Only jpeg,jpg and png files are allowed', '99');
                    event.target.files = null;
                    return;
                }
            }
        } else {
            this.rawData.splice(i, 1);
        }


    }

    fileCompare() {

        let i, j;
        for (i = 0; i < this.rawData.length; i++) {
            for (j = 1; j < this.imgData.length; j++) {
                if (j != i) {
                    if ((this.rawData[i].name && this.rawData[i].size) == (this.imgData[j].name && this.imgData[j].size)) {
                        this.matched = true;
                        break;
                    } else {
                        this.matched = false;
                    }
                }

            }
            if (this.matched == true) {
                break;
            }
        }
        this.checkCompare = false;
    }

    saveLoanDocuments() {

        this.maxLength = Number(this.PostDocument.controls.NoOfFilesToUpload.value);
        for (let i = 0; i < this.number_of_files; i++) {
            // @ts-ignore
            let page_number = document.getElementById(`page_${i}`)?.value;
            // @ts-ignore
            let description = document.getElementById(`description_${i}`)?.value;
            if (description == "" || description == undefined) {
                this.layoutUtilsService.alertElement('', 'Please add Description missing from row(s)');
                return;
            }

        }
        if (this.rawData.length < this.maxLength) {
            this.layoutUtilsService.alertElement('', 'Please add all files');
            return false;
        }

        if (this.index < this.rawData.length) {
            if (this.docId[this.index]) {
                this.index = this.index + 1;
                this.saveLoanDocuments();
                return
            }

            this.fallout = false;
            console.log(this.rawData);

            var count = 0;
            this.loanDocument = Object.assign(this.loanDocument, this.PostDocument.getRawValue());

            if (!this.LoanCaseId) {
                this.bit = '1';
                this.loanCase();
                return false;
            } else {
                this.loanDocument.LoanCaseID = this.LoanCaseId;
                this.bit = null;
            }


            if (this.index < this.rawData.length) {
                this.loanDocument.file = this.rawData[this.index];
                // @ts-ignore
                let page_number = document.getElementById(`page_${this.index}`)?.value;
                // @ts-ignore
                let description = document.getElementById(`description_${this.index}`)?.value;


                this.loanDocument.PageNumber = page_number;
                this.loanDocument.Description = description;
                if (this.PostDocument.invalid) {
                    this.toastr.error("Please enter requried fields");
                    const controls = this.PostDocument.controls;
                    Object.keys(controls).forEach(controlName =>
                        controls[controlName].markAsTouched()
                    );
                    return;
                }

                if (this.rawData.length < this.maxLength) {
                    if (this.LoanCaseId) {
                        this.layoutUtilsService.alertElement('', 'Please add all files');
                        this.fallout = true;
                    }
                    return false;
                }

                this.spinner.show();
                this._loanService.documentUpload(this.loanDocument)
                    .pipe(
                        finalize(() => {
                            if (this.index == this.maxLength) {
                                this.spinner.hide();
                            }
                        })
                    ).subscribe((baseResponse) => {
                    if (baseResponse.Success) {

                        this.index = this.index + 1;
                        this.docId.push(baseResponse.DocumentDetail.Id);

                        if (this.index == this.maxLength) {
                            this.spinner.hide();
                            this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);
                            this.getLoanDocument();
                            this.docId = [];
                            this.controlReset();
                            this.showGrid = false;
                            this.rawData.length = 0;

                        } else {
                            this.saveLoanDocuments();
                            //this.index++;
                        }
                    } else {
                        this.spinner.hide();
                        this.index = 0;
                        this.layoutUtilsService.alertMessage('', baseResponse.Message);
                        this.fallout = true;
                        return;
                    }


                });
            }

        }
    }

    getFile() {
        for (let i = 0; i < this.imgData.length; i++) {
            for (let j = 0; j < this.numArray.length; j++) {
                if (i == this.numArray[j]) {
                    this.rawData.push(this.imgData[j]);
                    if (this.rawData.length == this.imgData.length) {
                        this.numArray.length = 0;
                        this.imgData.length = 0;
                        console.log(this.rawData);
                    }
                }
            }
        }
    }

    loanCase() {

        var LoanDoc = this.PostDocument.controls.DocLoanId.value;

        if (LoanDoc == undefined || LoanDoc == null) {
            this.layoutUtilsService.alertElement('', 'Please select Loan Type');
            return
        }

        this._loanService.getLoanDetailsByLcNo(this.PostDocument.controls.LcNo.value, LoanDoc, this.branch, this.zone)
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

                this.loanDocument.LoanCaseID = this.LoanCaseId;
                this.checkCompare = true;
                if (this.bit) {
                    this.saveLoanDocuments()
                }

            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message);
                //this.PostDocument.controls['LoanStatus'].setValue("New Case");
                //
            }
        });
    }

    changeFilesQuantity() {
        this.showGrid = true;
        if (!isNaN(parseInt(this.PostDocument.value.NoOfFilesToUpload))) {
            this.number_of_files = parseInt(this.PostDocument.value.NoOfFilesToUpload);
            if (this.number_of_files == 0) {
                this.rawData.length = 0;
                this.numArray.length = 0;
                this.imgData.length = 0;
                this.showGrid = false;
            }
        }
        this.cdRef.detectChanges();
    }

    changeDocType(value) {
        if (this.rawData.length > 0) {
            const confirmAlert = this.layoutUtilsService.AlertElementConfirmation("Alert", "By Changing Document Type, You will lose Already selected files,Do you want to keep the files", "");
            confirmAlert.afterClosed().subscribe(res => {

                if (!res) {
                    this.PostDocument.controls['ParentDocId'].setValue(this.previous_loan_type);
                    return;
                }

                this.previous_loan_type = value;
                this.PostDocument.controls['DocumentRefNo'].reset();
                this.PostDocument.controls['NoOfFilesToUpload'].reset();
                this.PostDocument.controls['Description'].reset();
                this.index = 0;
                this.rawData.length = 0;
                this.numArray.length = 0;
                this.imgData.length = 0;
                this.showGrid = false;
                // this.rawData.forEach((single_file, index) => {
                //     // @ts-ignore
                //     document.getElementById('file_' + index).value = null;
                // });

            });
        } else {
            this.previous_loan_type = value;
        }

    }

    assignLoanCaseNo() {
        if (this.enc.decryptStorageData(localStorage.getItem('loan_case_number'))) {

            this.PostDocument.controls['LcNo'].setValue(this.enc.decryptStorageData(localStorage.getItem('loan_case_number')));
            this.loanAppID = this.enc.decryptStorageData(localStorage.getItem('loan_app_id'));
            this.refDepositAccount = this.enc.decryptStorageData(localStorage.getItem('loan_ref_deposit'));

            this.getLoanDocument()
            this.checkReadOnly();

            localStorage.removeItem('loan_case_number');
            localStorage.removeItem('loan_app_id');
            localStorage.removeItem('loan_ref_deposit');

            //this.loanCase(true);
        }
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
