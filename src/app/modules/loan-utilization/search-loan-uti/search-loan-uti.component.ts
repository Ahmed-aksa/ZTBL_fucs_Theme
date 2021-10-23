import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { errorMessages, Lov, LovConfigurationKey, MaskEnum } from 'app/shared/classes/lov.class';
import { Branch } from 'app/shared/models/branch.model';
import { CreateCustomer } from 'app/shared/models/customer.model';
import { LoanUtilizationSearch } from 'app/modules/loan-utilization/Model/loan-utilization.model';
import { CircleService } from 'app/shared/services/circle.service';
import { CommonService } from 'app/shared/services/common.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LovService } from 'app/shared/services/lov.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Zone } from '../../user-management/users/utils/zone.model'
import {AppState} from "../../../shared/reducers";
import {Store} from "@ngrx/store";
import {LoanUtilizationService} from "../service/loan-utilization.service";
@Component({
  selector: 'app-search-loan-uti',
  templateUrl: './search-loan-uti.component.html',
  styleUrls: ['./search-loan-uti.component.scss'],
  providers: [LoanUtilizationService, DatePipe]
})
export class SearchLoanUtilizationComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @Input() isDialog: any = false;
    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    loading: boolean;


    //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob', 'CustomerStatus', 'View'];
    //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob','CustomerStatus', 'View'];

    displayedColumns = [

        "BranchName",
        "BranchCode",
        "LoanCaseNo",
        "OutStandingPrinciple",
        "DisbursedAmount",
        "prodDevFlag",
        "Balance",
        "DisbDate",
        "StatusName",
        "add"]


    gridHeight: string;
    loanutilizationSearch: FormGroup;
    myDate = new Date().toLocaleDateString();


    public maskEnums = MaskEnum;
    errors = errorMessages;
    public LovCall = new Lov();
    public CustomerStatusLov: any;
    _customer: CreateCustomer = new CreateCustomer();
    _loanUtilizationSearch = new LoanUtilizationSearch;
    public Zone = new Zone();
    public Branch = new Branch();
    Zones: any = [];
    SelectedZones: any = [];
    Branches: any = [];
    SelectedBranches: any = [];
    isUserAdmin: boolean = false;
    isZoneUser: boolean = false;
    loggedInUserDetails: any;
    loanutilizationStatusLov;
    matTableLenght: any;
    dv: number | any; //use later

    maxDate: any;

    Limit:any;
    OffSet: number = 0;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;

    constructor(private store: Store<AppState>,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                public snackBar: MatSnackBar,
                private filterFB: FormBuilder,
                private router: Router,
                private _loanutilizationService: LoanUtilizationService,
                private _lovService: LovService,
                private spinner: NgxSpinnerService,
                private layoutUtilsService: LayoutUtilsService,
                private _circleService: CircleService,
                private _cdf: ChangeDetectorRef,
                private userUtilsService: UserUtilsService,
                private _common: CommonService  ) { }

    ngOnInit() {

        if (this.isDialog)
            this.displayedColumns = [

                "BranchName",
                "BranchCode",
                "LoanCaseNo",
                "OutStandingPrinciple",
                "DisbursedAmount",
                "prodDevFlag",
                "Balance",
                "DisbDate",
                "StatusName",
                "add"]
        //else
        //  this.displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CurrentAddress', 'CustomerStatus', 'View']


        this.LoadLovs();
        this.createForm();

        var userDetails = this.userUtilsService.getUserDetails();
        this.loggedInUserDetails = userDetails;
        debugger;
        //if (userDetails.Branch.BranchCode == "All")
        if (userDetails.User.AccessToData == "1") {
            //admin user
            this.isUserAdmin = true;
            this.GetZones();
        }
        else if (userDetails.User.AccessToData == "2") {
            //zone user
            this.isZoneUser = true;

            this.loanutilizationSearch.value.ZoneId = userDetails.Zone.ZoneId;
            this.Zone = userDetails.Zone;
            this.GetBranches(userDetails.Zone.ZoneId);
        }
        else {
            //branch
            this.Zone = userDetails.Zone;
            this.Branch = userDetails.Branch;
        }

        this.searchloanutilization();
        debugger;
        //this.FilterForm.controls["StartDate"].setValue(this.myDate);
        //this.FilterForm.controls["EndDate"].setValue(this.myDate);
    }

    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 400 + 'px';
        debugger;
        //var userInfo = this.userUtilsService.getUserDetails();
        //this.loanutilizationSearch.controls['Zone'].setValue(userInfo.Zone.ZoneName);
        //this.loanutilizationSearch.controls['Branch'].setValue(userInfo.Branch.Name);
    }
    searchLoan;
    show(){
        this.searchLoan = Object.assign(this.loanutilizationSearch);
    }



    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    createForm() {
        var userInfo = this.userUtilsService.getUserDetails();
        this.loanutilizationSearch = this.filterFB.group({
            ZoneId: [userInfo.Zone.ZoneId],
            Zone: [userInfo.Zone.ZoneName],
            BranchId: [userInfo.Branch.BranchId],
            Branch: [userInfo.Branch.Name],
            LoanCaseNo:[""],
            ToDate: [""],
            FromDate: [""],
        });

    }

    GetZones() {
        debugger;
        this.loading = true;
        this._circleService.getZones()
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {
            debugger;
            if (baseResponse.Success) {

                baseResponse.Zones.forEach(function (value) {
                    value.ZoneName = value.ZoneName.split("-")[1];
                })
                this.Zones = baseResponse.Zones;
                this.SelectedZones = baseResponse.Zones;

                //this.landSearch.controls['ZoneId'].setValue(this.Zones[0].ZoneId);
                //this.GetBranches(this.Zones[0].ZoneId);
                this.loading = false;
                this._cdf.detectChanges();
            }
            else
                this.layoutUtilsService.alertElement("", baseResponse.Message);

        });

    }

    SetBranches(branchId) {
        debugger;
        this.Branch.BranchCode = branchId.value;

    }


    GetBranches(ZoneId) {
        this.loading = true;
        this.dataSource.data = [];
        this.Branches = [];
        debugger;
        if (ZoneId.value === undefined)
            this.Zone.ZoneId = ZoneId;
        else
            this.Zone.ZoneId = ZoneId.value;
        this._circleService.getBranchesByZone(this.Zone)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {
            debugger;
            if (baseResponse.Success) {
                this.loading = false;

                //baseResponse.Branches.forEach(function (value) {
                //  value.Name = value.Name.split("-")[1];
                //})

                this.Branches = baseResponse.Branches;
                this.SelectedBranches = baseResponse.Branches;
                //this.landSearch.controls['BranchId'].setValue(this.Branches[0].BranchId);
                this._cdf.detectChanges();
            }

            else
                this.layoutUtilsService.alertElement("", baseResponse.Message);

        });
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        debugger
        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex -1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.searchloanutilization()
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }

    // paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
    //   debugger
    //   this.itemsPerPage = pageSize;
    //   this.pageIndex = pageIndex;
    //   this.OffSet = pageIndex;
    //
    //   this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
    // }

    paginateAs(pageIndex : any, pageSize: any = this.itemsPerPage){

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
        return this.loanutilizationSearch.controls[controlName].hasError(errorName);
    }
    minDate:Date;
    fromdate:string;
    setFromDate() {
        debugger

        this.minDate = this.loanutilizationSearch.controls.FromDate.value;
        var FromDate = this.loanutilizationSearch.controls.FromDate.value;
        if (FromDate._isAMomentObject == undefined) {
            try {
                var day = this.loanutilizationSearch.controls.FromDate.value.getDate();
                var month = this.loanutilizationSearch.controls.FromDate.value.getMonth() + 1;
                var year = this.loanutilizationSearch.controls.FromDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.fromdate = branchWorkingDate.toString();
                this.loanutilizationSearch.controls.FromDate.setValue(branchWorkingDate)
            } catch (e) {
            }
        }
        else {
            try {
                var day = this.loanutilizationSearch.controls.FromDate.value.toDate().getDate();
                var month = this.loanutilizationSearch.controls.FromDate.value.toDate().getMonth() + 1;
                var year = this.loanutilizationSearch.controls.FromDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                FromDate = day + "" + month + "" + year;

                this.fromdate = FromDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.loanutilizationSearch.controls.FromDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }
    todate:string;
    setToDate() {

        debugger
        var ToDate = this.loanutilizationSearch.controls.ToDate.value;
        if (ToDate._isAMomentObject == undefined) {
            try {
                var day = this.loanutilizationSearch.controls.ToDate.value.getDate();
                var month = this.loanutilizationSearch.controls.ToDate.value.getMonth() + 1;
                var year = this.loanutilizationSearch.controls.ToDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.loanutilizationSearch.controls.ToDate.setValue(branchWorkingDate)
            } catch (e) {
            }
        }
        else {
            try {
                var day = this.loanutilizationSearch.controls.ToDate.value.toDate().getDate();
                var month = this.loanutilizationSearch.controls.ToDate.value.toDate().getMonth() + 1;
                var year = this.loanutilizationSearch.controls.ToDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                ToDate = day + "" + month + "" + year;
                this.todate = ToDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.loanutilizationSearch.controls.ToDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }
    Today= new Date;
    getToday() {
        // Today

        if(this.loanutilizationSearch.controls.ToDate.value){
            this.Today=this.loanutilizationSearch.controls.ToDate.value
            return this.Today;
        }else{

            this.Today = new Date();
            // console.log(this.Today);
            // console.log(this.Today.toISOString().split('T')[0]);
            return this.Today;
        }
    }
    getTodayForTo(){
        return new Date().toISOString().split('T')[0]
    }




    searchloanutilization() {
        debugger;
        // this.OffSet = 0;
        // this.pageIndex = 0;
        // this.dataSource.data = [];

        this.spinner.show()
        if(this.loanutilizationSearch.controls.LoanCaseNo.value !="" ){
            this.OffSet = 0;
        }
        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();

        // this._customer.clear();
        this._loanUtilizationSearch = Object.assign(this._loanUtilizationSearch, this.loanutilizationSearch.value);
        console.log(this._loanUtilizationSearch)
        var userInfo = this.userUtilsService.getUserDetails();
        if (this.isUserAdmin || this.isZoneUser) {
            userInfo.Branch = {};
            if (this.Branch.BranchCode != undefined)
                userInfo.Branch.BranchId = this.Branch.BranchCode;
            else
                userInfo.Branch.BranchId = 0;
        }
        if (this.isUserAdmin) {
            userInfo.Zone = {};
            if (this.Zone.ZoneId != undefined)
                userInfo.Zone.ZoneId = this.Zone.ZoneId
            else
                userInfo.Zone.ZoneId = 0;
        }

        this._loanutilizationService.searchLoanUtilization(this._loanUtilizationSearch["LoanCaseNo"],userInfo,this.fromdate,this.todate,count,currentIndex)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                debugger;
                if (baseResponse.Success) {
                    console.log("baseResponse"+baseResponse)
                    this.dataSource.data = baseResponse.LoanUtilization.LoanDetails;
                    if (this.dataSource.data.length > 0)
                        this.matTableLenght = true;
                    else
                        this.matTableLenght = false;

                    this.dv = this.dataSource.data;
                    this.totalItems = baseResponse.LoanUtilization.LoanDetails[0].TotalRecords;
                    this.dataSource.data = this.dv.slice(0, this.totalItems)
                    //this.dataSource = new MatTableDataSource(data);
                    debugger;
                    // this.totalItems = baseResponse.JournalVoucher.JournalVoucherDataList.length;
                    //this.paginate(this.pageIndex) //calling paginate function
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                }
                else {

                    if(this.dv != undefined){
                        this.matTableLenght = false;
                        this.dataSource = this.dv.slice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
                        // this.dataSource.data = [];
                        // this._cdf.detectChanges();
                        this.OffSet = 1;
                        this.pageIndex = 1;
                        this.dv = this.dv.slice(1,0);
                        this.layoutUtilsService.alertElement("", baseResponse.Message);
                    }
                }
            });
    }


    getStatus(status:string) {

        if (status == 'P') {
            return "Submit";
        }
        else if (status == 'N') {
            return "Pending";
        }
        else if (status == 'A') {
            return "Authorized";
        }
        else if (status == 'R') {
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
    }

    masterToggle() {

    }

    editCustomer(Customer: any) {
        debugger;
        localStorage.setItem('SearchCustomerStatus', JSON.stringify(Customer));
        localStorage.setItem('CreateCustomerBit', '2');
        // this.router.navigate(['../customer/customerProfile', { id: id }], { relativeTo: this.activatedRoute });
        this.router.navigate(['/customer/customerProfile'], { relativeTo: this.activatedRoute });
    }


    addloanutilization(utilization: any){
        var v =JSON.stringify(utilization)
        console.log("sam"+v)
        utilization.Status = "Add";
        this.router.navigate(['../loan-uti'], {
            state: { example: utilization},
            relativeTo: this.activatedRoute
        });
    }

    async LoadLovs() {

        //this.ngxService.start();

        this.CustomerStatusLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.CustomerStatus })
        // console.log(this.CustomerStatusLov.LOVs);
        this.CustomerStatusLov.LOVs.forEach(function (value) {
            if (!value.Value)
                value.Value = "All";
        });
        debugger;
        ////For Bill type
        // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })

        // this.ngxService.stop();

    }

}
