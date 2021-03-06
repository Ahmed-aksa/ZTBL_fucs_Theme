/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-var */
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {finalize} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoanReceiptComponent} from '../loan-receipt/loan-receipt.component';
import {SignatureDialogComponent} from '../signature-dialog/signature-dialog.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {DateFormats, Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {RecoveryService} from 'app/shared/services/recovery.service';
import {
    AccountDetailModel,
    DisbursementGLModel,
    MasterCodes,
    RecoveryDataModel,
    RecoveryLoanTransaction,
    SubProposalGLModel
} from 'app/shared/models/recovery.model';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {ViewMapsComponent} from "../../../shared/component/view-map/view-map.component";
import {Activity} from "../../../shared/models/activity.model";

@Component({
    selector: 'kt-search-recovery-common',
    templateUrl: './search-recovery-common.component.html',
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class SearchRecoveryCommonComponent implements OnInit {

    Math: any;
    dataSource = new MatTableDataSource();
    matTableLenght: any;
    circle: any;
    branch: any;
    zone: any;
    currentActivity: Activity;
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
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
    disableWorkingDate = false;
    MatTableLenght: boolean;

    findButton = "Find";
    requiryTypeRequired = false;
    isSBS: boolean = false;

    newDynamic: any = {};

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private datePipe: DatePipe,
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
        if (this.router.url == '/loan-recovery/search-recovery-transaction')
            this.currentActivity = this.userUtilsService.getActivity('Advance Search Recovery');
        if (this.router.url == '/loan-recovery/search-pending-transaction')
            this.currentActivity = this.userUtilsService.getActivity('Search Pending Transaction');
        if (this.router.url == '/loan-recovery/search-refferedback-transaction')
            this.currentActivity = this.userUtilsService.getActivity('Search Refferback Transaction');
        if (this.router.url == '/loan-recovery/search-sbs-pending-transaction')
            this.currentActivity = this.userUtilsService.getActivity('Search SBS Pending Transaction');
        this.createForm();
        this.loadLOV();

        this.recoveryTypes.push({id: 1, name: 'Recovery'});
        this.recoveryTypes.push({id: 2, name: 'Inter Branch Recovery'});
        this.recoveryTypes.push({id: 3, name: 'SBS Recovery'});
        this.recoveryTypes.push({id: 4, name: 'SBS Inter Branch Recovery'});
        var userInfo = this.userUtilsService.getUserDetails();
        let dateString = userInfo?.Branch?.WorkingDate;

        var day = 0;
        var month = 0;
        var year = 0;
        if (dateString) {
            day = parseInt(dateString.substring(0, 2));
            month = parseInt(dateString.substring(2, 4));
            year = parseInt(dateString.substring(4, 8));
            const branchWorkingDate = new Date(year, month - 1, day);
            this.RecoveryForm.controls.TransactionDate.setValue(branchWorkingDate);
            this.RecoveryForm.controls.WorkingDate.setValue(branchWorkingDate);
        }


        this.maxDate = new Date(year, month - 1, day);

        if (userInfo.Branch.WorkingDate) {
            this.disableWorkingDate = true
        } else {
            this.disableWorkingDate = false
        }
        if (this.SearchType == 1) { //advance search
            this.RecoveryForm.controls.RecoveryType.setValue(0);
        } else if (this.SearchType == 2) {  // search pending
            this.RecoveryForm.controls.RecoveryType.setValue(1);
            this.RecoveryForm.controls.Status.setValue("P");
            this.RecoveryForm.controls.Status.disable();
        } else if (this.SearchType == 3) { //search reffered back
            this.RecoveryForm.controls.RecoveryType.setValue(1);
            this.RecoveryForm.controls.Status.setValue("R");
            this.RecoveryForm.controls.Status.disable();
        } else if (this.SearchType == 4) { //search sbs
            this.RecoveryForm.controls.RecoveryType.setValue(3);
            this.RecoveryForm.controls.Status.setValue("P");
            this.RecoveryForm.controls.Status.disable();
        }
    }

    ngAfterViewInit() {
        this.gridHeight = window.innerHeight - 220 + 'px';
    }

    getKeys(obj: any) {
        return Object.keys(obj);
    }

    async loadLOV() {

        this.CustomerStatuses = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.RecoveryStatus});

        this.CustomerStatuses = this.CustomerStatuses.LOVs;

        console.log(this.CustomerStatuses)


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
            WorkingDate: [null, Validators.required]
        });
    }

    find(from_button = false) {
        var loanCaseNo = this.RecoveryForm.controls.LoanCaseNo.value;
        var status = this.RecoveryForm.controls.Status.value;
        var transactionDate = this.datePipe.transform(this.RecoveryForm.controls.TransactionDate.value, 'ddMMyyyy');
        var voucherNo = this.RecoveryForm.controls.VoucherNo.value;
        var instrumentNO = this.RecoveryForm.controls.InstrumentNO.value;
        var recoveryType = "" + this.RecoveryForm.controls.RecoveryType.value;

        this.branch.WorkingDate = this.datePipe.transform(this.RecoveryForm.controls.WorkingDate.value, 'ddMMyyyy') //this.RecoveryForm.controls.WorkingDate.value;
        if (loanCaseNo != "" || voucherNo != "" || instrumentNO != "") {
            this.OffSet = 0;
        }

        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();

        this.submitted = true;
        this.RecoveryLoanTransaction = [];
        this.spinner.show();
        this._recoveryService
            .getLoanTransaction(transactionDate, voucherNo, instrumentNO, recoveryType, loanCaseNo, status, currentIndex, count, this.zone, this.branch)
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

                    this.recoveryDetail = this.RecoveryLoanTransaction;
                    this.totalItems = baseResponse.Recovery.RecoveryLoanTransaction[0].TotalCount;
                    this.RecoveryLoanTransaction = this.recoveryDetail.slice(0, this.totalItems)


                    var recoveryType = this.RecoveryForm.get('RecoveryType').value;
                    this.searchSBS = (recoveryType == 4 || recoveryType == 3);
                    if (from_button)
                        this.pageIndex = 0;
                    this.cdRef.detectChanges();
                } else {
                    this.matTableLenght = false;
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }

            });
    }

    change() {
        this.OffSet = 0;
        this.itemsPerPage = 10;
    }

    paginateAs(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.find();
        this.RecoveryLoanTransaction = this.recoveryDetail.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }

    submit(transactionID: string, disbursementID: string, BranchWorkingDate: string, EffectiveDate: string) {

        //Open Signature box
        var receipt = {
            TransactionID: transactionID,
            DisbursementID: disbursementID,
            BranchWorkingDate: BranchWorkingDate,
            buttonText: "Close"
        };
        const signatureDialogRef = this.dialog.open(SignatureDialogComponent, {
            width: "500px",
            disableClose: true,
            data: receipt
        });
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

                        if (baseResponse.Success === true) {

                            //Show Receipt
                            const dialogRef = this.dialog.open(LoanReceiptComponent, {
                                width: "500px",
                                disableClose: true,
                                data: receipt
                            });
                            dialogRef.afterClosed().subscribe(res => {
                                this.router.navigateByUrl('/loan-recovery/search-recovery-transaction');
                            });
                        } else {
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

                if (baseResponse.Success === true) {
                    this.find();
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);

                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }

            });
    }

    editLoadTransaction(LnTransactionID: string, Lcno: string, ViewOnly: boolean) {
        this.router.navigate(['../fa-branch', {
            LnTransactionID: LnTransactionID,
            Lcno: Lcno,
            ViewOnly: ViewOnly
        }], {relativeTo: this.activatedRoute});
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

    checkMap(data) {
        if (data?.Lat?.length > 0) {
            if (data.Lat == "0.0") {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    viewMap(data) {
        const dialogRef = this.dialog.open(ViewMapsComponent, {
            panelClass: ['h-screen', 'max-w-full', 'max-h-full'],
            width: '100%',
            data: data,
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
        });
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

        var transactionID = transaction.TransactionID, DisbursementID = transaction.DisbursementID,
            BranchWorkingDate = transaction.BranchWorkingDate, receiptId = transaction.ReceiptId;


        var receipt = {
            TransactionID: transactionID,
            DisbursementID: DisbursementID,
            BranchWorkingDate: BranchWorkingDate,
            ReceiptId: receiptId,
            buttonText: "Close"
        };

        const dialogRef = this.dialog.open(LoanReceiptComponent, {
            panelClass: ['w-5/12'],
            disableClose: true, data: receipt
        });
        dialogRef.afterClosed().subscribe(res => {

        });
    }

    showReceiptIcon(transaction: any): boolean {
        return transaction.TransactionStatus == 'F' || transaction.TransactionStatus == 'S' || transaction.TransactionStatus == 'A';
    }

    getAllData(event) {

        this.circle = event.final_circle;
        this.zone = event.final_zone;
        this.branch = event.final_branch;
    }


    isEnableWorkingDate() {
        var workingDate = this.RecoveryForm.controls.WorkingDate.value;
        if (workingDate._isAMomentObject == undefined) {
            try {
                var day = this.RecoveryForm.controls.WorkingDate.value.getDate();
                var month = this.RecoveryForm.controls.WorkingDate.value.getMonth() + 1;
                var year = this.RecoveryForm.controls.WorkingDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.RecoveryForm.controls.WorkingDate.setValue(branchWorkingDate);
            } catch (e) {

            }
        } else {
            try {
                var day = this.RecoveryForm.controls.WorkingDate.value.toDate().getDate();
                var month = this.RecoveryForm.controls.WorkingDate.value.toDate().getMonth() + 1;
                var year = this.RecoveryForm.controls.WorkingDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                workingDate = day + "" + month + "" + year;


                const branchWorkingDate = new Date(year, month - 1, day);
                this.RecoveryForm.controls.WorkingDate.setValue(branchWorkingDate);
            } catch (e) {

            }
        }
    }

}
