import {Component, OnInit, ChangeDetectorRef, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from '@angular/forms';
import {LoanReceiptComponent} from '../loan-receipt/loan-receipt.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {SignatureDialogComponent} from '../signature-dialog/signature-dialog.component';
import {DatePipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateFormats, Lov, LovConfigurationKey, MaskEnum} from 'app/shared/classes/lov.class';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {KtDialogService} from 'app/shared/services/kt-dialog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LovService} from 'app/shared/services/lov.service';
import {CustomerService} from 'app/shared/services/customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {CommonService} from 'app/shared/services/common.service';
import {RecoveryService} from 'app/shared/services/recovery.service';
import {finalize, takeUntil} from 'rxjs/operators';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {
    AccountDetailModel,
    DisbursementGLModel,
    MasterCodes,
    RecoveryCustomer,
    RecoveryDataModel,
    RecoveryLoanTransaction,
    RecoveryTypes,
    SubProposalGLModel
} from 'app/shared/models/recovery.model';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'kt-recovery-form',
    templateUrl: './recovery-form.component.html',
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})

export class RecoveryFormComponent implements OnInit {

    @Input() RecoveryType: number;
    @Input() lcno: string;
    @Input() transactionID: string;
    @Input() viewOnly: boolean;
    @Input() mcReceipt: boolean = true;

    zone: any;
    branch: any;
    circle: any;
    //RecoveryForm: FormGroup;
    RecoveryForm: FormGroup = this.formBuilder.group({
        RecoveryType: ['', [Validators.required]],
        ContraBranchCode: [''],
        Zone: ['', [Validators.required]],
        Branch: ['', [Validators.required]],
        BranchWorkingDate: ['', [Validators.required]],
        TransactionType: ['', [Validators.required]],
        EffectiveDate: ['', [Validators.required]],
        VoucherNo: ['0000', [Validators.required]],
        LoanCaseNo: ['', [Validators.required]],
        SubProposalID: ['', [Validators.required]],
        DisbursementID: ['', [Validators.required]],
        MasterTrCode: ['', [Validators.required]],
        TrCode: ['', [Validators.required]],
        Amount: ['', [Validators.required]],
        Remarks: ['', [Validators.required, Validators.maxLength(200)]],
        RecoveryThroughType: [''],
        BookNo: ['', [Validators.maxLength(10)]],
        ReceiptNo: ['', [Validators.maxLength(10)]],
        CoordinatorID: [''],
        InstrumentType: ['', [Validators.required]],
        InstrumentNO: ['', [Validators.required, Validators.min(1)]],
        SamRecoveryType: ['M', [Validators.required]],
        TransactionStatus: ['P'],
        TransactionID: [''],
        TransactionFlag: [''],
        LnAccountID: [''],
        LoanSanctionID: [''],
        OrgUnitid: [''],
        TransactionCode: [''],
        CircleID: [''],
        TranDate: [''],
        Installments: ['1'],
        AdviceNo: [''],

    });


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
    accountDetailFetched = false;
    submitted = false;
    ibDisSave: boolean = false;

    sanctionedAmount: number = 0;
    tranId: string;
    remarksError = false;
    transactionEdit = false;
    totalAmountMsg = "Total Amount not more then Total OS";
    public recoveryData = new RecoveryDataModel();
    public accountDetail = new AccountDetailModel();
    public masterCodes: MasterCodes[] = [];
    public SubProposalGLList: SubProposalGLModel[] = [];
    public DisbursementGLList: DisbursementGLModel[] = [];
    public RecoveryLoanTransaction: RecoveryLoanTransaction[] = [];
    public customers: RecoveryCustomer[] = [];
    TransactionTypes: any;
    TrCodesRecovery: any;
    TrCodesRecoveryDefaultSelected: string;
    RecoveryThroughList: any;
    Coordinators: any;
    AllCoordinators: any;
    InstrumentTypes: any;
    SamRecoveryTypes: any;
    branchId: number;
    branchCode: number;
    minDate = new Date();
    maxDate = new Date();
    amountError = false;
    isEditMode = false;
    showInstrument = true;
    recoverySaved = false;
    showAdviceNo = false;
    receipt: any;
    UserCircleMappings: any;
    UserCircleMappingsDefaultSelected: string;
    isSAMStatus = false;
    isSbsRecovery = true;
    dataSaved = false;
    isInterBranchRecovery = false;
    isSimpleRecovery = false;
    submitButtonText = "Submit";
    signatureData: any;
    signatureSaved = false;


    public maskEnums = MaskEnum;
    public LovCall = new Lov();
    public recoveryDataModel = new RecoveryDataModel();

    public PostCodeLov: any;
    public LandingProcedureLov: any;
    public CustomerLov: any;
    public BranchLov: any;
    public ZoneLov: any;
    public selectedCustomerID: any;
    public errorMessage: any;
    public recoveryThrough = false;

    public searchFilterCtrlCoordinator: FormControl = new FormControl();
    newDynamic: any = {};
    private _onDestroy = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private _lovService: LovService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userUtilsService: UserUtilsService,
        private cdRef: ChangeDetectorRef,
        private toastr: ToastrService,
        private datePipe: DatePipe,
        private _common: CommonService,
        private _recoveryService: RecoveryService,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService,
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit() {
        this.spinner.show();
        this.searchFilterCtrlCoordinator.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCoordinator();
            });

        if (this.viewOnly == undefined)
            this.transactionEdit = false;
        else if (this.viewOnly.toString() == "true") {
            this.viewOnly = true;
        } else if (this.viewOnly.toString() == "false") {
            this.transactionEdit = true;
            this.viewOnly = false;
            this.cdRef.detectChanges();
        }

        this.AllowchargeCreation = false;
        this.ShowError = false;
        this.remove = false;

        //this.createForm();

        this.RecoveryForm.controls.TransactionID.setValue(this.transactionID);
        var userInfo = this.userUtilsService.getUserDetails();
        userInfo.CanCollectRecoveryForAllMCO = userInfo.CanCollectRecoveryForAllMCO == undefined ? false : userInfo.CanCollectRecoveryForAllMCO;
        if (userInfo.CanCollectRecoveryForAllMCO == false) {
            this.UserCircleMappings = userInfo?.UserCircleMappings;
            this.UserCircleMappingsDefaultSelected = userInfo?.UserCircleMappings[0] ? this.UserCircleMappings[0]?.CircleId : 0;
        } else {
            this.spinner.show();
            this._recoveryService
                .getCircles()
                .pipe(
                    finalize(() => {
                        this.spinner.hide();
                    })
                )
                .subscribe((baseResponse: BaseResponseModel) => {
                    if (baseResponse.Success === true) {
                        this.UserCircleMappings = baseResponse.UserCircleMappings;

                        this.UserCircleMappingsDefaultSelected = this.UserCircleMappings[0].CircleId;
                        this.cdRef.detectChanges();
                    } else {
                        this.layoutUtilsService.alertMessage("", baseResponse.Message);
                    }
                });
        }


        this.branchId = parseInt(userInfo?.Branch?.BranchId);
        this.branchCode = parseInt(userInfo?.Branch?.BranchCode);
        this.RecoveryForm.controls.Zone.setValue(userInfo?.Zone?.ZoneName);
        this.RecoveryForm.controls.Branch.setValue(userInfo?.Branch?.Name);
        this.RecoveryForm.controls.BranchWorkingDate.setValue(userInfo?.Branch?.WorkingDate);
        this.RecoveryForm.controls.RecoveryType.setValue(this.RecoveryType);
        if (this.RecoveryType == RecoveryTypes.Recovery || this.RecoveryType == RecoveryTypes.InterBranchRecovery)
            this.isSbsRecovery = true;

        this.RecoveryForm.controls.LoanCaseNo.setValue(this.lcno);

        if (this.RecoveryType == RecoveryTypes.InterBranchRecovery || this.RecoveryType == RecoveryTypes.SBSInterBranchRecovery) {
            this.RecoveryForm.controls.ContraBranchCode.setValidators([Validators.required]);
            this.RecoveryForm.controls.ContraBranchCode.updateValueAndValidity();
            this.isInterBranchRecovery = true;
            this.submitButtonText = "Make and Submit";
        } else {
            this.isSimpleRecovery = true;
        }

        let dateString = this.RecoveryForm.controls.BranchWorkingDate.value;
        var day = parseInt(dateString.substring(0, 2));
        var month = parseInt(dateString.substring(2, 4));
        var year = parseInt(dateString.substring(4, 8));

        const branchWorkingDate = new Date(year, month - 1, day);
        this.RecoveryForm.controls.EffectiveDate.setValue(branchWorkingDate);

        this.maxDate = new Date(year, month - 1, day);
        //this.minDate = new Date(year, month - 1, day - 1);

        this.isEnableReceipt(false);


        this.loadLOV();
        if (this.lcno != undefined && this.lcno != null && this.lcno != "")
            this.getTransactiondetailByID();
    }

    ngAfterViewInit() {
        this.spinner.hide();
    }

    private filterCoordinator() {
        let search = this.searchFilterCtrlCoordinator.value;
        this.Coordinators = this.AllCoordinators;
        if (!search) {
            this.Coordinators = this.AllCoordinators;
        } else {
            search = search.toLowerCase();
            this.Coordinators = this.Coordinators.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
        }
    }


    get recoveryThroughValidator() {
        const validator = this.RecoveryForm.get('RecoveryThroughType').validator ? this.RecoveryForm.get('RecoveryThroughType').validator({} as AbstractControl) : '';
        if (validator && validator.required) {
            return true;
        }
    }

    get coordinatorValidator() {
        const validator = this.RecoveryForm.get('CoordinatorID').validator ? this.RecoveryForm.get('CoordinatorID').validator({} as AbstractControl) : '';
        if (validator && validator.required) {
            return true;
        }

    }

    async loadLOV() {
        this.TransactionTypes = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.TransactionType});
        this.TransactionTypes = this.TransactionTypes.LOVs;
        this.RecoveryForm.controls.TransactionType.setValue("C");
        this.TrCodesRecovery = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.TrCodeRecovery});
        // this.TrCodesRecovery = this.TrCodesRecovery.LOVs;
        this.TrCodesRecovery = this.TrCodesRecovery.LOVs.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);

        if (!this.transactionEdit && !this.viewOnly) {
            this.RecoveryForm.controls.TrCode.setValue(this.TrCodesRecovery[0].Value);
            this.TrCodesRecoveryDefaultSelected = this.TrCodesRecovery[0].Value;
        }

        this.RecoveryThroughList = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.RecoveryThrouth});
        this.RecoveryThroughList = this.RecoveryThroughList.LOVs;

        this.InstrumentTypes = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.InstrumentType});
        this.InstrumentTypes = this.InstrumentTypes.LOVs;

        this.SamRecoveryTypes = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.SamRecoveryType});
        this.SamRecoveryTypes = this.SamRecoveryTypes.LOVs;
        this.cdRef.detectChanges();
    }

    createForm() {

        this.RecoveryForm = this.formBuilder.group({
            RecoveryType: ['', [Validators.required]],
            ContraBranchCode: [''],
            Zone: ['', [Validators.required]],
            Branch: ['', [Validators.required]],
            BranchWorkingDate: ['', [Validators.required]],
            TransactionType: ['', [Validators.required]],
            EffectiveDate: ['', [Validators.required]],
            VoucherNo: ['0000', [Validators.required]],
            LoanCaseNo: ['', [Validators.required]],
            SubProposalID: ['', [Validators.required]],
            DisbursementID: ['', [Validators.required]],
            MasterTrCode: ['', [Validators.required]],
            TrCode: ['', [Validators.required]],
            Amount: ['', [Validators.required]],
            Remarks: ['', [Validators.required, Validators.maxLength(200)]],
            RecoveryThroughType: ['', [Validators.required]],
            BookNo: ['', [Validators.maxLength(10)]],
            ReceiptNo: ['', [Validators.maxLength(10)]],
            CoordinatorID: ['', [Validators.required]],
            InstrumentType: ['', [Validators.required]],
            InstrumentNO: ['', [Validators.required]],
            SamRecoveryType: ['M', [Validators.required]],
            TransactionStatus: ['P'],
            TransactionID: [''],
            TransactionFlag: [''],
            LnAccountID: [''],
            LoanSanctionID: [''],
            OrgUnitid: [''],
            TransactionCode: [''],
            CircleID: [''],
            TranDate: [''],
            Installments: ['1'],
            AdviceNo: [''],

        });
    }

    onSearchChange(totalAmount: string): void {
        if (this.accountDetail.Status == "SAM") {
            if (this.accountDetail.SamTotalOS != undefined && this.accountDetail.SamTotalOS != null) {
                if (parseInt(totalAmount) > parseInt(this.accountDetail.SamTotalOS.toString())) {
                    this.amountError = true;
                    this.totalAmountMsg = "Total Amount not more then SAM Total(OS)";
                } else
                    this.amountError = false;
            }
        } else {
            if (this.accountDetail.TotalOutstand != undefined && this.accountDetail.TotalOutstand != null) {
                if (parseInt(totalAmount) > parseInt(this.accountDetail.TotalOutstand.toString())) {
                    this.amountError = true;
                    this.totalAmountMsg = "Total Amount not more then Total(OS)";
                } else
                    this.amountError = false;
            }
        }
        this.cdRef.detectChanges();
    }

    isEnableReceipt(isTrCodeChange: boolean) {

        var effectiveDate = this.RecoveryForm.controls.EffectiveDate.value;
        try {
            var day = this.RecoveryForm.controls.EffectiveDate.value._d.getDate();
            var month = this.RecoveryForm.controls.EffectiveDate.value._d.getMonth() + 1;
            var year = this.RecoveryForm.controls.EffectiveDate.value._d.getFullYear();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            effectiveDate = day + "" + month + "" + year;
        } catch (e) {

        }

        var value = false;
        if (this.RecoveryForm.controls.BranchWorkingDate.value != effectiveDate) {
            value = true;
        }
        if (this.RecoveryForm.controls.TrCode.value === "15") {
            value = true;
        }
        if (this.RecoveryForm.controls.TrCode.value === "15") {
            this.recoveryThrough = true;
            this.RecoveryForm.controls.BookNo.setValidators([Validators.required]);
            this.RecoveryForm.controls.BookNo.updateValueAndValidity();

            this.RecoveryForm.controls.ReceiptNo.setValidators([Validators.required]);
            this.RecoveryForm.controls.ReceiptNo.updateValueAndValidity();

            if (this.isSAMStatus == true) {
                this.RecoveryForm.controls.RecoveryThroughType.setValidators([Validators.required]);
                this.RecoveryForm.controls.RecoveryThroughType.updateValueAndValidity();

                this.RecoveryForm.controls.CoordinatorID.setValidators([Validators.required]);
                this.RecoveryForm.controls.CoordinatorID.updateValueAndValidity();
            }

            if (this.isInterBranchRecovery == true) {
                this.RecoveryForm.controls.BookNo.setValidators([]);
                this.RecoveryForm.controls.BookNo.updateValueAndValidity();

                this.RecoveryForm.controls.ReceiptNo.setValidators([]);
                this.RecoveryForm.controls.ReceiptNo.updateValueAndValidity();
            }
        } else {
            this.recoveryThrough = false;
            this.RecoveryForm.controls.BookNo.setValidators([]);
            this.RecoveryForm.controls.BookNo.updateValueAndValidity();
            this.RecoveryForm.controls.BookNo.setValue("");

            this.RecoveryForm.controls.ReceiptNo.setValidators([]);
            this.RecoveryForm.controls.ReceiptNo.updateValueAndValidity();
            this.RecoveryForm.controls.ReceiptNo.setValue("");

            this.RecoveryForm.controls.RecoveryThroughType.setValidators([]);
            this.RecoveryForm.controls.RecoveryThroughType.updateValueAndValidity();
            this.RecoveryForm.controls.RecoveryThroughType.setValue("");

            this.RecoveryForm.controls.CoordinatorID.setValidators([]);
            this.RecoveryForm.controls.CoordinatorID.updateValueAndValidity();
            this.RecoveryForm.controls.CoordinatorID.setValue("");
        }

    }


    getAccountDetail() {
        var loanDisbID = this.RecoveryForm.controls.DisbursementID.value;
        var type = this.RecoveryForm.controls.TransactionType.value;
        var recoveryType = this.RecoveryType.toString();
        if (this.RecoveryForm.controls.EffectiveDate.value._isAMomentObject != undefined)
            this.recoveryDataModel.EffectiveDate = this.RecoveryForm.controls.EffectiveDate.value.format('DDMMyyy')
        var effectiveDate = this.recoveryDataModel.EffectiveDate;
        this.spinner.show();
        this._recoveryService
            .getAccountDetails(loanDisbID, type, recoveryType, effectiveDate)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    this.accountDetail = baseResponse.Recovery.AccountDetailList;
                    this.masterCodes = baseResponse.Recovery.MasterCodesList;
                    this.accountDetailFetched = true;
                    if (this.isEditMode)
                        this.changeMasterCode();
                    if (this.accountDetail.Status == "SAM") {
                        this.isSAMStatus = true;
                    } else {
                        this.isSAMStatus = false;
                        this.RecoveryForm.controls['RecoveryThroughType'].disable();
                        this.RecoveryForm.controls['CoordinatorID'].disable();
                        this.RecoveryForm.controls.RecoveryThroughType.setValidators([]);
                        this.RecoveryForm.controls.RecoveryThroughType.updateValueAndValidity();

                        this.RecoveryForm.controls.CoordinatorID.setValidators([]);
                        this.RecoveryForm.controls.CoordinatorID.updateValueAndValidity();
                    }
                    this.cdRef.detectChanges();
                } else {
                    this.layoutUtilsService.alertMessage("", baseResponse.Message);
                }

            });
    }


    getSubProposalGL(isSearchClicked = false) {
        var contraBranchCode = this.RecoveryForm.controls.ContraBranchCode.value;
        var LoanCaseNo = this.RecoveryForm.controls.LoanCaseNo.value;
        if (LoanCaseNo == undefined || LoanCaseNo == "" || LoanCaseNo == null) {
            this.RecoveryForm.controls.LoanCaseNo.markAsTouched();
            return;
        }

        if (contraBranchCode == undefined || contraBranchCode == "" || contraBranchCode == null) {
            if (this.RecoveryType == RecoveryTypes.InterBranchRecovery || this.RecoveryType == RecoveryTypes.SBSInterBranchRecovery) {
                this.RecoveryForm.controls.ContraBranchCode.markAsTouched();
                return;
            }
        }

        var TransactionType = this.RecoveryForm.controls.TransactionType.value;
        var circleID = this.RecoveryForm.controls.CircleID.value;
        var ForSBs = this.RecoveryType == RecoveryTypes.SBSRecovery || this.RecoveryType == RecoveryTypes.SBSInterBranchRecovery ? true : false;
        var ForInterBranch = this.RecoveryType == RecoveryTypes.InterBranchRecovery || this.RecoveryType == RecoveryTypes.SBSInterBranchRecovery ? true : false;
        var mode = (this.transactionID == undefined || this.transactionID == null || this.transactionID == "") ? 1 : 2;
        this.spinner.show();
        this._recoveryService
            .getSubProposalGL(TransactionType, ForInterBranch, ForSBs, LoanCaseNo, circleID, contraBranchCode, mode)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.SubProposalGLList = [];
                    if (isSearchClicked)
                        this.RecoveryForm.controls.SubProposalID.reset();
                    this.SubProposalGLList = baseResponse.Recovery.SubProposalGLList;
                    this.DisbursementGLList = [];
                    this.masterCodes = [];
                    if (this.isEditMode && !isSearchClicked)
                        this.getDisbursementByGL();
                } else {
                    this.layoutUtilsService.alertMessage("", baseResponse.Message);
                }

            });
    }

    getDisbursementByGL(isGLselection = false) {
        var SanctionID = this.RecoveryForm.controls.SubProposalID.value;
        this.RecoveryForm.controls.LoanSanctionID.setValue(SanctionID);
        this.spinner.show();
        this._recoveryService
            .getDisbursementByGL(SanctionID)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                    //this.ktDialogService.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    if (isGLselection)
                        this.RecoveryForm.controls.DisbursementID.reset();
                    this.DisbursementGLList = baseResponse.Recovery.DisbursementGLList;
                    if (this.isEditMode && !isGLselection)
                        this.getAccountDetail();
                } else {
                    this.layoutUtilsService.alertMessage("", baseResponse.Message);
                }

            });
    }

    getTransactiondetailByID() {
        this.spinner.show();
        this._recoveryService
            .getTransactiondetailByID(this.RecoveryForm.controls.TransactionID.value, this.RecoveryForm.controls.LoanCaseNo.value)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.isEditMode = true;
                    this.RecoveryLoanTransaction = baseResponse.Recovery.DrCrDetailList;
                    this.customers = baseResponse.Recovery.Customers;
                    this.recoveryDataModel = baseResponse.Recovery.RecoveryData;
                    this.RecoveryForm.controls.BookNo.setValue(this.recoveryDataModel.BookNo);
                    this.RecoveryForm.controls.BranchWorkingDate.setValue(this.recoveryDataModel.BranchWorkingDate);
                    this.RecoveryForm.controls.DisbursementID.setValue(this.recoveryDataModel.DisbursementID);

                    let dateString = this.recoveryDataModel.EffectiveDate;
                    var day = parseInt(dateString.substring(0, 2));
                    var month = parseInt(dateString.substring(2, 4));
                    var year = parseInt(dateString.substring(4, 8));

                    const branchWorkingDate = new Date(year, month - 1, day);
                    this.RecoveryForm.controls.EffectiveDate.setValue(branchWorkingDate);

                    this.RecoveryForm.controls.InstrumentNO.setValue(this.recoveryDataModel.InstrumentNO == undefined ? "" : this.recoveryDataModel.InstrumentNO);
                    this.RecoveryForm.controls.InstrumentType.setValue(this.recoveryDataModel.InstrumentType);
                    this.RecoveryForm.controls.LnAccountID.setValue(this.recoveryDataModel.LnAccountID);
                    this.RecoveryForm.controls.LoanCaseNo.setValue(this.recoveryDataModel.LoanCaseNo);
                    this.RecoveryForm.controls.SubProposalID.setValue(this.recoveryDataModel.LoanSanctionID);
                    this.RecoveryForm.controls.LoanSanctionID.setValue(this.recoveryDataModel.LoanSanctionID);
                    //this.RecoveryForm.controls.MakerID.setValue(this.recoveryDataModel.MakerID);
                    this.RecoveryForm.controls.MasterTrCode.setValue(this.recoveryDataModel.MasterTrCode);
                    this.RecoveryForm.controls.OrgUnitid.setValue(this.recoveryDataModel.OrgUnitid);
                    this.RecoveryForm.controls.ReceiptNo.setValue(this.recoveryDataModel.ReceiptNo);
                    this.RecoveryForm.controls.RecoveryThroughType.setValue(this.recoveryDataModel.RecoveryThroughType);
                    this.RecoveryForm.controls.Remarks.setValue(this.recoveryDataModel.Remarks);
                    this.RecoveryForm.controls.SamRecoveryType.setValue(this.recoveryDataModel.SamRecoveryType);
                    this.RecoveryForm.controls.TrCode.setValue(this.recoveryDataModel.TrCode);
                    this.RecoveryForm.controls.TransactionCode.setValue(this.recoveryDataModel.TransactionCode);
                    this.RecoveryForm.controls.TransactionFlag.setValue(this.recoveryDataModel.TransactionFlag);
                    this.RecoveryForm.controls.TransactionID.setValue(this.recoveryDataModel.TransactionID);
                    this.RecoveryForm.controls.TransactionStatus.setValue(this.recoveryDataModel.TransactionStatus);
                    this.RecoveryForm.controls.TransactionType.setValue(this.recoveryDataModel.TransactionType);
                    this.RecoveryForm.controls.VoucherNo.setValue(this.recoveryDataModel.VoucherNo);
                    this.RecoveryForm.controls.CircleID.setValue(this.recoveryDataModel.CircleID);
                    this.RecoveryForm.controls.TranDate.setValue(this.recoveryDataModel.TranDate);
                    this.RecoveryForm.controls.Amount.setValue(baseResponse.Recovery.RecoveryData.CrAmount);
                    this.RecoveryForm.controls.Installments.setValue("1");
                    this.getSubProposalGL();
                    this.isEnableReceipt(true);
                    this.getCoordinatorsByID();

                } else {
                    this.layoutUtilsService.alertMessage("", baseResponse.Message);
                }
            });
    }

    getCoordinatorsByID() {
        var transactionID = this.RecoveryForm.controls.LoanCaseNo.value;
        this.spinner.show();
        this._recoveryService
            .getCoordinatorsByID(this.RecoveryForm.controls.RecoveryThroughType.value, transactionID)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                    //this.ktDialogService.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.AllCoordinators = baseResponse.Recovery.Coordinators;
                    this.Coordinators = baseResponse.Recovery.Coordinators;
                    if (this.recoveryDataModel.CoordinatorID)
                        this.RecoveryForm.controls.CoordinatorID.setValue(this.recoveryDataModel.CoordinatorID);
                } else {
                    this.layoutUtilsService.alertMessage("", baseResponse.Message);
                }

            });
    }

    changeMasterCode() {
        var masterCode = this.masterCodes.filter(x => x.LnTransactionMasterID == this.RecoveryForm.controls.MasterTrCode.value)[0];
        if (masterCode != undefined) {
            if (masterCode.ChequeReq == "Y") {
                this.showInstrument = true;

                this.RecoveryForm.controls.InstrumentType.setValidators([Validators.required]);
                this.RecoveryForm.controls.InstrumentType.updateValueAndValidity();

                this.RecoveryForm.controls.InstrumentNO.setValidators([Validators.required]);
                this.RecoveryForm.controls.InstrumentNO.updateValueAndValidity();

            } else {
                this.RecoveryForm.controls.InstrumentType.setValidators([]);
                this.RecoveryForm.controls.InstrumentType.updateValueAndValidity();

                this.RecoveryForm.controls.InstrumentNO.setValidators([]);
                this.RecoveryForm.controls.InstrumentNO.updateValueAndValidity();
                this.showInstrument = false;
            }
        }
    }

    getTitle(): string {

        if (this.RecoveryType == RecoveryTypes.Recovery)
            return "FA Branch Recovery";
        else if (this.RecoveryType == RecoveryTypes.InterBranchRecovery) {
            this.showAdviceNo = true;
            this.RecoveryForm.controls.AdviceNo.setValidators([Validators.required]);
            this.RecoveryForm.controls.AdviceNo.updateValueAndValidity();

            this.RecoveryForm.controls.InstrumentNO.setValidators([]);
            this.RecoveryForm.controls.InstrumentNO.updateValueAndValidity();

            return "Inter Branch Recovery";
        } else if (this.RecoveryType == RecoveryTypes.SBSRecovery)
            return "SBS Recovery";
        else if (this.RecoveryType == RecoveryTypes.SBSInterBranchRecovery) {
            this.showAdviceNo = true;
            this.RecoveryForm.controls.AdviceNo.setValidators([Validators.required]);
            this.RecoveryForm.controls.AdviceNo.updateValueAndValidity();

            this.RecoveryForm.controls.InstrumentNO.setValidators([]);
            this.RecoveryForm.controls.InstrumentNO.updateValueAndValidity();

            return "SBS Inter Branch Recovery";
        }
    }

    viewLLCInquiry() {
        var Lcno = this.RecoveryForm.controls.LoanCaseNo.value;
        var LnTransactionID = this.RecoveryForm.controls.TransactionID.value;
        let url = this.router.serializeUrl(
            this.router.createUrlTree(['../loan-inquiry', {
                LnTransactionID: LnTransactionID,
                Lcno: Lcno
            }], {relativeTo: this.activatedRoute})
        );
        url = '#' + url;
        window.open(url, '_blank');

        //this.router.navigate(['../loan-inquiry', { LnTransactionID: LnTransactionID, Lcno: Lcno }], { relativeTo: this.activatedRoute });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.RecoveryForm.controls[controlName].hasError(errorName);
    }

    save() {
        this.errorShow = false;
        this.hasFormErrors = false;
        if (this.RecoveryForm.invalid) {
            const controls = this.RecoveryForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.toastr.error("Please Enter Required values");

            this.hasFormErrors = true;
            return;
        }


        this.recoveryDataModel = Object.assign(this.recoveryDataModel, this.RecoveryForm.getRawValue());
        var effectiveDate = this.RecoveryForm.controls.EffectiveDate.value;
        if (effectiveDate._isAMomentObject == undefined) {
            try {
                var day = this.RecoveryForm.controls.EffectiveDate.value.getDate();
                var month = this.RecoveryForm.controls.EffectiveDate.value.getMonth() + 1;
                var year = this.RecoveryForm.controls.EffectiveDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                this.recoveryDataModel.EffectiveDate = day + "" + month + "" + year;
            } catch (e) {

            }
        } else {
            try {
                var day = this.RecoveryForm.controls.EffectiveDate.value.toDate().getDate();
                var month = this.RecoveryForm.controls.EffectiveDate.value.toDate().getMonth() + 1;
                var year = this.RecoveryForm.controls.EffectiveDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                this.recoveryDataModel.EffectiveDate = day + "" + month + "" + year;
            } catch (e) {

            }
        }

        if (this.RecoveryType == RecoveryTypes.InterBranchRecovery || this.RecoveryType == RecoveryTypes.SBSInterBranchRecovery) {
            this.recoveryDataModel.InstrumentNO = this.RecoveryForm.controls.AdviceNo.value;
        }
        var userInfo = this.userUtilsService.getUserDetails();

        this.recoveryDataModel.Amount = this.recoveryDataModel.Amount.toString();
        this.recoveryDataModel.IpAddress = "192.168.232.2";
        this.recoveryDataModel.MakerID = userInfo.User.UserId;
        this.recoveryDataModel.RecoveryType = this.recoveryDataModel.RecoveryType.toString();
        this.recoveryDataModel.ContraBranchCode = this.RecoveryType == RecoveryTypes.InterBranchRecovery || this.RecoveryType == RecoveryTypes.SBSInterBranchRecovery ? this.recoveryDataModel.ContraBranchCode.toString() : null;
        this.recoveryDataModel.TransactionID = this.recoveryDataModel.TransactionID == undefined ? "" : this.recoveryDataModel.TransactionID;
        this.recoveryDataModel.BookNo = this.recoveryDataModel.BookNo == null ? "" : this.recoveryDataModel.BookNo;
        this.recoveryDataModel.ReceiptNo = this.recoveryDataModel.ReceiptNo == null ? "" : this.recoveryDataModel.ReceiptNo;

        this.spinner.show();
        this.submitted = true;
        this._recoveryService
            .saveRecoveryData(this.recoveryDataModel, this.zone, this.branch)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.dataSaved = true;
                    this.RecoveryLoanTransaction = baseResponse.Recovery.DrCrDetailList;
                    this.customers = baseResponse.Recovery.Customers;
                    if (this.isInterBranchRecovery) {
                        this.receipt.TransactionID = baseResponse.Recovery.RecoveryData.TransactionID;
                        this.RecoveryForm.controls.TransactionID.setValue(baseResponse.Recovery.RecoveryData.TransactionID);
                    } else {
                        this.recoveryDataModel = baseResponse.Recovery.RecoveryData;
                        try {
                            let dateString = this.recoveryDataModel.EffectiveDate;
                            var day = parseInt(dateString.substring(0, 2));
                            var month = parseInt(dateString.substring(2, 4));
                            var year = parseInt(dateString.substring(4, 8));

                            const branchWorkingDate = new Date(year, month - 1, day);
                            this.RecoveryForm.controls.EffectiveDate.setValue(branchWorkingDate);

                        } catch (e) {

                        }
                        try {
                            let tranDateString = this.recoveryDataModel.TranDate;
                            var day = parseInt(tranDateString.substring(0, 2));
                            var month = parseInt(tranDateString.substring(2, 4));
                            var year = parseInt(tranDateString.substring(4, 8));

                            const tranDate = new Date(year, month - 1, day);
                            this.RecoveryForm.controls.TransactionDate.setValue(tranDate);

                        } catch (e) {

                        }
                        this.RecoveryForm.controls.TransactionID.setValue(this.recoveryDataModel.TransactionID);
                        this.RecoveryForm.controls.VoucherNo.setValue(this.recoveryDataModel.VoucherNo);
                    }


                    this.recoverySaved = false;
                    this.cdRef.detectChanges();

                    if (this.isSimpleRecovery)
                        this.layoutUtilsService.alertMessage("", baseResponse.Message);

                    if (this.isInterBranchRecovery) {
                        this.ibDisSave = true;
                        this.submitRecovery()
                    }

                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    this.cdRef.detectChanges();
                }

            });

    }

    submitRecovery() {
        debugger
        var remarks = this.RecoveryForm.controls.Remarks.value;
        var transactionID = this.RecoveryForm.controls.TransactionID.value;
        var disbursementID = this.RecoveryForm.controls.DisbursementID.value;

        if (transactionID == undefined || transactionID == null) {
            this.layoutUtilsService.alertElement('', 'Please Save Recovery before Submission.')
            return
        }

        this.spinner.show();
        this._recoveryService
            .submitRecovery(transactionID, remarks, disbursementID, this.RecoveryType.toString(), this.recoveryDataModel.EffectiveDate)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.receipt.ReceiptId = baseResponse.Recovery.RecoveryData.ReceiptNo;
                    this.getSignatures();
                } else {
                    this.layoutUtilsService.alertMessage("", baseResponse.Message);
                }

            });
    }

    saveSignature() {
        this.spinner.show();
        this._recoveryService
            .updateSignature(this.signatureData, this.receipt.TransactionID, this.receipt.ReceiptId)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                    this.submitted = false;
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.signatureSaved = true;

                    this.receipt.RecoveryType = this.RecoveryType.toString();
                    const dialogRef = this.dialog.open(LoanReceiptComponent, {
                        width: "500px",
                        disableClose: true,
                        data: this.receipt
                    });
                    dialogRef.afterClosed().subscribe(res => {

                    });
                } else {
                    this.layoutUtilsService.alertMessage("", baseResponse.Message);
                }
            });
    }

    makeAndSubmit() {
        var remarks = this.RecoveryForm.controls.Remarks.value;
        var transactionID = this.RecoveryForm.controls.TransactionID.value;
        var disbursementID = this.RecoveryForm.controls.DisbursementID.value;

        if (remarks == undefined || remarks == null || remarks == "") {
            this.remarksError = true;
            return;
        } else {
            this.remarksError = false;
        }
        this.receipt = {
            DisbursementID: this.RecoveryForm.controls.DisbursementID.value,
            RecoveryType: this.RecoveryForm.controls.SamRecoveryType.value,
            Remarks: this.RecoveryForm.controls.Remarks.value,
            TranDate: this.RecoveryForm.controls.TranDate.value,
            TransactionID: this.RecoveryForm.controls.TransactionID.value,
            TransactionStatus: this.RecoveryForm.controls.TransactionStatus.value,
            TransactionType: this.RecoveryForm.controls.TransactionType.value,
            BranchWorkingDate: this.RecoveryForm.controls.BranchWorkingDate.value,
            buttonText: "Close and Exit",
            isInterBranchRecovery: this.isInterBranchRecovery
        };
        try {
            var day = this.RecoveryForm.controls.EffectiveDate.value.toDate().getDate();
            var month = this.RecoveryForm.controls.EffectiveDate.value.toDate().getMonth() + 1;
            var year = this.RecoveryForm.controls.EffectiveDate.value.toDate().getFullYear();
            if (month < 10) {
                month = "0" + month;
            }
            this.recoveryDataModel.EffectiveDate = day + "" + month + "" + year;
        } catch (e) {

        }
        if (this.isInterBranchRecovery) {
            this.save();
            this.ibDisSave = true;
            //this.submitRecovery()
        } else {
            this.submitRecovery();
        }

        // if (!this.signatureSaved) {
    }

    getSignatures() {

        const signatureDialogRef = this.dialog.open(SignatureDialogComponent, {
            width: "500px",
            disableClose: true,
            data: this.receipt
        });
        signatureDialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.signatureData = res;
                if (this.isInterBranchRecovery)//make and submit
                {
                    this.saveSignature();
                    return
                }
                this.receipt.RecoveryType = this.RecoveryType.toString();
                const dialogRef = this.dialog.open(LoanReceiptComponent, {
                    width: "500px",
                    disableClose: true,
                    data: this.receipt
                });
                dialogRef.afterClosed().subscribe(res => {

                });
                return;
            } else {
                this.layoutUtilsService.alertMessage("", "signature not applied");
            }

        });


        //}
    }


    deleteRecovery() {
        var transactionID = this.RecoveryForm.controls.TransactionID.value;
        this.spinner.show();
        this._recoveryService
            .deleteRecovery(transactionID, this.RecoveryType.toString())
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message).afterClosed().subscribe(res => {
                        this.router.navigateByUrl('/dashboard');
                    });

                } else {
                    this.layoutUtilsService.alertMessage("", baseResponse.Message);
                }

            });
    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    clearForm() {
        var zone = this.RecoveryForm.controls.Zone.value;
        var branch = this.RecoveryForm.controls.Branch.value;
        var branchWorkingDate = this.RecoveryForm.controls.BranchWorkingDate.value;
        var transactionType = this.RecoveryForm.controls.TransactionType.value;
        var samRecoveryType = this.RecoveryForm.controls.SamRecoveryType.value;
        if (this.isSimpleRecovery)
            var circle = this.UserCircleMappingsDefaultSelected;

        var day = parseInt(branchWorkingDate.substring(0, 2));
        var month = parseInt(branchWorkingDate.substring(2, 4));
        var year = parseInt(branchWorkingDate.substring(4, 8));
        this.SubProposalGLList = []
        this.DisbursementGLList = []
        this.masterCodes = []
        this.RecoveryForm.controls["Zone"].setValue(zone);
        this.RecoveryForm.controls["Branch"].setValue(branch);
        this.RecoveryForm.controls["BranchWorkingDate"].setValue(branchWorkingDate);
        this.RecoveryForm.controls["TransactionType"].setValue(transactionType);
        this.RecoveryForm.controls["VoucherNo"].setValue("0000");
        this.RecoveryForm.controls["SamRecoveryType"].setValue(samRecoveryType);
        this.RecoveryForm.controls["EffectiveDate"].setValue(new Date(year, month - 1, day));
        this.RecoveryForm.controls.InstrumentNO.setValue(this.recoveryDataModel.InstrumentNO == undefined ? "" : this.recoveryDataModel.InstrumentNO);


        if (this.isSimpleRecovery) {
            this.RecoveryForm.controls["CircleID"].setValue(circle);
            this.UserCircleMappingsDefaultSelected = circle;
        }
        this.RecoveryForm.controls.RecoveryType.setValue(this.RecoveryType);
        if (this.RecoveryForm.controls.CoordinatorID.value == null)
            this.RecoveryForm.controls.CoordinatorID.setValue("");
        // //this.RecoveryForm.markAsUntouched();
        this.RecoveryForm.controls["LoanCaseNo"].reset();
        this.RecoveryForm.controls["SubProposalID"].reset();
        this.RecoveryForm.controls["DisbursementID"].reset();
        this.RecoveryForm.controls["MasterTrCode"].reset();
        this.RecoveryForm.controls["Amount"].reset();
        this.RecoveryForm.controls["Remarks"].reset();
        this.RecoveryForm.controls["BookNo"].reset();
        this.RecoveryForm.controls["ReceiptNo"].reset();
        this.RecoveryForm.markAsPristine();
        this.RecoveryForm.markAsUntouched();
        this.RecoveryForm.updateValueAndValidity();
        this.accountDetailFetched = false;
        this.accountDetail = new AccountDetailModel();
        this.dataSaved = false;
        this.recoverySaved = false;
        this.cdRef.detectChanges();
    }

    getAllData(event: any) {
        this.circle = event.final_circle;
        this.zone = event.final_zone;
        this.branch = event.final_branch;
    }
}
