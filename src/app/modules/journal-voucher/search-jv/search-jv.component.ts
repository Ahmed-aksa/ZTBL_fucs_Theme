import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DateFormats, Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {finalize} from 'rxjs/operators';
import {LovService} from "../../../shared/services/lov.service";
import {RecoveryService} from "../../../shared/services/recovery.service";
import {NgxSpinnerService} from "ngx-spinner";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {JournalVoucherService} from "../services/journal_voucher.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {CircleService} from "../../../shared/services/circle.service";
import {KtDialogService} from "../../../shared/services/kt-dialog.service";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {JournalVocherData} from "../models/journal_voucher.model";
import {Zone} from '../../../shared/models/zone.model';

import {LayoutUtilsService} from "../../../shared/services/layout-utils.service";
import {CommonService} from "../../../shared/services/common.service";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";

@Component({
    selector: 'app-search-jv',
    templateUrl: './search-jv.component.html',
    styleUrls: ['./search-jv.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class SearchJvComponent implements OnInit {
    Math: any;

    displayedColumns = ['Branch', 'VoucherNO', 'TransactionDate', 'Category', 'TransactionMaster', 'Debit', 'Credit', 'Status', 'View'];

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;
    selected_b: any;
    selected_z: any;
    hasFormErrors = false;
    viewLoading = false;
    loadingAfterSubmit = false;
    ShowTable: boolean = false;
    ShowError: boolean;
    SaveCustomer = false;
    remove: boolean;
    submitted = false;
    dataFetched = false;
    JvSearchForm: FormGroup;
    tranId: string;
    public recoveryTypes: any[] = [];
    maxDate = new Date();
    Zones: any = [];
    Branches: any = [];
    SelectedBranches: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();
    LoggedInUserInfo: BaseResponseModel;
    loggedInUserDetails: any;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_zone = true;
    OffSet: any;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    dv: number | any; //use later

    JvStatuses: any;
    Nature: any;
    JVCategories: any;
    public LovCall = new Lov();
    public JournalVoucher = new JournalVocherData();

    dataSource = new MatTableDataSource();
    matTableLenght: any;


    findButton = "Find";
    requiryTypeRequired = false;


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
        public snackBar: MatSnackBar,
        private filterFB: FormBuilder,
        private datePipe: DatePipe,
        private _common: CommonService,
        private _recoveryService: RecoveryService,
        private spinner: NgxSpinnerService,
        private _circleService: CircleService,
        private jv: JournalVoucherService
    ) {
        this.Math = Math;
    }

    ngOnInit() {

        this.createForm();
        this.loadLOV();

        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();


        if (userInfo.Branch && userInfo.Branch.BranchCode != "All") {

            this.Branches = userInfo.Branch;
            this.SelectedBranches = this.Branches;

            this.Zone = userInfo.Zone;
            this.SelectedZones = this.Zone;

            this.selected_z = this.SelectedZones.ZoneId
            this.selected_b = this.SelectedBranches.BranchCode
            this.JvSearchForm.controls["ZoneId"]?.setValue(this.SelectedZones.Id);
            this.JvSearchForm.controls["OrganizationUnit"]?.setValue(this.SelectedBranches.Name);
            let dateString = userInfo?.Branch?.WorkingDate;
            var day = parseInt(dateString?.substring(0, 2));
            var month = parseInt(dateString?.substring(2, 4));
            var year = parseInt(dateString?.substring(4, 8));

            const branchWorkingDate = new Date(year, month - 1, day);
            this.JvSearchForm.controls.TransactionDate.setValue(branchWorkingDate);
            this.JvSearchForm.controls.ZoneId.setValue(userInfo?.Zone?.ZoneName);
            this.JvSearchForm.controls.OrganizationUnit.setValue(userInfo?.Branch?.Name);
            this.maxDate = new Date(year, month - 1, day);
        } else if (!userInfo.Branch && !userInfo.Zone && !userInfo.Zone) {
            this.spinner.show();
            this.userUtilsService.getZone().subscribe((data: any) => {
                let dateString = String(new Date());
                var day = parseInt(dateString?.substring(0, 2));
                var month = parseInt(dateString?.substring(2, 4));
                var year = parseInt(dateString?.substring(4, 8));

                const branchWorkingDate = new Date(year, month - 1, day);
                this.JvSearchForm.controls.TransactionDate.setValue(branchWorkingDate);
                this.JvSearchForm.controls.ZoneId.setValue(userInfo?.Zone?.ZoneName);
                this.JvSearchForm.controls.OrganizationUnit.setValue(userInfo?.Branch?.Name);
                this.maxDate = new Date(year, month - 1, day);
                this.Zone = data?.Zones;
                this.SelectedZones = this?.Zone;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();
            });

        }
        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
    }

    getKeys(obj: any) {
        return Object.keys(obj);
    }

    async loadLOV() {

        this.JvStatuses = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.JvStatus});

        this.JvStatuses = this.JvStatuses.LOVs;
        this.Nature = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.JVCategory});

        this.Nature = this.Nature.LOVs;
        this.cdRef.detectChanges();

    }

    createForm() {
        this.JvSearchForm = this.formBuilder.group({
            ZoneId: [''],
            OrganizationUnit: [''],
            TransactionDate: [''],
            Nature: [''],
            VoucherNo: [''],
            Status: [''],
        });
    }

    validateZoneOnFocusOut() {
        if (this.SelectedZones.length == 0)
            this.SelectedZones = this.Zones;
    }


    find() {
        this.OffSet = 0;
        this.pageIndex = 0;
        this.dataSource.data = [];
        this.SearchJvData();
    }

    SearchJvData() {


        this.spinner.show();
        this.JournalVoucher.Offset = this.OffSet.toString();
        this.JournalVoucher.Limit = this.itemsPerPage.toString();

        var status = this.JvSearchForm.controls.Status.value;
        var nature = this.JvSearchForm.controls.Nature.value;
        var manualVoucher = this.JvSearchForm.controls.VoucherNo.value;
        var trDate = this.datePipe.transform(this.JvSearchForm.controls.TransactionDate.value, 'ddMMyyyy');

        if (status == '') {
            status = 'ALL';
        }

        if (nature == '') {
            nature = '1';
        }
        this.JournalVoucher = Object.assign(this.JournalVoucher, status);

        this.jv.getSearchJvTransactions(status, nature, manualVoucher, trDate)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {

                if (baseResponse.Success) {
                    this.loading = false;

                    this.dataSource.data = baseResponse.JournalVoucher.JournalVoucherDataList;

                    if (this.dataSource.data.length > 0)
                        this.matTableLenght = true;
                    else
                        this.matTableLenght = false;

                    this.dv = this.dataSource.data;
                    this.totalItems = baseResponse.JournalVoucher.JournalVoucherDataList.length;
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                } else {

                    this.matTableLenght = false;

                    this.dataSource = this.dv.slice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
                    //this.dataSource.data = [];
                    //this._cdf.detectChanges();
                    this.OffSet = 1;
                    this.pageIndex = 1;
                    this.dv = this.dv.slice(1, 0);
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

                this.loading = false;
            });

    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        this.OffSet = pageIndex;
        //this.SearchJvData();
        //this.dv.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
    }


    CheckEidtStatus(jv: any) {


        if (jv.Status == "2" || jv.Status == "5") {
            if (jv.EnteredBy == this.loggedInUserDetails.User.UserId) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }

    }

    CheckViewStatus(jv: any) {


        if (jv.Status != "2" && jv.Status != "5") {
            return true
        } else {
            if (jv.EnteredBy == this.loggedInUserDetails.User.UserId) {
                return false
            } else {
                return true
            }
        }

    }

    editJv(Jv: any) {
        Jv.Branch = this.Branches;
        Jv.Zone = this.Zones;
        Jv.obj = "o";
        localStorage.setItem('SearchJvData', JSON.stringify(Jv));
        localStorage.setItem('EditJvData', '1');
        this.router.navigate(['../form', {upFlag: "1"}], {relativeTo: this.activatedRoute});
    }

    // viewJv(Jv: any){
    //   debugger
    //   Jv.Branch = this.Branches.filter(x => x.BranchId == Jv.BranchId);
    //   Jv.Zone = this.Zones.filter(x => x.ZoneId == Jv.ZoneID);
    //   localStorage.setItem('SearchJvData', JSON.stringify(Jv));
    //   localStorage.setItem('ViewJvData', '2');
    //   this.router.navigate(['../form', { upFlag : "2"}], { relativeTo: this.activatedRoute });
    // }

    isShowEditIcon(status: string, maker: string) {

        var userInfo = this.userUtilsService.getUserDetails();
        if (userInfo.User.UserId == maker && (status == "P"))
            return true;

        return false;
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.JvSearchForm.controls[controlName].hasError(errorName);
    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }


    clearForm() {

        this.JvSearchForm.reset();
    }

    changeZone(changedValue) {
        let changedZone = {Zone: {ZoneId: changedValue.value}}
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }
}

