import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LayoutUtilsService} from "../../../shared/services/layout-utils.service";
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
import {TourDiary} from "../model/tour-diary-model";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {environment} from "../../../../environments/environment";
import {Activity} from "../../../shared/models/activity.model";
import {CommonService} from "../../../shared/services/common.service";

@Component({
    selector: 'search-tour-diary',
    templateUrl: './search-tour-diary.component.html',
    styleUrls: ['./search-tour-diary.component.scss'],

})

export class SearchTourDiaryComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @Input() isDialog: any = false;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;

    displayedColumns = ['VisitedDate', 'Purpose', 'Remarks', 'Status', 'TotalRecords', "Actions"];
    gridHeight: string;
    TourDiary: FormGroup;
    myDate = new Date().toLocaleDateString();
    isMCO: boolean = false;
    isBM: boolean = false;
    loggedInUser: any;
    public LovCall = new Lov();
    public CustomerStatusLov: any;
    _TourDiary = new TourDiary;
    isUserAdmin: boolean = false;
    loggedInUserDetails: any;
    TourDiarysByDate;
    minDate: Date;
    fromdate: string;
    todate: string;
    Today = new Date;
    tourDiaryStatusLov;
    dv: number | any; //use later
    matTableLenght: any;
    TourDiarys;
    Math: any;

    Limit: any;
    OffSet: number = 0;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    viewOnly = false;
    zc = false;

    //Start ZBC

    LoggedInUserInfo: BaseResponseModel;

    zone: any;
    branch: any;
    circle: any;
    currentActivity: Activity;
    userInfo = this.userUtilsService.getUserDetails();

    constructor(private store: Store<AppState>,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                public snackBar: MatSnackBar,
                private filterFB: FormBuilder,
                private router: Router,
                private spinner: NgxSpinnerService,
                private tourDiaryService: TourDiaryService,
                private _lovService: LovService,
                private layoutUtilsService: LayoutUtilsService,
                private _circleService: CircleService,
                private _cdf: ChangeDetectorRef,
                private datePipe: DatePipe,
                private _common: CommonService,
                private userUtilsService: UserUtilsService) {
        this.loggedInUser = userUtilsService.getUserDetails();
        this.Math = Math;
    }

    ngOnInit() {
        var userDetails = this.userUtilsService.getUserDetails();
        this.loggedInUserDetails = userDetails;
        console.log(this.loggedInUserDetails)
        this.loggedInUserDetails.User.userGroup.forEach(element => {
            if (element.ProfileID == Number(environment.ZC)) {
                this.zc = true;
            }
        })
        this.setUsers()
        this.LoadLovs();
        this.createForm();
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        setTimeout(() => {
            let sessionData = sessionStorage.getItem('search-page');

            if (sessionData) {
                sessionStorage.removeItem('search-page');
                let back_to_list = localStorage.getItem('back_to_list');
                if (back_to_list && back_to_list == 'true') {
                    localStorage.removeItem('back_to_list')
                    let data = JSON.parse(sessionData);

                    this.TourDiary.patchValue(data);
                    this.TourDiary.controls['StartDate'].setValue(this._common.stringToDate(data.StartDate));
                    this.TourDiary.controls['EndDate'].setValue(this._common.stringToDate(data.EndDate));
                    this.SearchTourDiary(true);
                }
            }
        }, 1000)

    }

    setUsers() {
        var userInfo = this.userUtilsService.getUserDetails();
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
    }

    setFromDate() {
        this.minDate = this.TourDiary.controls.FromDate.value;
        var FromDate = this.TourDiary.controls.FromDate.value;
        if (FromDate._isAMomentObject == undefined) {
            try {
                var day = this.TourDiary.controls.FromDate.value.getDate();
                var month = this.TourDiary.controls.FromDate.value.getMonth() + 1;
                var year = this.TourDiary.controls.FromDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.fromdate = branchWorkingDate.toString();
                this.TourDiary.controls.FromDate.setValue(branchWorkingDate)
            } catch (e) {
            }
        } else {
            try {
                var day = this.TourDiary.controls.FromDate.value.toDate().getDate();
                var month = this.TourDiary.controls.FromDate.value.toDate().getMonth() + 1;
                var year = this.TourDiary.controls.FromDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                FromDate = day + "" + month + "" + year;

                this.fromdate = FromDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.TourDiary.controls.FromDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }

    setToDate() {

        var ToDate = this.TourDiary.controls.ToDate.value;
        if (ToDate._isAMomentObject == undefined) {
            try {
                var day = this.TourDiary.controls.ToDate.value.getDate();
                var month = this.TourDiary.controls.ToDate.value.getMonth() + 1;
                var year = this.TourDiary.controls.ToDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.TourDiary.controls.ToDate.setValue(branchWorkingDate)
            } catch (e) {
            }
        } else {
            try {
                var day = this.TourDiary.controls.ToDate.value.toDate().getDate();
                var month = this.TourDiary.controls.ToDate.value.toDate().getMonth() + 1;
                var year = this.TourDiary.controls.ToDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                ToDate = day + "" + month + "" + year;
                this.todate = ToDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.TourDiary.controls.ToDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }


    createForm() {
        var userInfo = this.userUtilsService.getUserDetails();
        this.TourDiary = this.filterFB.group({
            Zone: [userInfo?.Zone?.ZoneName],
            Branch: [userInfo?.Branch?.Name],
            StartDate: [],
            EndDate: [],
            Status: ["", Validators.required],
            CircleId: []
        });

    }


    hasError(controlName: string, errorName: string): boolean {
        return this.TourDiary.controls[controlName].hasError(errorName);
    }

    SearchTourDiary(from_search_button = false) {


        if (this.TourDiary.invalid) {
            const controls = this.TourDiary.controls;
            this.layoutUtilsService.alertElement('', 'Please Add Required Values')
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            return;
        }
        if (from_search_button == true)
            this.OffSet = 0;
        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();
        this._TourDiary = Object.assign(this.TourDiary.value);
        this._TourDiary["StartDate"] = this.datePipe.transform(this.TourDiary.controls["StartDate"].value, 'ddMMyyyy');
        this._TourDiary["EndDate"] = this.datePipe.transform(this.TourDiary.controls["EndDate"].value, 'ddMMyyyy');
        if (!this.zone) {
            if (this.TourDiary.value.ZoneId) {
                this.zone = {
                    ZoneId: this.TourDiary.value.ZoneId
                }
            } else {
                var Message = 'Please select Zone';
                this.layoutUtilsService.alertElement(
                    '',
                    Message,
                    null
                );
                return;
            }
        }

        this.spinner.show();
        this.tourDiaryService.SearchTourDiary(this._TourDiary, count, currentIndex, this.branch, this.zone, this.zc)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {


                if (baseResponse.Success) {

                    this.TourDiarys = baseResponse?.TourDiary?.TourDiaries;
                } else {

                    this.TourDiarys = [];
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            });
    }


    async LoadLovs() {
        this.tourDiaryStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.UtilizationTypes})
        //
        this.tourDiaryStatusLov?.LOVs.forEach(function (value) {
            if (!value.Value)
                value.Value = "All";
        });
    }

    getAllData(data) {

        if (Array.isArray(data.final_zone)) {
            this.zone = data.final_zone[0];
        } else {
            this.zone = data.final_zone;
        }

        this.branch = data.final_branch;
        this.circle = data.final_circle;
    }


}
