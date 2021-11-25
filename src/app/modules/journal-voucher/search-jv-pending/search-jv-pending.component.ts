import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {LovService} from "../../../shared/services/lov.service";
import {DateFormats, Lov, LovConfigurationKey} from "../../../shared/classes/lov.class";
import {JournalVoucherService} from "../services/journal_voucher.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MatTableDataSource} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {finalize} from "rxjs/operators";
import {JournalVocherData} from "../models/journal_voucher.model";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";

@Component({
    selector: 'app-search-jv-pending',
    templateUrl: './search-jv-pending.component.html',
    styleUrls: ['./search-jv-pending.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class SearchJvPendingComponent implements OnInit {
    displayedColumns = ['Branch', 'VoucherNO', 'TransactionDate', 'Category', 'TransactionMaster', 'Debit', 'Credit', 'Status', 'Edit', 'View'];
    Math: any;
    OffSet: any;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    dv: number | any; //use later
    dataSource = new MatTableDataSource();
    matTableLenght: any;
    Zones: any = [];
    Branches: any = [];
    SelectedZones: any = [];
    loggedInUserDetails: any;
    loading: boolean;
    editBtn: boolean;
    maxDate = new Date();
    public LovCall = new Lov();
    public JournalVoucher = new JournalVocherData();
    LoggedInUserInfo;
    selected_b: any;
    selected_z: any;
    SelectedBranches: any = []
    pendingForm: FormGroup;
    JvStatuses: any;
    Nature: any;

    single_zone = true;
    disable_zone = true;

    single_branch = true;
    disable_branch = true;


    branch: any;
    zone: any;
    circle: any;

    //userDetail : any;
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
        this.loadLOV();
        this.createForm();
        this.SearchJvData();

        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();


        if (userInfo.Branch && userInfo.Branch.BranchCode != "All") {

            this.Branches = userInfo.Branch;
            this.SelectedBranches = this.Branches;

            this.Zones = userInfo.Zone;
            this.SelectedZones = this.Zones;

            this.selected_z = this.SelectedZones.ZoneId
            this.selected_b = this.SelectedBranches.BranchCode
            this.pendingForm.controls["ZoneId"]?.setValue(this.SelectedZones.Id);
            this.pendingForm.controls["OrganizationUnit"]?.setValue(this.SelectedBranches.branchCode);
            let dateString = userInfo?.Branch?.WorkingDate;
            var day = parseInt(dateString?.substring(0, 2));
            var month = parseInt(dateString?.substring(2, 4));
            var year = parseInt(dateString?.substring(4, 8));

            const branchWorkingDate = new Date(year, month - 1, day);
            this.pendingForm.controls.TransactionDate.setValue(branchWorkingDate);
            this.pendingForm.controls.ZoneId.setValue(userInfo?.Zone?.ZoneName);
            this.pendingForm.controls.OrganizationUnit.setValue(userInfo?.Branch?.branchCode);
            this.maxDate = new Date(year, month - 1, day);
        } else if (!userInfo.Branch && !userInfo.Zone && !userInfo.Zone) {
            this.spinner.show();
            this.userUtilsService.getZone().subscribe((data: any) => {
                let dateString = String(new Date());
                var day = parseInt(dateString?.substring(0, 2));
                var month = parseInt(dateString?.substring(2, 4));
                var year = parseInt(dateString?.substring(4, 8));

                const branchWorkingDate = new Date(year, month - 1, day);
                this.pendingForm.controls.TransactionDate.setValue(branchWorkingDate);
                this.pendingForm.controls.ZoneId.setValue(userInfo?.Zone?.ZoneName);
                this.pendingForm.controls.OrganizationUnit.setValue(userInfo?.Branch?.Name);
                this.maxDate = new Date(year, month - 1, day);
                this.Zones = data?.Zones;
                this.SelectedZones = this?.Zones;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();
            });

        }
        this.find();
        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    async loadLOV() {

        this.JvStatuses = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.JvStatus});

        this.JvStatuses = this.JvStatuses.LOVs;
        console.log(this.JvStatuses);

        this.Nature = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.JVCategory});

        this.Nature = this.Nature.LOVs;
        console.log(this.Nature);

        this.cdRef.detectChanges();
    }

    find() {
        this.OffSet = 0;
        this.pageIndex = 0;
        this.dataSource.data = [];
        this.SearchJvData();
    }

    createForm() {
        this.pendingForm = this.fb.group({
            ZoneId: [''],
            OrganizationUnit: [''],
            TransactionDate: [''],
            Nature: [''],
            VoucherNo: [''],
            Status: ['P'],
        });
    }


    SearchJvData() {


        this.spinner.show();
        var status = this.pendingForm.controls.Status.value;
        var nature = this.pendingForm.controls.Nature.value;
        var manualVoucher = this.pendingForm.controls.VoucherNo.value;
        var trDate = this.datePipe.transform(this.pendingForm.controls.TransactionDate.value, 'ddMMyyyy');

        if (nature == '') {
            nature = '1';
        }
        this.JournalVoucher = Object.assign(this.JournalVoucher, status);
        let branch = null;
        if (this.SelectedBranches.length)
            branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0]
        else
            branch = this.SelectedBranches;
        let zone = null;
        if (this.SelectedZones.length)
            zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
        else
            zone = this.SelectedZones;
        this.jv.getSearchJvTransactions(status, nature, manualVoucher, trDate,branch,zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {

                console.log(baseResponse)
                if (baseResponse.Success) {
                    this.loading = false;

                    this.dataSource.data = baseResponse.JournalVoucher.JournalVoucherDataList;

                    if (this.dataSource.data.length > 0)
                        this.matTableLenght = true;
                    else
                        this.matTableLenght = false;

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
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }

                this.loading = false;
            });

    }


    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        this.OffSet = pageIndex;

        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
    }

    editJv(Jv: any) {

        Jv.Branch = this.Branches;
        Jv.Zone = this.Zones;
        localStorage.setItem('SearchJvData', JSON.stringify(Jv));
        localStorage.setItem('EditJvData', '1');
        this.router.navigate(['../form', {upFlag: "1"}], {relativeTo: this.activatedRoute});
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.pendingForm.controls[controlName].hasError(errorName);
    }

    viewJv(Jv: any) {

        Jv.Branch = this.Branches;
        Jv.Zone = this.Zones;
        Jv.obj = "o";
        localStorage.setItem('SearchJvData', JSON.stringify(Jv));
        localStorage.setItem('EditJvData', '1');
        this.router.navigate(['../form', {upFlag: "1"}], {relativeTo: this.activatedRoute});
    }

    CheckEditStatus(jv: any) {


        if (jv.MakerID == this.loggedInUserDetails.User.UserId) {
            return true
            // if (jv.MakerID == this.loggedInUserDetails.User.UserId) {
            //   return true
            // }
            // else {
            //   return false
            // }
        } else {
            return false
        }

    }

    CheckViewStatus(jv: any) {

        //console.log(jv)
        if (jv.TransactionStatus != "1" && jv.TransactionStatus != "4") {
            return true
        } else {
            if (jv.MakerID == this.loggedInUserDetails.User.UserId) {
                return false
            } else {
                return true
            }
        }

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

