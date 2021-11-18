import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  rawData = new LoanDocuments();

  url : string
  loanDocumentArray: LoanDocuments[] = [];

  //Zone inventory
  Zones: any = [];
  SelectedZones: any = [];
  public Zone = new Zone();
  LoggedInUserInfo: BaseResponseModel;
  applicationHeaderForm: FormGroup;
  public loanApplicationHeader = new LoanApplicationHeader();

  //Branch inventory
  Branches: any = [];
  SelectedBranches: any = [];
  public branch = new Branch();

  //Loan Type inventory
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


  constructor(
    //public dialogRef: MatDialogRef<ClDocumentViewComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
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
      DocLoanId: [this.loanDocument.DocLoanId, Validators.required],//Document Type Lov
      Description: [this.loanDocument.Description, Validators.required],
      PageNumber: [this.loanDocument.PageNumber],
      DocumentRefNo: ['', Validators.required],
      NoOfFilesToUpload: ['', Validators.required],
      file: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.isZoneReadOnly = false;
    this.isBranchReadOnly = false;
    this.GetZones();
    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
    if (this.LoggedInUserInfo.Branch?.BranchCode != "All") {

      this.isZoneReadOnly = true;
      this.isBranchReadOnly = true;
    }
    this.getLoanType();
    this.getDocument();
    this.getDocumentLoanType();
  }

  PostDocuments(PostDocument: any) {
    // console.log(this.PostDocument.value)
  }

  //-------------------------------Zone Core Functions-------------------------------//

  GetZones() {
    this._circleService.getZones()
      .pipe(
        finalize(() => {
        })
      ).subscribe(baseResponse => {
        if (baseResponse.Success) {

          baseResponse.Zones.forEach(function (value) {
            value.ZoneName = value.ZoneName.split("-")[1];
          })
          this.Zones = baseResponse.Zones;
          this.SelectedZones = this.Zones;
          if (this.LoggedInUserInfo.Branch?.BranchCode != "All") {
            this.PostDocument.controls['zone'].setValue(this.LoggedInUserInfo?.Zone?.ZoneId);
            this.GetBranches(this.LoggedInUserInfo.Zone.ZoneId);
          }
          //this.landSearch.controls['ZoneId'].setValue(this.Zones[0].ZoneId);
          //this.GetBranches(this.Zones[0].ZoneId);

          this._cdf.detectChanges();
        }
        //else
        //  this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
      });
  }

  searchZone(zoneId) {
    zoneId = zoneId.toLowerCase();
    if (zoneId != null && zoneId != undefined && zoneId != "")
      this.SelectedZones = this.Zones.filter(x => x.ZoneName.toLowerCase().indexOf(zoneId) > -1);
    else
      this.SelectedZones = this.Zones;
  }
  async getDocumentLoanType() {
    this.documentLoanTypes = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.ActiveLoanType })
    this.documentSelectedLoanType = this.documentLoanTypes.LOVs;
  }


  validateZoneOnFocusOut() {
    if (this.SelectedZones.length == 0)
      this.SelectedZones = this.Zones;
  }


  //-------------------------------Branch Core Functions-------------------------------//
  SetBranches(branch) {
    this.branch.BranchCode = branch.value;
  }

  GetBranches(ZoneId) {
    this.Branches = [];
    this.PostDocument.controls["branch"].setValue(null);
    this.Zone.ZoneId = ZoneId.value;
    this._circleService.getBranchesByZone(this.Zone)
      .pipe(
        finalize(() => {

        })
      ).subscribe(baseResponse => {

        if (baseResponse.Success) {

          this.Branches = baseResponse.Branches;
          this.SelectedBranches = this.Branches;
          if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
            this.PostDocument.controls['branch'].setValue(this.LoggedInUserInfo.Branch.BranchId);

          }
          //this.landSearch.controls['BranchId'].setValue(this.Branches[0].BranchId);
          this._cdf.detectChanges();
        }


      });

  }

  searchBranch(branchId) {
    branchId = branchId.toLowerCase();
    if (branchId != null && branchId != undefined && branchId != "")
      this.SelectedBranches = this.Branches.filter(x => x.Name.toLowerCase().indexOf(branchId) > -1);
    else
      this.SelectedBranches = this.Branches;
  }

  validateBranchOnFocusOut() {
    if (this.SelectedBranches.length == 0)
      this.SelectedBranches = this.Branches;
  }

  //-------------------------------Loan Type Core Functions-------------------------------//
  async getLoanType() {

    this.LoanTypes = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.LoanTypes })
    this.SelectedLoanType = this.LoanTypes.LOVs;
  }

  searchLoanType(loanTypeId) {
    loanTypeId = loanTypeId.toLowerCase();
    if (loanTypeId != null && loanTypeId != undefined && loanTypeId != "")
      this.SelectedLoanType = this.LoanTypes.LOVs.filter(x => x.Name.toLowerCase().indexOf(loanTypeId) > -1);
    else
      this.SelectedLoanType = this.LoanTypes.LOVs;
  }

  validateLoanTypeOnFocusOut() {
    if (this.SelectedLoanType.length == 0)
      this.SelectedLoanType = this.LoanTypes;
  }

  onChangeLoanType(loanType) {
    if (loanType.value == "1") {

      //this.applicationHeaderForm.controls["ProdAmount"].setValidators([Validators.required]);
      //this.applicationHeaderForm.controls["ProdAmount"].updateValueAndValidity();
      //this.applicationHeaderForm.controls["DevAmount"].clearValidators();
      //this.applicationHeaderForm.controls["DevAmount"].updateValueAndValidity();
    }
    else if (loanType.value == "2") {
      // this.applicationHeaderForm.controls["DevAmount"].setValidators([Validators.required]);
      // this.applicationHeaderForm.controls["DevAmount"].updateValueAndValidity();
      // this.applicationHeaderForm.controls["ProdAmount"].clearValidators();
      // this.applicationHeaderForm.controls["ProdAmount"].updateValueAndValidity();
    }
    else if (loanType.value == "3") {
      // this.applicationHeaderForm.controls["DevAmount"].setValidators([Validators.required]);
      // this.applicationHeaderForm.controls["DevAmount"].updateValueAndValidity();
      // this.applicationHeaderForm.controls["ProdAmount"].setValidators([Validators.required]);
      // this.applicationHeaderForm.controls["ProdAmount"].updateValueAndValidity();
    }
  }


  loadUploadDocumentsOnUpdate(appUploadDocumentsData, loanCaseNo) {
    if (appUploadDocumentsData.length != 0) {
      var tempDocumentArr: LoanDocumentsGrid[] = [];
      appUploadDocumentsData.forEach(function (item, key) {
        var grid = new LoanDocumentsGrid();
        grid.DocLoanId = item.DocLoanId;
        grid.DocumentRefNo = item.DocumentRefNo
        grid.LoanType = item.LoanType;
        grid.LoanStatus = item.StatusName;
        grid.DocumentId = item.DocID;
        grid.Description = item.DocName;
        grid.LoanCaseID = item.LoanCaseID;
        tempDocumentArr.push(grid);
      });
      this.loanDocumentArray = tempDocumentArr
    }
    this.loanCaseNo = loanCaseNo
  }

  viewDocument(DocID, event) {

    this._loanService.GetViewLoanDocument(DocID)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
    ).subscribe(baseResponse => {
      console.log("this is Document response", baseResponse.ViewDocumnets)


      this.url = baseResponse.ViewDocumnets.Path
      const dialogRef = this.dialog.open(ClDocumentViewComponent, {
        width: '50%',
        height: '50%',
        data: { documentView: baseResponse, url: this.url }
      });
      });
  }


  deleteDocument(DocId) {
    const _title = 'Confirmation';
    const _description = 'Do you really want to continue?';
    const _waitDesciption = '';
    const _deleteMessage = ``;

    const dialogRef = this.layoutUtilsService.AlertElementConfirmation(_title, _description, _waitDesciption);


    dialogRef.afterClosed().subscribe(res => {

      if (!res) {
        return;
      }

      if (this.loanDocumentArray.length == 0) {
        return false;
      } else {
        if (DocId == null || DocId == undefined || DocId == "") {
          this.cdRef.detectChanges();
          return true;
        }
        else {
          this.spinner.show();
          this._loanService.documentDelete(DocId)
            .pipe(
              finalize(() => {
                this.spinner.hide();

              })
            )
            .subscribe(baseResponse => {
              const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
            })
        }


      }


    })



  }
  hasError(controlName: string, errorName: string): boolean {
    return this.PostDocument.controls[controlName].hasError(errorName);
  }

  async getDocument() {

    this.document = await this._lovService.GetDocumentTypeLOV()

    this.SelectedDocument = this.document.LOVs;
    console.log(this.SelectedDocument)
  }

  onFileChange(event) {

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      var file = event.target.files[0];
      var Name = file.name.split('.').pop();
      if (Name != undefined) {
        if (Name.toLowerCase() == "jpg" || Name.toLowerCase() == "jpeg" || Name.toLowerCase() == "png") {
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.rawData.file = file;

          }
          reader.readAsDataURL(file);

        }
        else {
          this.layoutUtilsService.alertElement("", "Only jpeg,jpg and png files are allowed", "99");

          return;
        }
      }
    }


  }

  saveLoanDocuments() {
    this.loanDocument = Object.assign(this.loanDocument, this.PostDocument.getRawValue());
    this.loanDocument.file = this.rawData.file
    if (this.PostDocument.invalid) {
      const controls = this.PostDocument.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.spinner.show();
    this._loanService.documentUpload(this.loanDocument, this.loanDetail.TranId, this.loanCaseNo)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      ).subscribe(baseResponse => {
        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);

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
