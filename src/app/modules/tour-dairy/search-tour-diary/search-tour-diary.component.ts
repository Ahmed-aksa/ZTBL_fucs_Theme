import {Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef} from '@angular/core';
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

@Component({
    selector: 'search-tour-diary',
    templateUrl: './search-tour-diary.component.html',
    styleUrls: ['./search-tour-diary.component.scss'],

})

export class SearchTourDiaryComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @Input() isDialog: any = false;
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
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
    isZoneUser: boolean = false;
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

    // Pagination
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
                private userUtilsService: UserUtilsService) {
        this.loggedInUser = userUtilsService.getUserDetails();
        this.Math = Math;
    }

    ngOnInit() {

        var userDetails = this.userUtilsService.getUserDetails();
        this.loggedInUserDetails = userDetails;
        console.log(this.loggedInUserDetails)
        this.loggedInUserDetails.User.userGroup.forEach(element=>{
            if(element.ProfileID == Number(environment.ZC)){
                this.zc = true;
            }
        })
        this.setUsers()
        this.LoadLovs();
        this.createForm();
        // this.setCircles();
        this.getTourDiary();

        this.settingZBC();
    }

    //Start ZBC
    userInfo = this.userUtilsService.getUserDetails();

    settingZBC() {

        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    }
    CheckDirectionStatus(loanUtilization: any) {
        // this.loggedInUserDetails.User.UserId;
        // if (this.isMCO) {
        //     if (loanUtilization.Status == 'P' || loanUtilization.Status == 'R') {
        //         if (loanUtilization.CreatedBy == this.loggedInUserDetails.User.UserId) {
        //             return true;
        //         } else {
        //             return false;
        //         }
        //     } else {
        //         return false;
        //     }
        // } else if (this.isBM) {
        //     if (loanUtilization.Status == 'S') {
        //         return true;
        //     }
        // } else {
        //     return false;
        // }
        return true

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
        //this.TourDiary.controls['Zone'].setValue(userInfo.Zone.ZoneName);
        //this.TourDiary.controls['Branch'].setValue(userInfo.Branch.Name);
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

        // this.TourDiary.controls.FromDate.reset();
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

    getToday() {
        // Today

        if (this.TourDiary.controls.ToDate.value) {
            this.Today = this.TourDiary.controls.ToDate.value
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

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.SearchTourDiary()
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.TourDiary.controls[controlName].hasError(errorName);
    }

    getTourDiary() {


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


    SearchTourDiary(from_search_button = false) {

        if (!this.zone) {
            var Message = 'Please select Zone';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        if (this.TourDiary.invalid) {
            const controls = this.TourDiary.controls;
            this.layoutUtilsService.alertElement('', 'Please Add Required Values')
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            return;
        }

        // if (!this.TourDiary.controls["Status"].value) {
        //     this.TourDiary.controls["Status"].setValue("All")
        // }
        if (from_search_button == true)
            this.OffSet = 0;
        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();
        // this.TourDiary.controls["StartDate"].setValue(this.datePipe.transform(this.TourDiary.controls["StartDate"].value, 'ddMMyyyy'))
        // this.TourDiary.controls["EndDate"].setValue(this.datePipe.transform(this.TourDiary.controls["EndDate"].value, 'ddMMyyyy'))
        this._TourDiary = Object.assign(this.TourDiary.value);
        this._TourDiary["StartDate"] = this.datePipe.transform(this.TourDiary.controls["StartDate"].value, 'ddMMyyyy');
        this._TourDiary["EndDate"] = this.datePipe.transform(this.TourDiary.controls["EndDate"].value, 'ddMMyyyy');

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
                    debugger
                    this.TourDiarys = baseResponse?.TourDiary?.TourDiaries;
                    this.dataSource.data =baseResponse?.TourDiary?.TourDiaries;

                    if (this.dataSource?.data?.length > 0)
                        this.matTableLenght = true;
                    else
                        this.matTableLenght = false;

                    this.dv = this.dataSource.data;
                    // this.totalItems = baseResponse.TourDiary.TourDiarysByDate[0].TotalRecords;
                    this.dataSource.data = this.dv
                    //this.dataSource = new MatTableDataSource(data);

                    // this.totalItems = baseResponse.JournalVoucher.JournalVoucherDataList.length;
                    this.OffSet = this.pageIndex;
                } else {

                    // if (this.dv != undefined) {
                    this.matTableLenght = false;
                    this.TourDiarys = [];
                    this.dataSource = this.dv?.splice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
                    // this.dataSource.data = [];
                    // this._cdf.detectChanges();
                    this.OffSet = 1;
                    this.pageIndex = 1;
                    this.dv = this.dv?.splice(1, 0);
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    // }
                }
            });
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



    async LoadLovs() {

        //this.ngxService.start();

        this.tourDiaryStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.UtilizationTypes})
        //
        this.tourDiaryStatusLov?.LOVs.forEach(function (value) {
            if (!value.Value)
                value.Value = "All";
        });


        ////For Bill type
        // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })

        // this.ngxService.stop();

    }

    getAllData(data) {

        if(Array.isArray(data.final_zone)){
            this.zone = data.final_zone[0];
        }
        else{
            this.zone = data.final_zone;
        }

        this.branch = data.final_branch;
    }

    dateChange(date: string) {
        var day = date?.slice(0, 2),
            month = date?.slice(2, 4),
            year = date?.slice(4, 8);
        return day + "-" + month + "-" + year;
    }
}
