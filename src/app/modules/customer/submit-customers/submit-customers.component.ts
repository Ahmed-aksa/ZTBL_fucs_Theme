
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { errorMessages, Lov, LovConfigurationKey, MaskEnum, regExps } from 'app/shared/classes/lov.class';
import { CreateCustomer } from 'app/shared/models/customer.model';
import { CustomerService } from 'app/shared/services/customer.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LovService } from 'app/shared/services/lov.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'kt-submit-customers',
  templateUrl: './submit-customers.component.html',
  styleUrls: ['./submit-customers.component.scss']
})
export class SubmitCustomersComponent implements OnInit {

  dataSource = new MatTableDataSource();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;


  //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob', 'CustomerStatus', 'View'];
  displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob', 'CustomerStatus', 'View'];

  gridHeight: string;
  customerSearch: FormGroup;
  myDate = new Date().toLocaleDateString();


  public maskEnums = MaskEnum;
  errors = errorMessages;
  public LovCall = new Lov();
  public CustomerStatusLov: any;
  _customer: CreateCustomer = new CreateCustomer();

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    private filterFB: FormBuilder,
    private router: Router,
    private _customerService: CustomerService,
    private _lovService: LovService,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.LoadLovs();
    this.createForm();
    this.searchCustomer();
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
      CustomerStatus: [this._customer.CustomerStatus, [Validators.required]]
    });
  }



  hasError(controlName: string, errorName: string): boolean {
    return this.customerSearch.controls[controlName].hasError(errorName);
  }

  searchCustomer() {

    this._customer.clear();
    this._customer.CustomerStatus = "P";
    this.spinner.show()
    this._customerService.searchCustomer(this._customer)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.spinner.hide()
        })
      )
      .subscribe(baseResponse => {
        if (baseResponse.Success) {
          this.dataSource.data = baseResponse.Customers;
        }
        else {
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

  editCustomer(Customer: any) {
    localStorage.setItem('SearchCustomerStatus', JSON.stringify(Customer));
    localStorage.setItem('CreateCustomerBit', '2');
    this.router.navigate(['/customer/customerProfile'], { relativeTo: this.activatedRoute });

  }


  getStatus(status: string) {
    if (status == 'P') {
      return "Submit";
    }
  }

  async LoadLovs() {
    this.CustomerStatusLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.CustomerStatus })
  }
}
