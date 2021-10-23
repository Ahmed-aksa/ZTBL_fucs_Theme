import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { OnInit, Component, ChangeDetectorRef, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoanReceiptComponent } from '../loan-receipt/loan-receipt.component';
import { SignatureDialogComponent } from '../signature-dialog/signature-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateFormats, Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { KtDialogService } from 'app/shared/services/kt-dialog.service';
import { LovService } from 'app/shared/services/lov.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { CommonService } from 'app/shared/services/common.service';
import { RecoveryService } from 'app/shared/services/recovery.service';
import { AccountDetailModel, DisbursementGLModel, MasterCodes, RecoveryDataModel, RecoveryLoanTransaction, SubProposalGLModel } from 'app/shared/models/recovery.model';
import { BaseResponseModel } from 'app/shared/models/base_response.model';

@Component({
  selector: 'kt-search-recovery-common',
  templateUrl: './search-recovery-common.component.html',
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }

  ],
})
export class SearchRecoveryCommonComponent implements OnInit {

  Math: any;
  dataSource = new MatTableDataSource();
  matTableLenght: any;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;
  displayedColumns = ['Branch', 'VoucherNo', 'TransactionDate', 'LCNo', 'Tran Master', 'Debit', 'Credit', 'Status', 'Action'];
  gridHeight: string;
  OffSet: number = 0;
  ShowViewMore: boolean;
  recoveryDetail: any;


  @Input() SearchType: number;
  hasFormErrors = false;
  viewLoading = false;
  loadingAfterSubmit = false;
  ownerChecked = true;
  ShowTable: boolean = false;
  ShowError: boolean;
  AllowchargeCreation: boolean;
  SaveCustomer = false;
  remove: boolean;
  errorShow: boolean;
  submitted = false;
  dataFetched = false;
  RecoveryForm: FormGroup;
  sanctionedAmount: number = 0;
  tranId: string;
  public recoveryTypes: any[] = [];
  maxDate = new Date();
  searchSBS = false;

  public recoveryData = new RecoveryDataModel();
  public accountDetail = new AccountDetailModel();
  public masterCodes: MasterCodes[] = [];
  public SubProposalGLList: SubProposalGLModel[] = [];
  public DisbursementGLList: DisbursementGLModel[] = [];
  public RecoveryLoanTransaction: RecoveryLoanTransaction[] = [];
  CustomerStatuses: any;
  public LovCall = new Lov();
  public recoveryDataModel = new RecoveryDataModel();
  // currentIndex : number;
  // count : number;

  itemsPerPage = 10; //you could use your specified
  totalItems: number | any;
  pageIndex = 1;
  dv: number | any; //use later
  prevOffSet: any;

  MatTableLenght: boolean;

  findButton = "Find";
  requiryTypeRequired = false;
  isSBS: boolean = false;

  newDynamic: any = {};

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private _lovService: LovService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    private _recoveryService: RecoveryService,
    private spinner: NgxSpinnerService,
  ) {
    this.Math = Math;
   }

  ngOnInit() {

    this.createForm();

    this.recoveryTypes.push({ id: 1, name: 'Recovery' });
    this.recoveryTypes.push({ id: 2, name: 'Inter Branch Recovery' });
    this.recoveryTypes.push({ id: 3, name: 'SBS Recovery' });
    this.recoveryTypes.push({ id: 4, name: 'SBS Inter Branch Recovery' });
    var userInfo = this.userUtilsService.getUserDetails();
    let dateString = userInfo?.Branch?.WorkingDate;
    var day = 0;
    var month = 0;
    var year = 0;
    if (dateString) {
       day = parseInt(dateString.substring(0, 2));
       month = parseInt(dateString.substring(2, 4));
       year = parseInt(dateString.substring(4, 8));  
    }
    

    const branchWorkingDate = new Date(year, month - 1, day);
    this.RecoveryForm.controls.TransactionDate.setValue(branchWorkingDate);
    this.maxDate = new Date(year, month - 1, day);

    if (this.SearchType == 1) { //advance search
      this.loadLOV();
      this.RecoveryForm.controls.RecoveryType.setValue(0);
    }
    else if (this.SearchType == 2) {  // search pending
      this.RecoveryForm.controls.RecoveryType.setValue(1);
      this.RecoveryForm.controls.Status.setValue("P");
      this.find();
    }
    else if (this.SearchType == 3) { //search reffered back
      this.RecoveryForm.controls.RecoveryType.setValue(1);
      this.RecoveryForm.controls.Status.setValue("R");
      this.find();
    }
    else if (this.SearchType == 4) { //search sbs
      this.RecoveryForm.controls.RecoveryType.setValue(3);
      this.RecoveryForm.controls.Status.setValue("P");
      this.find();
    }
  }

  getKeys(obj: any) { return Object.keys(obj); }

  async loadLOV() {

    this.CustomerStatuses = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.CustomerStatus });
    
    this.CustomerStatuses = this.CustomerStatuses.LOVs;
    console.log('RecoveryStatus');
    console.log(this.CustomerStatuses);

    this.cdRef.detectChanges();

  }

  createForm() {
    this.RecoveryForm = this.formBuilder.group({
      LoanCaseNo: [''],
      Status: [''],
      RecoveryType: [0],
      TransactionDate: [''],
      VoucherNo: [''],
      InstrumentNO: [''],
    });
  }

  find() {

    

    var loanCaseNo = this.RecoveryForm.controls.LoanCaseNo.value;
    var status = this.RecoveryForm.controls.Status.value;
    var transactionDate = this.RecoveryForm.controls.TransactionDate.value;
    var voucherNo = this.RecoveryForm.controls.VoucherNo.value;
    var instrumentNO = this.RecoveryForm.controls.InstrumentNO.value;
    var recoveryType = "" + this.RecoveryForm.controls.RecoveryType.value;
    
    if(loanCaseNo !="" || voucherNo !="" || instrumentNO != ""){
      this.OffSet = 0;
    }

    var count = this.itemsPerPage.toString();
    var currentIndex = this.OffSet.toString();

    this.submitted = true;
    this.RecoveryLoanTransaction = [];
    this.spinner.show();
    this._recoveryService
      .getLoanTransaction(transactionDate, voucherNo, instrumentNO, recoveryType, loanCaseNo, status, currentIndex, count)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.dataFetched = true;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        

        if (baseResponse.Success === true) {
          this.MatTableLenght = true;
          this.RecoveryLoanTransaction = baseResponse.Recovery.RecoveryLoanTransaction;
          console.log('getLoanTransaction output');

          this.recoveryDetail = this.RecoveryLoanTransaction;
          this.totalItems = baseResponse.Recovery.RecoveryLoanTransaction[0].TotalCount;
          this.RecoveryLoanTransaction = this.recoveryDetail.slice(0, this.totalItems)
          
          console.log(this.pageIndex)
          
          var recoveryType = this.RecoveryForm.get('RecoveryType').value;
          this.searchSBS = (recoveryType == 4 || recoveryType == 3);

          this.cdRef.detectChanges();
        }
        else {
          this.matTableLenght = false;
          this.layoutUtilsService.alertElement("", baseResponse.Message);
        }

      });
  }

  change(){
    this.OffSet = 0;
    this.itemsPerPage = 10;
  }

  paginateAs(pageIndex : any, pageSize: any = this.itemsPerPage){
    
    this.itemsPerPage = pageSize;
      this.OffSet = (pageIndex -1) * this.itemsPerPage;
    this.pageIndex = pageIndex;
    this.find();
    this.RecoveryLoanTransaction = this.recoveryDetail.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
  }

  submit(transactionID: string, disbursementID: string, BranchWorkingDate: string, EffectiveDate: string) {
    
    //Open Signature box
    var receipt = { TransactionID: transactionID, DisbursementID: disbursementID, BranchWorkingDate: BranchWorkingDate, buttonText: "Close" };
    const signatureDialogRef = this.dialog.open(SignatureDialogComponent, { width: "500px", disableClose: true, data: receipt });
    signatureDialogRef.afterClosed().subscribe(res => {

      if (res == true) {
        this.spinner.show();
        //Submit recovery
        this._recoveryService
          .submitRecovery(transactionID, "", disbursementID, "3", EffectiveDate)
          .pipe(
            finalize(() => {
              this.submitted = false;
              this.spinner.hide();
            })
          )
          .subscribe((baseResponse: BaseResponseModel) => {
            console.log(baseResponse);
            if (baseResponse.Success === true) {

              //Show Receipt
              const dialogRef = this.dialog.open(LoanReceiptComponent, { width: "500px", disableClose: true, data: receipt });
              dialogRef.afterClosed().subscribe(res => {
                this.router.navigateByUrl('/loan-recovery/search-recovery-transaction');
              });
            }
            else {
              //this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
              this.layoutUtilsService.alertElement("", baseResponse.Message);
            }

          });
      }
    });
  }

  delete(transactionID: string) {
    this.spinner.show();

    this._recoveryService
      .deleteRecovery(transactionID, "3")
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        console.log(baseResponse);
        if (baseResponse.Success === true) {
          this.find();
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);

        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
        }

      });
  }

  editLoadTransaction(LnTransactionID: string, Lcno: string, ViewOnly: boolean) {
    this.router.navigate(['../fa-branch', { LnTransactionID: LnTransactionID, Lcno: Lcno, ViewOnly: ViewOnly }], { relativeTo: this.activatedRoute });
    //this.router.navigate(['/loan-recovery/fa-branch'], { queryParams: { transactionID: LnTransactionID, lcno: Lcno } });    
  }

  isShowEditIcon(status: string, circleID: string) {

    if (this.SearchType == 4) return false;

    var userInfo = this.userUtilsService.getUserDetails();
    var circle = userInfo.UserCircleMappings.filter(x => x.CircleId == circleID)[0];
    if (circle == undefined || circle == null || circle == "") {
      return false;
    }

    if (status == "P" || status == "R")
      return true;

    return false;
  }

  getTitle(): string {

    if (this.SearchType == 1)
      return "Advance Search Recovery Transaction";
    else if (this.SearchType == 2)
      return "Search Pending Transaction";
    else if (this.SearchType == 3)
      return "Search Reffered Back Transaction";
    else if (this.SearchType == 4)
      return "Search SBS Pending Transaction";
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.RecoveryForm.controls[controlName].hasError(errorName);
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  clearForm() {

    this.RecoveryForm.reset();
    //this.RecoveryForm.controls["sendVia"].setValue("");
    //this.RecoveryForm.markAsUntouched();
  }

  showReceipt(transaction) {
    
    var transactionID = transaction.TransactionID, DisbursementID = transaction.DisbursementID, BranchWorkingDate = transaction.BranchWorkingDate, receiptId = transaction.ReceiptId;
    
    

    var receipt = { TransactionID: transactionID, DisbursementID: DisbursementID, BranchWorkingDate: BranchWorkingDate, ReceiptId: receiptId, buttonText: "Close" };

    const dialogRef = this.dialog.open(LoanReceiptComponent, { width: "500px", disableClose: true, data: receipt });
    dialogRef.afterClosed().subscribe(res => {

    });
  }

  showReceiptIcon(transaction: any): boolean {
    return transaction.TransactionStatus == 'F' || transaction.TransactionStatus == 'S' || transaction.TransactionStatus == 'A';
  }
}
