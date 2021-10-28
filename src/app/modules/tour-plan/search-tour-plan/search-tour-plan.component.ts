import {Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { MatDialog} from '@angular/material/dialog';
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LayoutUtilsService} from "../../../shared/services/layout-utils.service";
import { TourPlan } from '../Model/tour-plan.model';
import {TourPlanService} from "../Service/tour-plan.service";
import {CircleService} from "../../../shared/services/circle.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Lov, LovConfigurationKey} from "../../../shared/classes/lov.class";
import { Branch } from 'app/shared/models/branch.model';
import { Zone } from 'app/shared/models/zone.model';
import {AppState} from "../../../shared/reducers";
import {Store} from "@ngrx/store";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LovService} from "../../../shared/services/lov.service";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import { Circle } from 'app/shared/models/circle.model';

@Component({
    selector: 'search-loan-utilization',
    templateUrl: './search-tour-plan.component.html',
    styleUrls: ['./search-tour-plan.component.scss'],

})

export class SearchTourPlanComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @Input() isDialog: any = false;
    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    loading: boolean;

    displayedColumns = ['VisitedDate', 'Purpose', 'Remarks', 'Status', 'TotalRecords',"Actions"];
    gridHeight: string;
    TourPlan: FormGroup;
    myDate = new Date().toLocaleDateString();
    isMCO: boolean = false;
    isBM: boolean = false;
    circle;
    loggedInUser: any;
    public LovCall = new Lov();
    public CustomerStatusLov: any;
    _TourPlan = new TourPlan;
    isUserAdmin: boolean = false;
    isZoneUser: boolean = false;
    loggedInUserDetails: any;
    TourPlansByDate;
    minDate: Date;
    fromdate: string;
    todate: string;
    Today = new Date;
    tourPlanStatusLov;
    dv: number | any; //use later
    matTableLenght: any;
    TourPlans;

    // Pagination
    Limit:any;
    OffSet: number = 0;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;

    //Start ZBC

    LoggedInUserInfo: BaseResponseModel;
    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();
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
    final_cricle: any;

    //End ZBC


    constructor(private store: Store<AppState>,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                public snackBar: MatSnackBar,
                private filterFB: FormBuilder,
                private router: Router,
                private spinner: NgxSpinnerService,
                private tourPlanService: TourPlanService,
                private _lovService: LovService,
                private layoutUtilsService: LayoutUtilsService,
                private _circleService: CircleService,
                private _cdf: ChangeDetectorRef,
                private userUtilsService: UserUtilsService)
    {
        this.loggedInUser = userUtilsService.getUserDetails();
    }

    ngOnInit() {
        var userDetails = this.userUtilsService.getUserDetails();
        this.loggedInUserDetails = userDetails;
        this.setUsers()
        this.LoadLovs();
        this.createForm();
        this.setCircles();
        this.getTourPlan();

        this.settingZBC();
    }

    //Start ZBC
    userInfo = this.userUtilsService.getUserDetails();

    settingZBC(){

        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if (this.LoggedInUserInfo.Branch && this.LoggedInUserInfo.Branch.BranchCode != "All") {
            this.SelectedCircles = this.LoggedInUserInfo.UserCircleMappings;

            this.SelectedBranches = this.LoggedInUserInfo.Branch;
            this.SelectedZones = this.LoggedInUserInfo.Zone;

            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.TourPlan.controls["Zone"].setValue(this.SelectedZones?.Id);
            this.TourPlan.controls["Branch"].setValue(this.SelectedBranches?.BranchCode);
            this.TourPlan.controls["Circle"].setValue(this.SelectedCircles?.Id);
            // if (this.customerForm.value.Branch) {
            //     this.changeBranch(this.customerForm.value.Branch);
            // }
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
        debugger;
        //Circle
        if (this.SelectedCircles.length) {
            this.final_cricle = this.SelectedCircles?.filter((circ) => circ.Id == this.selected_c)[0]
            this.userInfo.Circles = this.final_cricle;
        } else {
            this.final_cricle = this.SelectedCircles;
            this.userInfo.Circles = this.final_cricle;
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


    changeBranch(changedValue){
        debugger
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

    //End ZBC


    setUsers() {
        var userInfo = this.userUtilsService.getUserDetails();
        this.userInfo = this.userUtilsService.getUserDetails();
        // console.log(userInfo);
        //MCO User
        if (userInfo.User.userGroup[0].ProfileID == "56") {
            this.isMCO = true;
        }

        if (userInfo.User.userGroup[0].ProfileID == "57") {
            this.isBM = true;
        }

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
        //BM User
        // if(userInfo.User.userGroup[0].ProfileID=="56"){
        //   this.isMCO=true;
        // }else{
        //   this.isMCO=false;
        // }

    }
    setCircles() {
        debugger;
        this._circleService.GetCircleByBranchId()
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(baseResponse => {
                debugger;
                console.log(baseResponse);
                if (baseResponse.Success) {
                    this.circle = baseResponse.Circles;
                    debugger
                }
                else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 400 + 'px';
        debugger;
        //var userInfo = this.userUtilsService.getUserDetails();
        //this.TourPlan.controls['Zone'].setValue(userInfo.Zone.ZoneName);
        //this.TourPlan.controls['Branch'].setValue(userInfo.Branch.Name);
    }

    // CheckEditStatus(loanUtilization: any) {
    //   debugger

    //   if () {
    //     return true
    //   }
    //   else {
    //     return false
    //   }
    // }

    setFromDate() {
        debugger
        // this.TourPlan.controls.FromDate.reset();
        this.minDate = this.TourPlan.controls.FromDate.value;
        var FromDate = this.TourPlan.controls.FromDate.value;
        if (FromDate._isAMomentObject == undefined) {
            try {
                var day = this.TourPlan.controls.FromDate.value.getDate();
                var month = this.TourPlan.controls.FromDate.value.getMonth() + 1;
                var year = this.TourPlan.controls.FromDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.fromdate = branchWorkingDate.toString();
                this.TourPlan.controls.FromDate.setValue(branchWorkingDate)
            } catch (e) {
            }
        }
        else {
            try {
                var day = this.TourPlan.controls.FromDate.value.toDate().getDate();
                var month = this.TourPlan.controls.FromDate.value.toDate().getMonth() + 1;
                var year = this.TourPlan.controls.FromDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                FromDate = day + "" + month + "" + year;

                this.fromdate = FromDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.TourPlan.controls.FromDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }
    setToDate() {
        debugger
        var ToDate = this.TourPlan.controls.ToDate.value;
        if (ToDate._isAMomentObject == undefined) {
            try {
                var day = this.TourPlan.controls.ToDate.value.getDate();
                var month = this.TourPlan.controls.ToDate.value.getMonth() + 1;
                var year = this.TourPlan.controls.ToDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.TourPlan.controls.ToDate.setValue(branchWorkingDate)
            } catch (e) {
            }
        }
        else {
            try {
                var day = this.TourPlan.controls.ToDate.value.toDate().getDate();
                var month = this.TourPlan.controls.ToDate.value.toDate().getMonth() + 1;
                var year = this.TourPlan.controls.ToDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                ToDate = day + "" + month + "" + year;
                this.todate = ToDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.TourPlan.controls.ToDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }
    getToday() {
        // Today

        if (this.TourPlan.controls.ToDate.value) {
            this.Today = this.TourPlan.controls.ToDate.value
            return this.Today;
        } else {

            this.Today = new Date();
            // console.log(this.Today);
            // console.log(this.Today.toISOString().split('T')[0]);
            return this.Today;
        }
    }
    getTodayForTo() {
        return new Date().toISOString().split('T')[0]
    }

    CheckEditStatus(TourPlan: any) {
        if (TourPlan.Status == "P" || TourPlan.Status == "R"){
            if(TourPlan.UserId == this.loggedInUserDetails.User.UserId) {
                return true
            }
            else {
                return false
            }
        }
    }


    viewTourPlan(TourPlan: any) {
        // this.router.navigate(['other']);
        console.log(TourPlan);
        TourPlan.view = "1";
        // console.log(this.TourPlan.controls["Status"].value)
        // utilization = {Status:this.TourPlan.controls["Status"].value}
        this.router.navigate(['../create-tour-plan'], {
            state: { example: TourPlan,flag:1 },
            relativeTo: this.activatedRoute
        });
    }

    CheckViewStatus(loanUtilization: any) {
        if (this.isMCO) {
            if (loanUtilization.Status == "C" || loanUtilization.Status == "S" || loanUtilization.Status == "A") {
                if (loanUtilization.CreatedBy == this.loggedInUserDetails.User.UserId) {
                    return true
                }
                else {
                    return false
                }
            } else {
                return false;
            }
        }
        else if (this.isBM) {
            if (loanUtilization.Status == "C" || loanUtilization.Status == "P" || loanUtilization.Status == "R" || loanUtilization.Status == "A") {
                return true
            }
        } else {
            return false
        }
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }


    createForm() {
        var userInfo = this.userUtilsService.getUserDetails();
        this.TourPlan = this.filterFB.group({
            Zone: [userInfo.Zone.ZoneName],
            Branch: [userInfo.Branch.Name],
            FromDate:[],
            ToDate:[],
            Status:["", Validators.required],
            CircleId:[]
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
        this.SearchTourPlan()
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
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
        return this.TourPlan.controls[controlName].hasError(errorName);
    }

    getTourPlan() {


    }

    toggleAccordion(i: number) {
        let down_arrow = document.getElementById('arrow_down_' + i).style.display;
        if (down_arrow == 'block') {
            document.getElementById('arrow_down_' + i).style.display = 'none';
            document.getElementById('arrow_up_' + i).style.display = 'block';
            document.getElementById('table_' + i).style.display = 'block';
        } else {
            document.getElementById('arrow_up_' + i).style.display = 'none';
            document.getElementById('arrow_down_' + i).style.display = 'block';
            document.getElementById('table_' + i).style.display = 'none';

        }
    }
    Plans;
    SearchTourPlan() {
        debugger
        this.spinner.show();
        if (!this.TourPlan.controls["Status"].value) {
            this.TourPlan.controls["Status"].setValue("All")
        }

        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();

        this._TourPlan = Object.assign(this.TourPlan.value);
        this.tourPlanService.SearchTourPlan(this._TourPlan,count,currentIndex)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {

                debugger;
                if (baseResponse.Success) {
                    this.TourPlans = baseResponse.TourPlan.TourPlansByDate;
                    this.dataSource.data = baseResponse.TourPlan.TourPlansByDate;
                    if (this.dataSource.data.length > 0)
                        this.matTableLenght = true;
                    else
                        this.matTableLenght = false;

                    this.dv = this.dataSource.data;
                    this.totalItems = baseResponse.TourPlan.TourPlansByDate[0].TourPlans[0].TotalRecords;
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


    getStatus(status: string) {

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

    editTourPlan(tourPlan: any) {
        var v = JSON.stringify(tourPlan)
        console.log("Edit case"+v);
        // this.router.navigate(['other']);

        // console.log(this.TourPlan.controls["Status"].value)
        // utilization = {Status:this.TourPlan.controls["Status"].value}

        this.router.navigate(['../create-tour-plan'], {
            state: { example: tourPlan,flag:1 },
            relativeTo: this.activatedRoute
        });
    }


    deleteTourPlan(tourPlan){
        tourPlan.Status= "C";
        debugger
        this.spinner.show();
        this.tourPlanService
            .ChanageTourStatus(tourPlan)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe(
                (baseResponse) => {
                    if (baseResponse.Success) {
                        console.log(baseResponse)
                        // this.layoutUtilsService.alertElement("", baseResponse.Message);
                        this.SearchTourPlan()

                    }

                });

    }

    paginateAs(pageIndex : any, pageSize: any = this.itemsPerPage){

    }
    async LoadLovs() {

        //this.ngxService.start();

        this.tourPlanStatusLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.UtilizationTypes })
        // console.log(this.CustomerStatusLov.LOVs);
        this.tourPlanStatusLov.LOVs.forEach(function (value) {
            if (!value.Value)
                value.Value = "All";
        });

        debugger;
        ////For Bill type
        // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })

        // this.ngxService.stop();

    }

}