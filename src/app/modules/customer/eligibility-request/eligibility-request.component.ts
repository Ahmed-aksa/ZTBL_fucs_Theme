import {DatePipe} from '@angular/common';
import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {DateFormats, errorMessages, Lov, LovConfigurationKey, MaskEnum} from 'app/shared/classes/lov.class';
import {CreateCustomer} from 'app/shared/models/customer.model';
import {LoanUtilizationSearch} from 'app/modules/loan-utilization/Model/loan-utilization.model';
import {CircleService} from 'app/shared/services/circle.service';
import {CommonService} from 'app/shared/services/common.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {AppState} from "../../../shared/reducers";
import {Store} from "@ngrx/store";
import {Circle} from 'app/shared/models/circle.model';
import {Branch} from 'app/shared/models/branch.model';
import {Zone} from 'app/shared/models/zone.model';
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {CustomerService} from "../../../shared/services/customer.service";

@Component({
    selector: 'app-eligibility-request',
    templateUrl: './eligibility-request.component.html',
    styleUrls: ['./eligibility-request.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class EligibilityRequestComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @Input() isDialog: any = false;
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;


    Statuses: any;
    //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob', 'CustomerStatus', 'View'];
    //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob','CustomerStatus', 'View'];
    displayedColumns = [
        "ZoneName",
        "BranchName",
        "CircleCode",
        "CustomerName",
        "Cnic",
        "FatherName",
        "Status",
        "Actions"
    ];


    gridHeight: string;
    eligibilityRequestForm: FormGroup;
    myDate = new Date().toLocaleDateString();
    public maskEnums = MaskEnum;
    errors = errorMessages;
    public LovCall = new Lov();
    public CustomerStatusLov: any;
    _customer: CreateCustomer = new CreateCustomer();
    private eligibilityRequestSearch = new LoanUtilizationSearch;
    isUserAdmin: boolean = false;
    isZoneUser: boolean = false;
    loggedInUserDetails: any;
    loanutilizationStatusLov;
    matTableLenght: any;
    dv: number | any; //use later

    maxDate: any;

    Limit: any;
    OffSet: number = 0;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    LoggedInUserInfo: BaseResponseModel;
    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    private Zone = new Zone();

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    private Branch = new Branch();
    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;
    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];
    public Circle = new Circle();
    selected_b;
    selected_z;
    selected_c;

    //final
    final_branch: any;
    final_zone: any;
    final_circle: any;

    constructor(private store: Store<AppState>,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                public snackBar: MatSnackBar,
                private filterFB: FormBuilder,
                private router: Router,
                private customerService: CustomerService,
                private _lovService: LovService,
                private spinner: NgxSpinnerService,
                private layoutUtilsService: LayoutUtilsService,
                private _circleService: CircleService,
                private _cdf: ChangeDetectorRef,
                private userUtilsService: UserUtilsService,
                private _common: CommonService,
                public datePipe: DatePipe) {
    }

    ngOnInit() {
        this.LoadLovs();
        this.createForm();
        this.settingZBC()


        //this.FilterForm.controls["StartDate"].setValue(this.myDate);
        //this.FilterForm.controls["EndDate"].setValue(this.myDate);

    }

    userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();

    settingZBC() {

        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if (this.LoggedInUserInfo.Branch && this.LoggedInUserInfo.Branch.BranchCode != "All") {
            this.SelectedCircles = this.LoggedInUserInfo.UserCircleMappings;
            this.SelectedBranches = this.LoggedInUserInfo.Branch;
            this.SelectedZones = this.LoggedInUserInfo.Zone;

            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.eligibilityRequestForm.controls["Zone"].setValue(this.SelectedZones?.Id);
            this.eligibilityRequestForm.controls["Branch"].setValue(this.SelectedBranches?.BranchCode);
            if (this.SelectedCircles.length == 0) {
                this.changeBranch(this.selected_b);
            }
            this.eligibilityRequestForm.controls["Circle"].setValue(this.SelectedCircles?.Id);
        } else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.UserCircleMappings) {
            this.spinner.show();
            this.userUtilsService.getZone().subscribe((data: any) => {
                this.Zone = data?.Zones;
                this.SelectedZones = this?.Zone;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();
            });
        }
    }


    private assignBranchAndZone() {

        //Circle
        if (this.SelectedCircles.length) {
            this.final_circle = this.SelectedCircles?.filter((circ) => circ.Id == this.selected_c)[0]
            this.userInfo.Circles = this.final_circle;
        } else {
            this.final_circle = this.SelectedCircles;
            this.userInfo.Circles = this.final_circle;
        }
        //Branch
        if (this.SelectedBranches.length) {
            this.final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0];
            this.userInfo.Branch = this.final_branch;
        } else {
            this.final_branch = this.SelectedBranches;
            this.userInfo.Branch = this.final_branch;
        }
        //Zone
        if (this.SelectedZones.length) {
            this.final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
            this.userInfo.Zone = this.final_zone;
        } else {
            this.final_zone = this.SelectedZones;
            this.userInfo.Zone = this.final_zone;
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


    changeBranch(changedValue) {

        let changedBranch = null;
        if (changedValue.value)
            changedBranch = {Branch: {BranchCode: changedValue.value}}
        else
            changedBranch = {Branch: {BranchCode: changedValue}}

        this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {
            this.Circles = data.Circles;
            this.SelectedCircles = this.Circles;
            // this.selected_c = this.SelectedCircles?.Id
            this.disable_circle = false;
            if (changedValue.value) {
                // this.getBorrower();
            }
        });
    }

    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 400 + 'px';

        //var userInfo = this.userUtilsService.getUserDetails();
        //this.eligibilityRequestForm.controls['Zone'].setValue(userInfo.Zone.ZoneName);
        //this.eligibilityRequestForm.controls['Branch'].setValue(userInfo.Branch.Name);
    }

    searchLoan;

    show() {
        this.searchLoan = Object.assign(this.eligibilityRequestForm);
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    createForm() {
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.eligibilityRequestForm = this.filterFB.group({
            Circle: [userInfo?.UserCircleMappings?.Id],
            Zone: [userInfo?.Zone?.ZoneName],
            Branch: [userInfo?.Branch?.Name],
            Cnic: [null],
            CustomerName: [null],
            status: [null]
        });

    }

    SetBranches(branchId) {

        this.Branch.BranchCode = branchId.value;

    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {

        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.getEligibilityRequestData()
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }


    paginateAs(pageIndex: any, pageSize: any = this.itemsPerPage) {

    }


    searchBranch(branchId) {
        branchId = branchId.toLowerCase();
        if (branchId != null && branchId != undefined && branchId != "")
            this.SelectedBranches = this.Branches.filter(x => x.Name.toLowerCase().indexOf(branchId) > -1);
        else
            this.SelectedBranches = this.Branches;
    }

    validateBranchOnFocusOut() {
        if (this.SelectedBranches.length == 0)
            this.SelectedBranches = this.Branches;
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.eligibilityRequestForm.controls[controlName].hasError(errorName);
    }

    minDate: Date;
    fromdate: string;

    setFromDate() {

        // this.eligibilityRequestForm.controls.FromDate.value this.datePipe.transform(this.eligibilityRequestForm.controls.FromDate.value, 'ddMMyyyy')
        this.minDate = this.eligibilityRequestForm.controls.FromDate.value;
        var FromDate = this.eligibilityRequestForm.controls.FromDate.value;
        if (FromDate._isAMomentObject == undefined) {
            try {
                var day = this.eligibilityRequestForm.controls.FromDate.value.getDate();
                var month = this.eligibilityRequestForm.controls.FromDate.value.getMonth() + 1;
                var year = this.eligibilityRequestForm.controls.FromDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                FromDate = day + "" + month + "" + year;
                this.fromdate = FromDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                // console.log("date"+this.datePipe.transform(branchWorkingDate, 'ddmmyyyy'))
                // let newdate = this.datePipe.transform(branchWorkingDate, 'ddmmyyyy')
                //  console.log(this._common.stringToDate(newdate))
                this.eligibilityRequestForm.controls.FromDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        } else {
            try {
                var day = this.eligibilityRequestForm.controls.FromDate.value.toDate().getDate();
                var month = this.eligibilityRequestForm.controls.FromDate.value.toDate().getMonth() + 1;
                var year = this.eligibilityRequestForm.controls.FromDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                FromDate = day + "" + month + "" + year;

                this.fromdate = FromDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.eligibilityRequestForm.controls.FromDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }

    todate: string;

    setToDate() {


        var ToDate = this.eligibilityRequestForm.controls.ToDate.value;
        if (ToDate._isAMomentObject == undefined) {
            try {
                var day = this.eligibilityRequestForm.controls.ToDate.value.getDate();
                var month = this.eligibilityRequestForm.controls.ToDate.value.getMonth() + 1;
                var year = this.eligibilityRequestForm.controls.ToDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.eligibilityRequestForm.controls.ToDate.setValue(branchWorkingDate)
            } catch (e) {
            }
        } else {
            try {
                var day = this.eligibilityRequestForm.controls.ToDate.value.toDate().getDate();
                var month = this.eligibilityRequestForm.controls.ToDate.value.toDate().getMonth() + 1;
                var year = this.eligibilityRequestForm.controls.ToDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                ToDate = day + "" + month + "" + year;
                this.todate = ToDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.eligibilityRequestForm.controls.ToDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }

    Today = new Date;

    getToday() {
        // Today

        if (this.eligibilityRequestForm.controls.ToDate.value) {
            this.Today = this.eligibilityRequestForm.controls.ToDate.value
            return this.Today;
        } else {

            this.Today = new Date();
            return this.Today;
        }
    }

    getTodayForTo() {
        return new Date().toISOString().split('T')[0]
    }


    getEligibilityRequestData() {
        this.assignBranchAndZone();
        if (!this.final_zone) {
            var Message = 'Please select Zone';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        if (!this.final_branch) {
            var Message = 'Please select Branch';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }
        this.spinner.show()
        var request = {
            Branch: this.final_branch,
            Zone: this.final_zone,
            Circle: {
                Circle: this.final_circle.Id,
            },
            EligibilityRequest: this.eligibilityRequestForm.value,
            User: this.userInfo,
            Pagination: {
                Limit: this.itemsPerPage.toString(),
                Offset: this.OffSet.toString()
            }
        };
        this.eligibilityRequestSearch = Object.assign(this.eligibilityRequestSearch, this.eligibilityRequestForm.value);
        this.customerService.getEligibilityRequestData(request)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {

                if (baseResponse.Success) {
                    this.dataSource.data = baseResponse.EligibilityRequest.EligibilityRequests;
                    if (this.dataSource.data.length > 0)
                        this.matTableLenght = true;
                    else
                        this.matTableLenght = false;

                    this.dv = this.dataSource.data;
                    this.totalItems = baseResponse.EligibilityRequest.EligibilityRequests[0].TotalRecords;
                    this.dataSource.data = this.dv.slice(0, this.totalItems)
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                } else {

                    if (this.dv != undefined) {
                        this.matTableLenght = false;
                        this.dataSource = this.dv.slice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
                        // this.dataSource.data = [];
                        // this._cdf.detectChanges();
                        this.OffSet = 1;
                        this.pageIndex = 1;
                        this.dv = this.dv.slice(1, 0);
                        this.layoutUtilsService.alertElement("", baseResponse.Message);
                    }
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

    filterConfiguration(): any {
        const filter: any = {};
        const searchText: string = this.searchInput.nativeElement.value;
        filter.title = searchText;
        return filter;
    }


    ngOnDestroy() {
        console.log("ondestroy")
        this.eligibilityRequestForm.reset()
    }

    masterToggle() {

    }

    editCustomer(Customer: any) {

        localStorage.setItem('SearchCustomerStatus', JSON.stringify(Customer));
        localStorage.setItem('CreateCustomerBit', '2');
        // this.router.navigate(['../customer/customerProfile', { id: id }], { relativeTo: this.activatedRoute });
        this.router.navigate(['/customer/customerProfile'], {relativeTo: this.activatedRoute});
    }


    addloanutilization(utilization: any) {
        utilization.Status = "Add";
        this.router.navigate(['../loan-uti'], {
            state: {example: utilization},
            relativeTo: this.activatedRoute
        });
    }

    async LoadLovs() {

        this.Statuses = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.EligibilityStatus});
        this.Statuses = this.Statuses.LOVs;
        // this.CustomerStatusLov.LOVs.forEach(function (value) {
        //     if (!value.Value)
        //         value.Value = "All";
        // });
    }

}
