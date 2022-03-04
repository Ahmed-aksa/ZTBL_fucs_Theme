import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DateFormats, Lov, LovConfigurationKey} from "../../../shared/classes/lov.class";
import {JournalVocherData} from "../models/journal_voucher.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {LovService} from "../../../shared/services/lov.service";
import {JournalVoucherService} from "../services/journal_voucher.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {finalize} from "rxjs/operators";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {Activity} from "../../../shared/models/activity.model";


@Component({
    selector: 'app-search-jv-rb',
    templateUrl: './search-jv-rb.component.html',
    styleUrls: ['./search-jv-rb.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class SearchJvRbComponent implements OnInit, AfterViewInit {
    displayedColumns = ['Branch', 'VoucherNO', 'TransactionDate', 'Category', 'TransactionMaster', 'Debit', 'Credit', 'Status', 'Edit', 'View'];
    Math: any;
    OffSet: any;
    //pagination

    branch: any;
    zone: any;
    circle: any;

    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    dv: number | any; //use later
    dataSource = new MatTableDataSource();
    matTableLenght: any;
    Zones: any = [];
    Branches: any = [];
    SelectedBranches: any = [];
    SelectedZones: any = [];
    disable_branch = true;
    disable_zone = true;
    selected_b: any;
    selected_z: any;
    single_zone = true;
    single_branch = true;
    loggedInUserDetails: any;
    loading: boolean;
    maxDate = new Date();
    public LovCall = new Lov();
    public JournalVoucher = new JournalVocherData();
    LoggedInUserInfo;

    referbackForm: FormGroup;
    JvStatuses: any;
    Nature: any;
    currentActivity: Activity;

    constructor(
        private cdRef: ChangeDetectorRef,
        private spinner: NgxSpinnerService,
        private jv: JournalVoucherService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private userUtilsService: UserUtilsService,
        private fb: FormBuilder,
        private datePipe: DatePipe,
    ) {
        this.loggedInUserDetails = this.userUtilsService.getUserDetails();
        this.Math = Math;
    }

    ngOnInit() {
        this.currentActivity = this.userUtilsService.getActivity('Referred Back Transaction');
        this.loadLOV();
        this.createForm();

        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

        //this.find();
    }

    ngAfterViewInit() {
        if (this.zone) {
            setTimeout(() => this.SearchJvData(), 1000);
        }
    }


    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    find() {
        this.OffSet = 0;
        this.pageIndex = 0;
        this.dataSource.data = [];
        this.SearchJvData();
    }

    createForm() {
        this.referbackForm = this.fb.group({
            TransactionDate: [''],
            Nature: [''],
            VoucherNo: [''],
            Status: ['R'],
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.referbackForm.controls[controlName].hasError(errorName);
    }

    SearchJvData() {


        this.spinner.show();
        var status = this.referbackForm.controls.Status.value;
        var nature = this.referbackForm.controls.Nature.value;
        var manualVoucher = this.referbackForm.controls.VoucherNo.value;
        var trDate = this.datePipe.transform(this.referbackForm.controls.TransactionDate.value, 'ddMMyyyy');


        if (nature == '') {
            nature = '1';
        }

        // this.JournalVoucher = Object.assign(this.JournalVoucher, status);

        this.jv.getSearchJvTransactions(status, nature, manualVoucher, trDate, this.branch, this.zone)
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
                    //if (this.dataSource.data.length == 0) {
                    //  this.dataSource.data = baseResponse.searchLandData;
                    //  this.ShowViewMore = true;
                    //}
                    //else {
                    //  for (var i = 0; i < baseResponse.searchLandData.length; i++) {

                    //    this.dataSource.data.push(baseResponse.searchLandData[i]);
                    //  }
                    //  this.dataSource._updateChangeSubscription();
                    //}
                    //pagination
                    this.dv = this.dataSource.data;
                    //this.dataSource = new MatTableDataSource(data);

                    this.totalItems = baseResponse.JournalVoucher.JournalVoucherDataList.length;
                    //this.paginate(this.pageIndex) //calling paginate function
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

    async loadLOV() {

        this.JvStatuses = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.JvStatus});

        this.JvStatuses = this.JvStatuses.LOVs;


        this.Nature = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.JVCategory});

        this.Nature = this.Nature.LOVs;


        this.cdRef.detectChanges();
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        this.OffSet = pageIndex;
        //this.SearchJvData();
        //this.dv.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
    }

    viewJv(Jv: any) {

        Jv.Branch = this.Branches;
        Jv.Zone = this.Zones;
        Jv.obj = "o";
        localStorage.setItem('SearchJvData', JSON.stringify(Jv));
        localStorage.setItem('EditJvData', '1');
        this.router.navigate(['../form', {upFlag: "1"}], {relativeTo: this.activatedRoute});
    }

    editJv(Jv: any) {

        Jv.Branch = this.Branches;
        Jv.Zone = this.Zones;
        localStorage.setItem('SearchJvData', JSON.stringify(Jv));
        localStorage.setItem('EditJvData', '1');
        this.router.navigate(['../form', {upFlag: "1"}], {relativeTo: this.activatedRoute});
    }

    CheckEditStatus(jv: any) {


        if (jv.MakerID == JSON.parse(localStorage.getItem('ZTBLUser')).User.UserId) {
            return true

        } else {
            return false
        }

    }

    CheckViewStatus(jv: any) {


        if (jv.Status != "1" && jv.Status != "4") {
            return true
        } else {
            if (jv.EnteredBy == this.loggedInUserDetails.User.UserId) {
                return false
            } else {
                return true
            }
        }

    }

}
