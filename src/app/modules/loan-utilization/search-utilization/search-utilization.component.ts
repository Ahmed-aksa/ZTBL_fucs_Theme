import {DatePipe} from '@angular/common';
import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {errorMessages, Lov, LovConfigurationKey, MaskEnum} from 'app/shared/classes/lov.class';
import {CircleService} from 'app/shared/services/circle.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {LoanUtilizationService} from '../service/loan-utilization.service';
import {BaseResponseModel} from '../../../shared/models/base_response.model';
import {LoanUtilizationSearch} from '../Model/loan-utilization.model';
import {Activity} from "../../../shared/models/activity.model";
import { environment } from 'environments/environment';

@Component({
    selector: 'kt-search-utilization',
    templateUrl: './search-utilization.component.html',
    providers: [LoanUtilizationService, DatePipe]
})
export class SearchUtilizationComponent implements OnInit, AfterViewInit {

    dataSource = new MatTableDataSource();
    @Input() isDialog: any = false;
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;


    //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob', 'CustomerStatus', 'View'];
    //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob','CustomerStatus', 'View'];

    branch: any;
    zone: any;
    circle: any;

    matTableLenght: any;
    dv: number | any; //use later


    Math: any;

    Limit: any;
    OffSet: number = 0;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;

    displayedColumns = ['LoanCaseNo',
        // "GlCode",

        'GlSubCode',
        'SchemeCode',
        'CropCode',
        'Status',
        'Remarks',
        'Lng',
        'Lat',
        'AddedOn',
        'Actions',
    ];
    gridHeight: string;
    utilizationSearch: FormGroup;
    myDate = new Date().toLocaleDateString();
    isMCO: boolean = false;
    isBM: boolean = false;
    isAdmin: boolean = false;

    loggedInUser: any;
    public maskEnums = MaskEnum;
    errors = errorMessages;
    public LovCall = new Lov();
    public CustomerStatusLov: any;
    isUserAdmin: boolean = false;
    isZoneUser: boolean = false;
    loggedInUserDetails: any;
    loanutilizationStatusLov;
    LoggedInUserInfo: BaseResponseModel;

    //Start ZBC
    currentActivity: Activity
    private _utilizationSearch = new LoanUtilizationSearch();


    //End ZBC
    //Start ZBC
    private userInfo = this.userUtilsService.getUserDetails();

    constructor(
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        public snackBar: MatSnackBar,
        private filterFB: FormBuilder,
        private router: Router,
        private spinner: NgxSpinnerService,
        private _loanutilizationService: LoanUtilizationService,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private _circleService: CircleService,
        private _cdf: ChangeDetectorRef,
        private userUtilsService: UserUtilsService) {
        this.loggedInUser = userUtilsService.getUserDetails();
    }

    ngOnInit() {
        this.currentActivity = this.userUtilsService.getActivity('Search Utilization')
        const userDetails = this.userUtilsService.getUserDetails();
        this.loggedInUserDetails = userDetails;
        this.setUsers();
        if (this.isDialog) {
            this.displayedColumns = ['LoanCaseNo',
                // "GlCode",
                'Status',
                'Remarks',
                'Lng',
                'Lat',
                'Actions',];
        }
        //else
        //  this.displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CurrentAddress', 'CustomerStatus', 'View']

        this.LoadLovs();
        this.createForm();
        // this.setCircles();

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

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    setUsers() {
        const userInfo = this.userUtilsService.getUserDetails();
        this.userInfo = this.userUtilsService.getUserDetails();
        //
        //MCO User
        if (userInfo.User.userGroup[0].ProfileID == environment.MCO_Group_ID) {
            this.isMCO = true;
        }

        if (userInfo.User.userGroup[0].ProfileID == environment.BM) {
            this.isBM = true;
        }
        if (userInfo.User.userGroup[0].ProfileID == '9999999') {
            this.isAdmin = true;
        }

        if (this.isUserAdmin || this.isZoneUser) {
            userInfo.Branch = {};
            if (this.branch.BranchCode != undefined) {
                userInfo.Branch = this.branch;
            } else {
                userInfo.Branch = null;
            }
        }
        if (this.isUserAdmin) {
            userInfo.Zone = {};
            if (this.zone.ZoneId != undefined) {
                userInfo.Zone = this.zone;
            } else {
                userInfo.Zone = null;
            }
        }
        //BM User
        // if(userInfo.User.userGroup[0].ProfileID=="56"){
        //   this.isMCO=true;
        // }else{
        //   this.isMCO=false;
        // }

    }


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 200 + 'px';
        if (this.zone) {
            this.searchloanutilization();
        }
    }


    CheckEditStatus(loanUtilization: any) {
        this.loggedInUserDetails.User.UserId;
        if (this.isMCO) {
            if (loanUtilization.Status == 'P' || loanUtilization.Status == 'R') {
                if (loanUtilization.CreatedBy == this.loggedInUserDetails.User.UserId) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else if (this.isBM) {
            if (loanUtilization.Status == 'S') {
                return true;
            }
        } else {
            return false;
        }
    }

    CheckViewStatus(loanUtilization: any) {

        if (this.isMCO) {
            if (loanUtilization.Status == 'C' || loanUtilization.Status == 'S' || loanUtilization.Status == 'A') {
                if (loanUtilization.CreatedBy == this.loggedInUserDetails.User.UserId) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else if (this.isBM) {
            if (loanUtilization.Status == 'C' || loanUtilization.Status == 'P' || loanUtilization.Status == 'R' || loanUtilization.Status == 'A') {
                return true;
            }
        } else if (this.isAdmin) {
            return true;
        } else {
            return false;
        }

    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }


    createForm() {
        const userInfo = this.userUtilsService.getUserDetails();
        this.utilizationSearch = this.filterFB.group({
            LoanCaseNo: [],
            Status: ['', Validators.required],
        });

    }


    hasError(controlName: string, errorName: string): boolean {
        return this.utilizationSearch.controls[controlName].hasError(errorName);
    }

    searchloanutilization(from_Search = false) {
        if (!this.zone) {
            var Message = 'Please select Zone';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }
        if (from_Search == true) {
            this.OffSet = 0;
        }
        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();


        this.spinner.show();
        if (!this.utilizationSearch.controls['Status'].value) {
            this.utilizationSearch.controls['Status'].setValue('All');
        }
        this._utilizationSearch = Object.assign(this.utilizationSearch.value);
        this._utilizationSearch["ZoneId"] = this._utilizationSearch["ZoneId"].toString();

        this._loanutilizationService.searchUtilization(this._utilizationSearch, this.zone, this.branch, this.circle, count, currentIndex)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.dataSource.data = baseResponse.LoanUtilization['Utilizations'];
                    if (this.dataSource.data.length > 0)
                        this.matTableLenght = true;
                    else
                        this.matTableLenght = false;

                    this.dv = this.dataSource.data;
                    this.totalItems = baseResponse.LoanUtilization.Utilizations[0].TotalRecords;
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
            return 'Submit';
        } else if (status == 'N') {
            return 'Pending';
        } else if (status == 'A') {
            return 'Authorized';
        } else if (status == 'R') {
            return 'Refer Back';
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


    editloanutilization(utilization: any) {
        localStorage.setItem('selected_single_zone', JSON.stringify(this.zone.ZoneId));
        localStorage.setItem('selected_single_branch', JSON.stringify(utilization.BranchCode));
        localStorage.setItem('selected_single_circle', JSON.stringify(utilization.CircleId));

        localStorage.removeItem('utilization')
        localStorage.setItem('utilization', JSON.stringify(utilization));
        this.router.navigate(['/loan-utilization/loan-uti'], {
            // state: {example: utilization},
            relativeTo: this.activatedRoute
        });
    }


    viewloanutilization(utilization: any) {
        localStorage.setItem('selected_single_zone', JSON.stringify(this.zone.ZoneId));
        localStorage.setItem('selected_single_branch', JSON.stringify(utilization.BranchCode));
        localStorage.setItem('selected_single_circle', JSON.stringify(utilization.CircleId));

        utilization.view = '1';
        localStorage.removeItem('utilization')
        localStorage.setItem('utilization', JSON.stringify(utilization));

        this.router.navigate(['/loan-utilization/loan-uti'], {
            // state: {example: utilization},
            relativeTo: this.activatedRoute
        });
    }

    async LoadLovs() {

        this.loanutilizationStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.UtilizationTypes});
        //
        this.loanutilizationStatusLov.LOVs.forEach(function (value) {
            if (!value.Value) {
                value.Value = 'All';
            }
        });


    }

}
