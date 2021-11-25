import {Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {errorMessages, Lov, LovConfigurationKey, MaskEnum, regExps} from 'app/shared/classes/lov.class';
import {CreateCustomer} from 'app/shared/models/customer.model';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomerService} from 'app/shared/services/customer.service';
import {LovService} from 'app/shared/services/lov.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';

//src/app/core/_base/crud/utils/user-utils.service

@Component({
    selector: 'kt-pending-customers',
    templateUrl: './pending-customers.component.html',
    styleUrls: ['./pending-customers.component.scss']
})
export class PendingCustomersComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;
    loggedInUserDetails: any;


    //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob', 'CustomerStatus', 'View'];
    displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CurrentAddress', 'CustomerStatus', 'View'];

    gridHeight: string;
    customerSearch: FormGroup;
    myDate = new Date().toLocaleDateString();


    zone: any;
    branch: any;

    public maskEnums = MaskEnum;
    errors = errorMessages;
    public LovCall = new Lov();
    public CustomerStatusLov: any;
    _customer: CreateCustomer = new CreateCustomer();
    pending_customer_form: FormGroup;

    constructor(
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        public snackBar: MatSnackBar,
        private filterFB: FormBuilder,
        private router: Router,
        private _customerService: CustomerService,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private userUtilsService: UserUtilsService,
        private spinner: NgxSpinnerService) {
    }

    ngOnInit() {

        this.LoadLovs();

        this.createForm();


        setTimeout(() => {
            if (this.zone) {
                this.searchCustomer();
            }
        }, 1000);
        var userDetails = this.userUtilsService.getUserDetails();
        this.loggedInUserDetails = userDetails;
    }

    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 400 + 'px';
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }


    createForm() {
        this.customerSearch = this.filterFB.group({
            CustomerName: [this._customer.CustomerName, [Validators.required]],
            Cnic: [this._customer.Cnic, [Validators.required, Validators.pattern(regExps.cnic)]],
            FatherName: [this._customer.FatherName, [Validators.required]],
            CustomerStatus: ['P', [Validators.required]]
        });
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.customerSearch.controls[controlName].hasError(errorName);
    }

    searchCustomer() {
        this.spinner.show();
        this._customerService.searchCustomer(this.customerSearch.value, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    
                    this.dataSource.data = baseResponse.Customers;
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    this.dataSource.data = []
                }

            });
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

    CheckEditStatus(customer: any) {
        if (customer.CreatedBy == this.loggedInUserDetails.User.UserId) {
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

    CheckViewStatus(customer: any) {
        if (customer.CreatedBy != this.loggedInUserDetails.User.UserId) {
            return true
        } else {
            return false
        }

    }

    editCustomer(Customer: any) {
        localStorage.setItem('SearchCustomerStatus', JSON.stringify(Customer));
        localStorage.setItem('CreateCustomerBit', '2');
        this.router.navigate(['/customer/customerProfile'], {relativeTo: this.activatedRoute});

    }

    viewCustomer(Customer: any) {
        localStorage.setItem('SearchCustomerStatus', JSON.stringify(Customer));
        localStorage.setItem('CreateCustomerBit', '2');
        this.router.navigate(['/customer/customerProfile'], {relativeTo: this.activatedRoute});

    }

    getStatus(status: string) {

        if (status == 'N') {
            return "Pending";
        }

    }


    async LoadLovs() {
        this.CustomerStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.CustomerStatus})
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch
    }
}
