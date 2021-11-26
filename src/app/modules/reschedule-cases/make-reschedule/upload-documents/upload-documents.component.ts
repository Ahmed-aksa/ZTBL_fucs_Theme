import {ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {Loan, LoanApplicationHeader, LoanDocuments} from '../../../../shared/models/Loan.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BaseResponseModel} from '../../../../shared/models/base_response.model';
import {Lov, LovConfigurationKey} from '../../../../shared/classes/lov.class';
import {HttpClient} from '@angular/common/http';
import {CircleService} from '../../../../shared/services/circle.service';
import {CommonService} from '../../../../shared/services/common.service';
import {LovService} from '../../../../shared/services/lov.service';
import {UserUtilsService} from '../../../../shared/services/users_utils.service';
import {LoanService} from '../../../../shared/services/loan.service';
import {LayoutUtilsService} from '../../../../shared/services/layout_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {finalize} from 'rxjs/operators';
import {ClDocumentViewComponent} from '../../../loan/cl-document-view/cl-document-view.component';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent implements OnInit {

    @Input() loanDetail: Loan;

    PostDocument: FormGroup;
    loanDocument = new LoanDocuments();
    rawData = new LoanDocuments();

    url: string;
    loanDocumentArray: LoanDocuments[] = [];

    //Zone inventory
    LoggedInUserInfo: BaseResponseModel;
    applicationHeaderForm: FormGroup;
    public loanApplicationHeader = new LoanApplicationHeader();

    LoanTypes: any = [];
    loanType: any = [];
    SelectedLoanType: any = [];

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


    constructor(
        public dialogRef: MatDialogRef<UploadDocumentsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
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
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef,
    ) {

        this.PostDocument = frmbuilder.group({
            ParentDocId: [this.loanDocument.ParentDocId, Validators.required],//Document Type Lov
            LcNo: [this.loanDocument.LcNo, Validators.required],
            LoanStatus: [this.loanDocument.LoanStatus, Validators.required],
            DocLoanId: [this.loanDocument.DocLoanId, Validators.required],//Document Type Lov
            CategoryName: [this.loanDocument.CategoryName, Validators.required],
            Description: [this.loanDocument.Description, Validators.required],
            PageNumber: [this.loanDocument.PageNumber],
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
        if (this.data.lcno) {
            this.PostDocument.controls['LcNo'].setValue(this.data.lcno)
            this.disable_lc = true;
        }

    }

    PostDocuments(PostDocument: any) {
        //
    }

    async getDocumentLoanType() {
        this.documentLoanTypes = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.ActiveLoanType});
        this.documentSelectedLoanType = this.documentLoanTypes.LOVs;
    }

    close(res) {
        this.dialogRef.close(res);
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

    searchLoanType(loanTypeId) {
        loanTypeId = loanTypeId.toLowerCase();
        if (loanTypeId != null && loanTypeId != undefined && loanTypeId != '') {
            this.SelectedLoanType = this.LoanTypes?.LOVs?.filter(x => x.Name.toLowerCase().indexOf(loanTypeId) > -1);
        } else {
            this.SelectedLoanType = this.LoanTypes.LOVs;
        }
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

    hasError(controlName: string, errorName: string): boolean {
        return this.PostDocument.controls[controlName].hasError(errorName);
    }

    async getDocument() {

        this.document = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.DocumentType});

        this.SelectedDocument = this.document.LOVs;

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
                        this.rawData.file = file;

                    };
                    reader.readAsDataURL(file);

                } else {
                    this.layoutUtilsService.alertElement('', 'Only jpeg,jpg and png files are allowed', '99');

                    return;
                }
            }
        }


    }

    saveLoanDocuments() {
        debugger;
        this.loanDocument = Object.assign(this.loanDocument, this.PostDocument.getRawValue());
        this.loanDocument.file = this.rawData.file;
        if (this.PostDocument.invalid) {
            const controls = this.PostDocument.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            return;
        }
        this.spinner.show();
        this._loanService.documentUpload(this.loanDocument)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe((baseResponse) => {
            this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);

        });

    }

    loanCase() {
        this._loanService.getLoanDetailsByLcNo(this.PostDocument.controls.LcNo.value, this.branch)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe((baseResponse) => {
            if (baseResponse.Success === true){
                var response = baseResponse.Loan.ApplicationHeader;
                this.PostDocument.controls['LoanStatus'].setValue(response.AppStatusName);
                this.PostDocument.controls['CategoryName'].setValue(response.CategoryName);
            }
            else{
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });
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
