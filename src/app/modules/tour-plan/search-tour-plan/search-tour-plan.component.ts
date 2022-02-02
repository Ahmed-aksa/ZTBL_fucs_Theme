import {Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LayoutUtilsService} from "../../../shared/services/layout-utils.service";
import {TourPlan} from '../Model/tour-plan.model';
import {TourPlanService} from "../Service/tour-plan.service";
import {CircleService} from "../../../shared/services/circle.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Lov, LovConfigurationKey} from "../../../shared/classes/lov.class";
import {AppState} from "../../../shared/reducers";
import {Store} from "@ngrx/store";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LovService} from "../../../shared/services/lov.service";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'search-loan-utilization',
    templateUrl: './search-tour-plan.component.html',
    styleUrls: ['./search-tour-plan.component.scss'],

})

export class SearchTourPlanComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @Input() isDialog: any = false;
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;

    displayedColumns = ['VisitedDate', 'Purpose', 'Remarks', 'Status', 'TotalRecords', "Actions"];
    gridHeight: string;
    TourPlan: FormGroup;
    myDate = new Date().toLocaleDateString();
    isMCO: boolean = false;
    isBM: boolean = false;
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
    Math: any;

    // Pagination
    Limit: any;
    OffSet: number = 0;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    viewOnly = false;

    //Start ZBC

    LoggedInUserInfo: BaseResponseModel;

    zone: any;
    branch: any;


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
                private datePipe: DatePipe,
                private userUtilsService: UserUtilsService) {
        this.loggedInUser = userUtilsService.getUserDetails();
        this.Math = Math;
    }

    ngOnInit() {
        var userDetails = this.userUtilsService.getUserDetails();
        this.loggedInUserDetails = userDetails;
        this.setUsers()
        this.LoadLovs();
        this.createForm();
        // this.setCircles();
        this.getTourPlan();

        this.settingZBC();
    }

    //Start ZBC
    userInfo = this.userUtilsService.getUserDetails();

    settingZBC() {

        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    }


    //End ZBC


    setUsers() {
        var userInfo = this.userUtilsService.getUserDetails();
        //
        //MCO User
        if (userInfo.User.userGroup[0].ProfileID == "56") {
            this.isMCO = true;
        }

        if (userInfo.User.userGroup[0].ProfileID == "57") {
            this.isBM = true;
        }
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 400 + 'px';

        //var userInfo = this.userUtilsService.getUserDetails();
        //this.TourPlan.controls['Zone'].setValue(userInfo.Zone.ZoneName);
        //this.TourPlan.controls['Branch'].setValue(userInfo.Branch.Name);
    }

    // CheckEditStatus(loanUtilization: any) {
    //

    //   if () {
    //     return true
    //   }
    //   else {
    //     return false
    //   }
    // }

    setFromDate() {

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
        } else {
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
        } else {
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
            //
            // .split('T')[0]);
            return this.Today;
        }
    }

    getTodayForTo() {
        return new Date().toISOString().split('T')[0]
    }

    CheckEditStatus(TourPlan: any) {
        if (TourPlan.Status == "P" || TourPlan.Status == "R") {
            if (TourPlan.UserId == this.loggedInUserDetails.User.UserId) {
                return true
            } else {
                return false
            }
        }
    }


    viewTourPlan(TourPlan: any) {
        // this.router.navigate(['other']);
        TourPlan.viewOnly = true;
        var v = JSON.stringify(TourPlan);
        localStorage.setItem('SearchTourPlan', v);
        localStorage.setItem('EditViewTourPlan', '1');
        this.router.navigate(['../tour-plan', {upFlag: "1"}], {relativeTo: this.activatedRoute});
        //TourPlan.view = "1";
        //
        // utilization = {Status:this.TourPlan.controls["Status"].value}
        // this.router.navigate(['../tour-plan'], {
        //     state: {example: TourPlan, flag: 1},
        //     relativeTo: this.activatedRoute
        // });
    }

    CheckViewStatus(loanUtilization: any) {
        // if (this.isMCO) {
        //     if (loanUtilization.Status == "C" || loanUtilization.Status == "S" || loanUtilization.Status == "A") {
        //         if (loanUtilization.CreatedBy == this.loggedInUserDetails.User.UserId) {
        //             return true
        //         } else {
        //             return false
        //         }
        //         return true
        //     } else {
        //         return false;
        //     }
        // } else if (this.isBM) {
        //     if (loanUtilization.Status == "C" || loanUtilization.Status == "P" || loanUtilization.Status == "R" || loanUtilization.Status == "A") {
        //         return true
        //     }
        // } else {
        //     return false
        // }
        if (loanUtilization.Status == "C" || loanUtilization.Status == "P" || loanUtilization.Status == "R" || loanUtilization.Status == "A" || loanUtilization.Status == "S") {
            return true
        }else {
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
            Zone: [userInfo?.Zone?.ZoneName],
            Branch: [userInfo?.Branch?.Name],
            StartDate: [],
            EndDate: [],
            Status: ["", Validators.required],
            CircleId: []
        });

    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.SearchTourPlan()
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
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


    SearchTourPlan() {
        if (this.TourPlan.invalid) {
            const controls = this.TourPlan.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            return;
        }

        // if (!this.TourPlan.controls["Status"].value) {
        //     this.TourPlan.controls["Status"].setValue("All")
        // }

        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();
        this.TourPlan.controls["StartDate"].setValue(this.datePipe.transform(this.TourPlan.controls["StartDate"].value, 'ddMMyyyy'))
        this.TourPlan.controls["EndDate"].setValue(this.datePipe.transform(this.TourPlan.controls["EndDate"].value, 'ddMMyyyy'))
        this._TourPlan = Object.assign(this.TourPlan.value);
        this.spinner.show();
        this.tourPlanService.SearchTourPlan(this._TourPlan, count, currentIndex, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {


                if (baseResponse.Success) {
                    this.TourPlans = baseResponse.TourPlan.TourPlansByDate;
                    this.dataSource.data = baseResponse.TourPlan.TourPlansByDate;
                    if (this.dataSource.data.length > 0)
                        this.matTableLenght = true;
                    else
                        this.matTableLenght = false;

                    this.dv = this.dataSource.data;
                    this.totalItems = baseResponse.TourPlan.TourPlansByDate[0].TotalRecords;
                    this.dataSource.data = this.dv.slice(0, this.totalItems)
                    //this.dataSource = new MatTableDataSource(data);

                    // this.totalItems = baseResponse.JournalVoucher.JournalVoucherDataList.length;
                    //this.paginate(this.pageIndex) //calling paginate function
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                } else {

                    // if (this.dv != undefined) {
                    this.matTableLenght = false;
                    this.TourPlans = [];
                    this.dataSource = this.dv.splice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
                    // this.dataSource.data = [];
                    // this._cdf.detectChanges();
                    this.OffSet = 1;
                    this.pageIndex = 1;
                    this.dv = this.dv.splice(1, 0);
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    // }
                }
            });
    }


    getBranchName(branchId){
        if(branchId == this.branch?.BranchId)
            return this.branch.Name
    }

    getZoneName(zoneId){
        if(zoneId == this.zone?.ZoneId)
            return this.zone.ZoneName

        console.log(this.zone)
    }

    // getStatus(status: string) {
    //
    //     if (status == 'P') {
    //         return "Submit";
    //     } else if (status == 'N') {
    //         return "Pending";
    //     } else if (status == 'A') {
    //         return "Authorized";
    //     } else if (status == 'R') {
    //         return "Refer Back";
    //     }
    // }


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
        tourPlan.viewOnly = false;
        var v = JSON.stringify(tourPlan)
        // this.router.navigate(['other']);

        //
        // utilization = {Status:this.TourPlan.controls["Status"].value}
        localStorage.setItem('SearchTourPlan', v);
        localStorage.setItem('EditViewTourPlan', '1');
        this.router.navigate(['../tour-plan', {upFlag: "1"}], {relativeTo: this.activatedRoute});
        // this.router.navigate(['../tour-plan'], {
        //     state: {example: tourPlan, flag: 1},
        //     relativeTo: this.activatedRoute
        // });
    }


    deleteTourPlan(tourPlan) {
        tourPlan.Status = "C";

        this.spinner.show();
        this.tourPlanService
            .ChanageTourStatus(tourPlan)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe(
                (baseResponse) => {
                    if (baseResponse.Success) {

                        // this.layoutUtilsService.alertElement("", baseResponse.Message);
                        this.SearchTourPlan()
                    }
                });

    }


    async LoadLovs() {

        //this.ngxService.start();

        this.tourPlanStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.UtilizationTypes})
        //
        this.tourPlanStatusLov?.LOVs.forEach(function (value) {
            if (!value.Value)
                value.Value = "All";
        });


        ////For Bill type
        // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })

        // this.ngxService.stop();

    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
    }
}
