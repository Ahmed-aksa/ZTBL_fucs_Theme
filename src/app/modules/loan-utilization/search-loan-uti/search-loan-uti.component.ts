import {DatePipe} from '@angular/common';
import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {errorMessages, Lov, LovConfigurationKey, MaskEnum} from 'app/shared/classes/lov.class';
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
import {LoanUtilizationService} from "../service/loan-utilization.service";
import {Circle} from 'app/shared/models/circle.model';
import {Branch} from 'app/shared/models/branch.model';
import {Zone} from 'app/shared/models/zone.model';
import {BaseResponseModel} from "../../../shared/models/base_response.model";

@Component({
    selector: 'app-search-loan-uti',
    templateUrl: './search-loan-uti.component.html',
    styleUrls: ['./search-loan-uti.component.scss'],
    providers: [LoanUtilizationService, DatePipe]
})
export class SearchLoanUtilizationComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @Input() isDialog: any = false;
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;





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
    isUserAdmin: boolean = false;
    isZoneUser: boolean = false;
    loggedInUserDetails: any;
    loanutilizationStatusLov;
    matTableLenght: any;
    dv: number | any;

    maxDate: any;

    Limit: any;
    OffSet: number = 0;

    itemsPerPage = 10;
    totalItems: number | any;
    pageIndex = 1;
    LoggedInUserInfo: BaseResponseModel;

    Zones: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();


    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();
    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;

    Circles: any = [];
    SelectedCircles: any = [];
    public Circle = new Circle();
    selected_b;
    selected_z;
    selected_c;


    final_branch: any;
    final_zone: any;
    final_cricle: any;

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
                private _common: CommonService) {
    }

    ngOnInit() {
        this.SelectedBranches = null;
        this.SelectedZones = null;
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
        this.LoadLovs();
        this.createForm();
        this.settingZBC()
    }

    userInfo = this.userUtilsService.getUserDetails();

    settingZBC() {

        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if (this.LoggedInUserInfo.Branch && this.LoggedInUserInfo.Branch.BranchCode != "All") {
            this.SelectedCircles = this.LoggedInUserInfo.UserCircleMappings;

            this.SelectedBranches = this.LoggedInUserInfo.Branch;
            this.SelectedZones = this.LoggedInUserInfo.Zone;

            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.loanutilizationSearch.controls["Zone"].setValue(this.SelectedZones?.Id);
            this.loanutilizationSearch.controls["Branch"].setValue(this.SelectedBranches?.BranchCode);
            this.loanutilizationSearch.controls["Circle"].setValue(this.SelectedCircles?.Id);
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


        if (this.SelectedCircles.length) {
            this.final_cricle = this.SelectedCircles?.filter((circ) => circ.Id == this.selected_c)[0]
            this.userInfo.Circles = this.final_cricle;
        } else {
            this.final_cricle = this.SelectedCircles;
            this.userInfo.Circles = this.final_cricle;
        }

        if (this.SelectedBranches.length) {
            this.final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0];
            this.userInfo.Branch = this.final_branch;
        } else {
            this.final_branch = this.SelectedBranches;
            this.userInfo.Branch = this.final_branch;
        }

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

            this.disable_circle = false;
            if (changedValue.value) {

            }
        });
    }

    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 400 + 'px';




    }

    searchLoan;

    show() {
        this.searchLoan = Object.assign(this.loanutilizationSearch);
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    createForm() {
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.loanutilizationSearch = this.filterFB.group({
            ZoneId: [userInfo?.Zone?.ZoneId],
            Circle: [userInfo?.UserCircleMappings?.Id],
            Zone: [userInfo?.Zone?.ZoneName],
            BranchId: [userInfo?.Branch?.BranchId],
            Branch: [userInfo?.Branch?.Name],
            LoanCaseNo: [""],
            ToDate: [""],
            FromDate: [""],
        });

    }

    SetBranches(branchId) {

        this.Branch.BranchCode = branchId.value;

    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {

        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.searchloanutilization()
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
        return this.loanutilizationSearch.controls[controlName].hasError(errorName);
    }

    minDate: Date;
    fromdate: string;

    setFromDate() {


        this.minDate = this.loanutilizationSearch.controls.FromDate.value.toDate()
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
        } else {
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

    todate: string;

    setToDate() {


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
        } else {
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

    Today = new Date;

    getToday() {


        if (this.loanutilizationSearch.controls.ToDate.value) {
            this.Today = this.loanutilizationSearch.controls.ToDate.value
            return this.Today;
        } else {

            this.Today = new Date();
            return this.Today;
        }
    }

    getTodayForTo() {
        return new Date().toISOString().split('T')[0]
    }


    searchloanutilization() {
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
        if (this.loanutilizationSearch.controls.LoanCaseNo.value != "") {
            this.OffSet = 0;
        }
        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();


        this._loanUtilizationSearch = Object.assign(this._loanUtilizationSearch, this.loanutilizationSearch.value);


















        this._loanutilizationService.searchLoanUtilization(this._loanUtilizationSearch["LoanCaseNo"], this.userInfo, this.fromdate, this.todate, count, currentIndex, this.SelectedCircles)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {

                if (baseResponse.Success) {
                    this.dataSource.data = baseResponse.LoanUtilization.LoanDetails;
                    if (this.dataSource.data.length > 0)
                        this.matTableLenght = true;
                    else
                        this.matTableLenght = false;

                    this.dv = this.dataSource.data;
                    this.totalItems = baseResponse.LoanUtilization.LoanDetails[0].TotalRecords;
                    this.dataSource.data = this.dv.slice(0, this.totalItems)




                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                } else {

                    if (this.dv != undefined) {
                        this.matTableLenght = false;
                        this.dataSource = this.dv.slice(1, 0);


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
    }

    masterToggle() {

    }

    editCustomer(Customer: any) {

        localStorage.setItem('SearchCustomerStatus', JSON.stringify(Customer));
        localStorage.setItem('CreateCustomerBit', '2');

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
        this.CustomerStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.CustomerStatus})
        this.CustomerStatusLov.LOVs.forEach(function (value) {
            if (!value.Value)
                value.Value = "All";
        });
    }

}
