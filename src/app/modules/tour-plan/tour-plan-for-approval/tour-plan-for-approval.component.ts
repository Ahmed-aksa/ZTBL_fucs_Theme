import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Lov, LovConfigurationKey} from "../../../shared/classes/lov.class";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../../shared/reducers";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {TourPlanService} from "../Service/tour-plan.service";
import {LovService} from "../../../shared/services/lov.service";
import {LayoutUtilsService} from "../../../shared/services/layout-utils.service";
import {CircleService} from "../../../shared/services/circle.service";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {finalize, map} from "rxjs/operators";
import {TourPlan} from '../Model/tour-plan.model';
import moment from "moment";
import {SignatureDailogDairyComponent} from "../../tour-dairy/signature-dailog-dairy/signature-dailog-dairy.component";
import {SignaturePadForTourComponent} from "../signature-pad-for-tour/signature-pad-for-tour.component";
import {data} from "autoprefixer";
import {environment} from "../../../../environments/environment";
import {ToastrService} from "ngx-toastr";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-tour-plan-for-approval',
    templateUrl: './tour-plan-for-approval.component.html',
    styleUrls: ['./tour-plan-for-approval.component.scss']
})
export class TourPlanForApprovalComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @Input() isDialog: any = false;
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;

    displayedColumns = ['VisitedDate', 'Purpose', 'Remarks', 'Status', 'TotalRecords', "Actions"];
    gridHeight: string;
    tourPlanApprovalForm: FormGroup;
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

    // Pagination
    Limit: any;
    OffSet: number = 0;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;

    //Start ZBC

    LoggedInUserInfo: BaseResponseModel;

    zone: any;
    branch: any;
    circle: any;
    children: [any][any] = [];


    constructor(private store: Store<AppState>,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                public snackBar: MatSnackBar,
                private filterFB: FormBuilder,
                private router: Router,
                private spinner: NgxSpinnerService,
                private tourPlanService: TourPlanService,
                private toaster: ToastrService,
                private http: HttpClient,
                private _lovService: LovService,
                private layoutUtilsService: LayoutUtilsService,
                private _circleService: CircleService,
                private _cdf: ChangeDetectorRef,
                private userUtilsService: UserUtilsService) {
        this.loggedInUser = userUtilsService.getUserDetails();
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
        this.minDate = this.tourPlanApprovalForm.controls.FromDate.value;
        var FromDate = this.tourPlanApprovalForm.controls.FromDate.value;
        if (FromDate._isAMomentObject == undefined) {
            try {
                var day = this.tourPlanApprovalForm.controls.FromDate.value.getDate();
                var month = this.tourPlanApprovalForm.controls.FromDate.value.getMonth() + 1;
                var year = this.tourPlanApprovalForm.controls.FromDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.fromdate = branchWorkingDate.toString();
                this.tourPlanApprovalForm.controls.FromDate.setValue(branchWorkingDate)
            } catch (e) {
            }
        } else {
            try {
                var day = this.tourPlanApprovalForm.controls.FromDate.value.toDate().getDate();
                var month = this.tourPlanApprovalForm.controls.FromDate.value.toDate().getMonth() + 1;
                var year = this.tourPlanApprovalForm.controls.FromDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                FromDate = day + "" + month + "" + year;

                this.fromdate = FromDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.tourPlanApprovalForm.controls.FromDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }

    setToDate() {

        var ToDate = this.tourPlanApprovalForm.controls.ToDate.value;
        if (ToDate._isAMomentObject == undefined) {
            try {
                var day = this.tourPlanApprovalForm.controls.ToDate.value.getDate();
                var month = this.tourPlanApprovalForm.controls.ToDate.value.getMonth() + 1;
                var year = this.tourPlanApprovalForm.controls.ToDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.tourPlanApprovalForm.controls.ToDate.setValue(branchWorkingDate)
            } catch (e) {
            }
        } else {
            try {
                var day = this.tourPlanApprovalForm.controls.ToDate.value.toDate().getDate();
                var month = this.tourPlanApprovalForm.controls.ToDate.value.toDate().getMonth() + 1;
                var year = this.tourPlanApprovalForm.controls.ToDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                ToDate = day + "" + month + "" + year;
                this.todate = ToDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.tourPlanApprovalForm.controls.ToDate.setValue(branchWorkingDate);
            } catch (e) {
            }
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

        TourPlan.view = "1";
        //
        // utilization = {Status:this.TourPlan.controls["Status"].value}
        this.router.navigate(['../tour-plan'], {
            state: {example: TourPlan, flag: 1},
            relativeTo: this.activatedRoute
        });
    }

    CheckViewStatus(loanUtilization: any) {
        if (this.isMCO) {
            if (loanUtilization.Status == "C" || loanUtilization.Status == "S" || loanUtilization.Status == "A") {
                if (loanUtilization.CreatedBy == this.loggedInUserDetails.User.UserId) {
                    return true
                } else {
                    return false
                }
            } else {
                return false;
            }
        } else if (this.isBM) {
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
        this.tourPlanApprovalForm = this.filterFB.group({
            FromDate: [moment(), Validators.required],
            ToDate: [, Validators.required],
            PPNO: [null],
        });

    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {

        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.searchTourPlanApproval()
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.tourPlanApprovalForm.controls[controlName].hasError(errorName);
    }

    getTourPlan() {


    }

    toggleByDateAccordion(i) {
        debugger
        let down_arrow = document.getElementById('arrow_down_date_' + i).style.display;
        if (down_arrow == 'block') {
            document.getElementById('arrow_down_date_' + i).style.display = 'none';
            document.getElementById('arrow_up_date_' + i).style.display = 'block';
            document.getElementById('table_date_' + i).style.display = 'block';
        } else {
            document.getElementById('arrow_up_date_' + i).style.display = 'none';
            document.getElementById('arrow_down_date_' + i).style.display = 'block';
            document.getElementById('table_date_' + i).style.display = 'none';
        }
    }

    toggleAccordion(i: number, user_id) {
        let down_arrow = document.getElementById('arrow_down_' + i).style.display;
        if (down_arrow == 'block') {
            document.getElementById('arrow_down_' + i).style.display = 'none';
            document.getElementById('arrow_up_' + i).style.display = 'block';
            document.getElementById('table_' + i).style.display = 'block';
            this.searchTourPlanApproval(false, user_id, i);
        } else {
            document.getElementById('arrow_up_' + i).style.display = 'none';
            document.getElementById('arrow_down_' + i).style.display = 'block';
            document.getElementById('table_' + i).style.display = 'none';
        }
        this.children = [];
    }

    searchTourPlanApproval(start = false, user_id = null, index = 0) {

        this.spinner.show();
        let offset = '0';
        if (start)
            offset = this.OffSet.toString();
        let _TourPlan = Object.assign(this.tourPlanApprovalForm.value);
        this.tourPlanService.searchForTourPlanApproval(_TourPlan, this.itemsPerPage, offset, this.branch, this.zone, this.circle, user_id)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {


                if (baseResponse.Success) {
                    if (user_id) {
                        this.TourPlans[index].TourPlans = baseResponse.TourPlanList[0].TourPlans;
                        this.TourPlans[index].children = []
                    } else {
                        this.TourPlans = baseResponse.TourPlanList[0].TourPlans;
                        this.dataSource.data = baseResponse.TourPlanList[0].TourPlans;
                    }
                    this.TourPlans.forEach((single_plan) => {
                        this.children.push(single_plan);
                    })
                    if (this.dataSource?.data?.length > 0)
                        this.matTableLenght = true;
                    else
                        this.matTableLenght = false;

                    this.dv = this.dataSource?.data;
                    this.dataSource.data = this.dv?.slice(0, this.totalItems)
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv?.slice(0, this.itemsPerPage);
                } else {

                    if (this.dv != undefined) {
                        this.matTableLenght = false;
                        this.dataSource = this.dv.slice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
                        // this.dataSource.data = [];
                        // this._cdf.detectChanges();
                        this.OffSet = 1;
                        this.pageIndex = 1;
                        this.dv = this.dv.slice(1, 0);
                    }
                    this.layoutUtilsService.alertElement("", baseResponse.Message);

                }
            });
    }


    getStatus(status: string) {

        if (status == 'P') {
            return "Submit";
        } else if (status == 'N') {
            return "Pending";
        } else if (status == 'S') {
            return "Submitted";
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

    editTourPlan(tourPlan: any) {
        var v = JSON.stringify(tourPlan)

        // this.router.navigate(['other']);

        //
        // utilization = {Status:this.TourPlan.controls["Status"].value}

        this.router.navigate(['../tour-plan'], {
            state: {example: tourPlan, flag: 1},
            relativeTo: this.activatedRoute
        });
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
                        this.searchTourPlanApproval()
                    }
                });

    }

    paginateAs(pageIndex: any, pageSize: any = this.itemsPerPage) {

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
        this.circle = data.final_circle;
    }

    changeStatus(child: any, status: string, ids = []) {
        if (child) {
            const signatureDialogRef = this.dialog.open(
                SignaturePadForTourComponent,
                {width: '500px', disableClose: true, data: {userId: child.UserId, ids: child.children, status: status}},
            );
        } else {
            this.toaster.error("No Child Found");
        }
    }

    change(parent, status) {
        let parent_index = this.children.indexOf(parent);
        let ids = []
        this.children[parent_index].children.forEach((single_children) => {
            ids.push(String(single_children.TourPlanId));
        })
        this.changeStatus(this.children[parent_index], status, ids);
    }


    changeCheckBox(parent, child: any) {
        let parent_index = this.children.indexOf(parent);
        if (!this.children[parent_index].children.includes(child.TourPlanId)) {
            this.children[parent_index].children.push(child.TourPlanId)
        } else {
            this.children[parent_index].children.pop(child.TourPlanId);
        }
    }
}
