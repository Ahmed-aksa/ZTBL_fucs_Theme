import {DatePipe} from '@angular/common';
import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {FormBuilder, FormGroup} from "@angular/forms";
import {LovService} from "../../../shared/services/lov.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DateFormats, Lov, LovConfigurationKey} from "../../../shared/classes/lov.class";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {JournalVoucherService} from "../services/journal_voucher.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonService} from "../../../shared/services/common.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CircleService} from "../../../shared/services/circle.service";
import {finalize} from "rxjs/operators";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";

@Component({
    selector: 'app-jvmaster-code-dialog-component',
    templateUrl: './jvmaster-code-dialog-component.component.html',
    styleUrls: ['./jvmaster-code-dialog-component.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})

export class JvmasterCodeDialogComponentComponent implements OnInit {

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
    detailDataFetched = false;
    JvSearchForm: FormGroup;
    sanctionedAmount: number = 0;
    tranId: string;
    public recoveryTypes: any[] = [];
    public MasterCodeList: any[] = [];
    public MasterCodeListDetail: any[] = [];
    maxDate = new Date();
    Zones: any = [];
    SelectedZones: any = [];
    public LovCall = new Lov();
    //public recoveryData = new RecoveryDataModel();
    onDetailCall: boolean = false;
    tf: boolean = false;


    rowClicked;
    sRowClicked;

    JVCategories: any;

    findButton = "Find";
    requiryTypeRequired = false;

    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    codeDetail: any;

    newDynamic: any = {};

    constructor(
        public dialogRef: MatDialogRef<JvmasterCodeDialogComponentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private _lovService: LovService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private cdRef: ChangeDetectorRef,
        private datePipe: DatePipe,
        private _common: CommonService,
        private spinner: NgxSpinnerService,
        private _circleService: CircleService,
        private _journalVoucherService: JournalVoucherService,
    ) {
    }

    ngOnInit() {

        this.createForm();
        this.loadLOV();

        if (this.data) {
            this.JvSearchForm.controls.code.setValue(this.data.TransactionMasterID);
        }
        this.getMasterCode();
    }

    getKeys(obj: any) {
        return Object.keys(obj);
    }

    async loadLOV() {

        this.JVCategories = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.JVCategory});

        var fi: any = []
        fi.Value = "";
        fi.Name = "PLEASE SELECT---";
        fi.LovId = "12389"
        fi.Id = "0";
        fi.Description = "PLEASE SELECT---"


        // var arr = fi.concat(this.JVCategories.LOVs)
        //


        this.JVCategories.LOVs.push(fi)
        //this.JVCategories.LOVs.splice(0, fi)
        this.JVCategories = this.JVCategories.LOVs;
        //


        this.cdRef.detectChanges();

    }

    createForm() {
        this.JvSearchForm = this.formBuilder.group({
            category: [''],
            code: [''],
        });
    }

    selectedRow() {
        var index, table = document.getElementById("codeTable");

        //for(var i = 1; i < table.rows.length){}
    }

    getMasterCode() {
        var category = this.JvSearchForm.controls.category.value;
        var code = this.JvSearchForm.controls.code.value;


        this.submitted = true;
        this.MasterCodeList = [];
        this.spinner.show();
        this._journalVoucherService
            .getJVMasterCodes(category, code)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.dataFetched = true;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    this.MasterCodeList = baseResponse.JournalVoucher.JvMasterCodesList;

                    this.cdRef.detectChanges();
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });
    }

    find() {
        var category = this.JvSearchForm.controls.category.value;
        var code = this.JvSearchForm.controls.code.value;


        this.submitted = true;
        this.MasterCodeList = [];
        this.spinner.show();
        this._journalVoucherService
            .getJVMasterCodes(category, code)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.dataFetched = true;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {

                    this.MasterCodeList = baseResponse.JournalVoucher.JvMasterCodesList;
                    this.MasterCodeListDetail = [];

                    this.rowClicked = null;
                    this.sRowClicked = null;
                    var index = null;
                    this.changeTableRowColor(index);
                    this.changeSecondTableRowColor(index);
                    this.cdRef.detectChanges();
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                    this.MasterCodeListDetail = [];
                }

            });
    }


    findDetail(code: string, index: any) {

        //var code = this.JvSearchForm.controls.code.value;


        this.MasterCodeListDetail = [];
        this.spinner.show();
        this._journalVoucherService
            .getJVMasterCodesDetail(code)
            .pipe(
                finalize(() => {
                    this.detailDataFetched = true;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                    if (baseResponse.Success === true) {
                        this.MasterCodeListDetail = baseResponse.JournalVoucher.JvMasterCodeDetailList;
                        this.codeDetail = this.MasterCodeListDetail;
                        this.totalItems = this.MasterCodeListDetail.length;
                        this.paginate(this.pageIndex);


                        this.cdRef.detectChanges();
                    } else {
                        this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                    }

                },
                (error) => {

                    this.layoutUtilsService.alertElementSuccess("", "Error Occured While Processing Request", "500");

                });

        if (this.rowClicked == null || this.rowClicked != index) {

            this.changeTableRowColor(index);
            this.sRowClicked = null;
        }
    }

    detailCall(index: any) {

        this.onDetailCall = true;


        if (this.sRowClicked == null || this.sRowClicked != index) {
            this.changeSecondTableRowColor(index);
        }
        //this.tf = true;
    }

    changeTableRowColor(idx: any) {
        if (idx != null) {
            if (this.rowClicked === idx) this.rowClicked = -1;
            else this.rowClicked = idx;
        }

    }

    changeSecondTableRowColor(idx: any) {
        if (idx != null) {
            if (this.sRowClicked === idx) this.sRowClicked = -1;
            else this.sRowClicked = idx;
        }

    }

    paginate(event) {

        this.pageIndex = event;
        this.MasterCodeListDetail = this.codeDetail.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
    }

    editLoadTransaction(LnTransactionID: string, Lcno: string, ViewOnly: boolean) {
        this.router.navigate(['../fa-branch', {
            LnTransactionID: LnTransactionID,
            Lcno: Lcno,
            ViewOnly: ViewOnly
        }], {relativeTo: this.activatedRoute});
        //this.router.navigate(['/loan-recovery/fa-branch'], { queryParams: { transactionID: LnTransactionID, lcno: Lcno } });
    }

    isShowEditIcon(status: string, maker: string) {

        //var userInfo = this.userUtilsService.getUserDetails();
        //if (userInfo.User.UserId == maker && (status == "P"))
        //  return true;

        //return false;
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.JvSearchForm.controls[controlName].hasError(errorName);
    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    close(result: any): void {
        this.dialogRef.close(result);
    }

    clearForm() {
        this.JvSearchForm.reset();
    }

}

