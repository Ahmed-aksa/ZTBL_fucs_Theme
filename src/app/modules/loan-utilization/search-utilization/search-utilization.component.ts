import {DatePipe} from '@angular/common';
import {Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {errorMessages, Lov, LovConfigurationKey, MaskEnum} from 'app/shared/classes/lov.class';
import {Branch} from 'app/shared/models/branch.model';
import {CreateCustomer} from 'app/shared/models/customer.model';
import {CircleService} from 'app/shared/services/circle.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {Zone} from '../../user-management/users/utils/zone.model'
import {LoanUtilizationService} from "../service/loan-utilization.service";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Circle} from 'app/shared/models/circle.model';
import {LoanUtilizationSearch} from "../Model/loan-utilization.model";

@Component({
    selector: 'kt-search-utilization',
    templateUrl: './search-utilization.component.html',
    providers: [LoanUtilizationService, DatePipe]
})
export class SearchUtilizationComponent implements OnInit {

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

    displayedColumns = ["LoanCaseNo",
        // "GlCode",

        "GlSubCode",
        "SchemeCode",
        "CropCode",
        "Status",
        "Remarks",
        "Lng",
        "Lat",
        "Actions",
    ]
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
    private _utilizationSearch = new LoanUtilizationSearch();
    isUserAdmin: boolean = false;
    isZoneUser: boolean = false;
    loggedInUserDetails: any;
    loanutilizationStatusLov;

    //Start ZBC

    LoggedInUserInfo: BaseResponseModel;


    //End ZBC


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

        var userDetails = this.userUtilsService.getUserDetails();
        this.loggedInUserDetails = userDetails;
        this.setUsers()
        if (this.isDialog)
            this.displayedColumns = ["LoanCaseNo",
                // "GlCode",
                "Status",
                "Remarks",
                "Lng",
                "Lat",
                "Actions",]
        //else
        //  this.displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CurrentAddress', 'CustomerStatus', 'View']

        this.LoadLovs();
        this.createForm();
        // this.setCircles();

    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    //Start ZBC
    private userInfo = this.userUtilsService.getUserDetails();


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
        if (userInfo.User.userGroup[0].ProfileID == "9999999") {
            this.isAdmin = true;
        }

        if (this.isUserAdmin || this.isZoneUser) {
            userInfo.Branch = {};
            if (this.branch.BranchCode != undefined)
                userInfo.Branch = this.branch;
            else
                userInfo.Branch = null;
        }
        if (this.isUserAdmin) {
            userInfo.Zone = {};
            if (this.zone.ZoneId != undefined)
                userInfo.Zone = this.zone
            else
                userInfo.Zone = null;
        }
        //BM User
        // if(userInfo.User.userGroup[0].ProfileID=="56"){
        //   this.isMCO=true;
        // }else{
        //   this.isMCO=false;
        // }

    }

    // setCircles() {
    //     var userInfo = this.userUtilsService.getUserDetails();
    //     if(userInfo.User.userGroup[0].ProfileID != "9999999"){
    //         this._circleService.GetCircleByBranchId()
    //             .pipe(
    //                 finalize(() => {
    //                     this.loading = false;
    //                 })
    //             )
    //             .subscribe(baseResponse => {
    //                 if (baseResponse.Success) {
    //                     this.circle = baseResponse.Circles;
    //                 } else {
    //                     this.layoutUtilsService.alertElement("", baseResponse.Message);
    //                 }
    //             });
    //     }
    // }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 300 + 'px';
        //var userInfo = this.userUtilsService.getUserDetails();
        //this.utilizationSearch.controls['Zone'].setValue(userInfo.Zone.ZoneName);
        //this.utilizationSearch.controls['Branch'].setValue(userInfo.Branch.Name);
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

    CheckEditStatus(loanUtilization: any) {
        this.loggedInUserDetails.User.UserId
        if (this.isMCO) {
            if (loanUtilization.Status == "P" || loanUtilization.Status == "R") {
                if (loanUtilization.CreatedBy == this.loggedInUserDetails.User.UserId) {
                    return true
                } else {
                    return false
                }
            } else {
                return false;
            }
        } else if (this.isBM) {
            if (loanUtilization.Status == "S") {
                return true
            }
        } else {
            return false
        }
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
        } else if (this.isAdmin) {
            return true
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
        this.utilizationSearch = this.filterFB.group({
            Zone: [userInfo?.Zone?.ZoneName],
            Branch: [userInfo?.Branch?.Name],
            Circle: [],
            LoanCaseNo: [""],
            Status: ["", Validators.required],
            CircleId: []
        });

    }


    hasError(controlName: string, errorName: string): boolean {
        return this.utilizationSearch.controls[controlName].hasError(errorName);
    }

    searchloanutilization() {
        if (!this.zone) {
            var Message = 'Please select Zone';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        if (!this.branch) {
            var Message = 'Please select Branch';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }


        this.spinner.show();
        // this._customer.clear();
        // console.log(this.utilizationSearch.controls["Status"].value);
        if (!this.utilizationSearch.controls["Status"].value) {
            this.utilizationSearch.controls["Status"].setValue("All")
        }
        this._utilizationSearch = Object.assign(this.utilizationSearch.value);
        this._loanutilizationService.searchUtilization(this._utilizationSearch, this.zone, this.branch, this.circle)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.dataSource.data = baseResponse.LoanUtilization["Utilizations"];
                    console.log(this.dataSource.data)
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


    editloanutilization(utilization: any) {

        this.router.navigate(['/loan-utilization/loan-uti'], {
            state: {example: utilization},
            relativeTo: this.activatedRoute
        });
    }


    viewloanutilization(utilization: any) {
        utilization.view = "1";
        this.router.navigate(['/loan-utilization/loan-uti'], {
            state: {example: utilization},
            relativeTo: this.activatedRoute
        });
    }

    async LoadLovs() {

        this.loanutilizationStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.UtilizationTypes})
        // console.log(this.CustomerStatusLov.LOVs);
        this.loanutilizationStatusLov.LOVs.forEach(function (value) {
            if (!value.Value)
                value.Value = "All";
        });


    }

}
