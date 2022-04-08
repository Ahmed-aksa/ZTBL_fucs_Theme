// Angular
import {ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {errorMessages, Lov, LovConfigurationKey, MaskEnum} from 'app/shared/classes/lov.class';
import {Activity} from 'app/shared/models/activity.model';
import {Branch} from 'app/shared/models/branch.model';
import {CreateCustomer} from 'app/shared/models/customer.model';
import {CircleService} from 'app/shared/services/circle.service';
import {CustomerService} from 'app/shared/services/customer.service';
import { EncryptDecryptService } from 'app/shared/services/encrypt_decrypt.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {Zone} from '../../../modules/user-management/users/utils/zone.model'


@Component({
    selector: 'kt-customer-list',
    templateUrl: './cust-list.component.html'
})
export class CustLoanlistComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @Input() isDialog: any = false;


    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;
    displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CustomerType', 'CurrentAddress', 'CustomerStatus', 'View']

    gridHeight: string;
    customerSearch: FormGroup;
    myDate = new Date().toLocaleDateString();


    public maskEnums = MaskEnum;
    errors = errorMessages;
    public LovCall = new Lov();
    public CustomerStatusLov: any;
    _customer: CreateCustomer = new CreateCustomer();
    public Zone = new Zone();
    public Branch = new Branch();
    Zones: any = [];
    SelectedZones: any = [];
    Branches: any = [];
    SelectedBranches: any = [];
    isUserAdmin: boolean = false;
    isZoneUser: boolean = false;
    loggedInUserDetails: any;

    total_customers_length = 0;


    zone: any;
    branch: any;
    itemsPerPage = 5;
    currentActivity: Activity;
    private OffSet: number = 0;
    private pageIndex: any = 0;

    constructor(
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        public snackBar: MatSnackBar,
        private filterFB: FormBuilder,
        private router: Router,
        private _customerService: CustomerService,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private _circleService: CircleService,
        private _cdf: ChangeDetectorRef,
        private userUtilsService: UserUtilsService,
        private spinner: NgxSpinnerService,
        private enc: EncryptDecryptService,
        public dialogRef: MatDialogRef<CustLoanlistComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.currentActivity = this.userUtilsService.getActivity('Search Customer');
        if (this.isDialog || this.data.flag == 1) {

            this.displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CustomerType', 'CurrentAddress', 'CustomerStatus']
        }

        this.LoadLovs();
        this.createForm();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }


    createForm() {
        var userInfo = this.userUtilsService.getUserDetails();
        this.customerSearch = this.filterFB.group({
            Zone: [userInfo.Zone?.ZoneName],
            Branch: [userInfo.Branch?.Name],
            CustomerName: [this._customer.CustomerName],
            Cnic: [this._customer.Cnic],
            FatherName: [this._customer.FatherName],
            CustomerStatus: [this._customer.CustomerStatus]
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.customerSearch.controls[controlName].hasError(errorName);
    }


    searchCustomer(is_first = false) {
        if (!this.zone) {
            this.layoutUtilsService.alertElement("", "Please Select Zone");
            return;
        }
        if (is_first == true)
            this.OffSet = 0;
        this._customer.clear();
        this._customer = Object.assign(this._customer, this.customerSearch.value);
        const controlsCust = this.customerSearch.controls;
        if (this._customer.CustomerStatus == "All")
            this._customer.CustomerStatus = "";
        this._customerService.searchCustomer(this._customer, this.branch, this.zone, this.OffSet, this.itemsPerPage)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.dataSource.data = baseResponse.Customers;
                    this.total_customers_length = baseResponse.Customers.length;
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    this.dataSource.data = []
                }

            });
    }


    getStatus(status: string) {

        if (status == 'P') {
            return "Submit";
        } else if (status == 'N') {
            return "Pending";
        } else if (status == 'A') {
            return "Authorized";
        } else if (status == 'R') {
            return "Refer Back";
        }
    }


    exportToExcel() {
        //this.exportActivities = [];
        //Object.assign(this.tempExportActivities, this.dataSource.data);
        //this.tempExportActivities.forEach((o, i) => {
        //  this.exportActivities.push({
        //    activityName: o.activityName,
        //    activityURL: o.activityURL,
        //    parentActivityName: o.parentActivityName
        //  });
        //});
        //this.excelService.exportAsExcelFile(this.exportActivities, 'activities');
    }

    filterConfiguration(): any {
        const filter: any = {};
        const searchText: string = this.searchInput.nativeElement.value;
        filter.title = searchText;
        return filter;
    }


    ngOnDestroy() {
    }

    masterToggle() {

    }

    editCustomer(Customer: any) {
        localStorage.setItem('SearchCustomerStatus',this.enc.encryptStorageData( JSON.stringify(Customer)));
        localStorage.setItem('CreateCustomerBit',this.enc.encryptStorageData( '2'));
        this.router.navigate(['/customer/customerProfile'], {relativeTo: this.activatedRoute});
    }

    async LoadLovs() {
        this.CustomerStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.CustomerStatus})
        this.CustomerStatusLov.LOVs.forEach(function (value) {
            if (!value.Value)
                value.Value = "All";
        });
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        if (Number.isNaN(pageIndex)) {
            this.pageIndex = this.pageIndex + 1;
        } else {
            this.pageIndex = pageIndex;
        }
        this.itemsPerPage = pageSize;
        this.OffSet = (this.pageIndex - 1) * this.itemsPerPage;
        if (this.OffSet < 0) {
            this.OffSet = 0;
        }
        this.searchCustomer();
    }

    MathCeil(value: any) {
        return Math.ceil(value);
    }
}
