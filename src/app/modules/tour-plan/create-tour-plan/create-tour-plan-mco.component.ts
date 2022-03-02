import {
    Component,
    OnInit,
    Input,
    forwardRef,
    ChangeDetectionStrategy,
    Injector,
    Inject,
    ViewChild, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {TourPlan} from '../Model/tour-plan.model';
import {TourPlanService} from "../Service/tour-plan.service";
import {CircleService} from "../../../shared/services/circle.service";
import {CommonService} from "../../../shared/services/common.service";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Circle} from 'app/shared/models/circle.model';
import {Branch} from 'app/shared/models/branch.model';
import {Zone} from 'app/shared/models/zone.model';
import {SlashDateFormats} from "../../../shared/models/slash-format.class";
import {CreateTourPlanPopupComponent} from './create-tour-plan-popup/create-tour-plan-popup.component';
import {LovService} from 'app/shared/services/lov.service';
import {Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';

import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import {MatDatepicker} from '@angular/material/datepicker/datepicker';
import {MatCalendarHeader} from '@angular/material/datepicker';
import {TargetTourplanService} from "./tragetTourPlan.service";
import {BehaviorSubject} from 'rxjs';
import {AppInjector} from '../tour-plan.module';
import {MatPaginator} from '@angular/material/paginator';
import {} from "inspector";
import {AlertDialogConfirmationComponent} from "../../../shared/crud";
import {ToastrService} from "ngx-toastr";
import {Activity} from "../../../shared/models/activity.model";

const moment = _rollupMoment || _moment;

// export const MY_FORMATS = {
//     parse: {
//         dateInput: 'MM/YYYY',
//     },
//     display: {
//         dateInput: 'MM/YYYY',
//         monthYearLabel: 'MMM YYYY',
//         dateA11yLabel: 'LL',
//         monthYearA11yLabel: 'MMMM YYYY',
//     },
// };

// export let AppInjector: Injector;


@Component({
    selector: 'create-tour-plan-mco',
    templateUrl: './create-tour-plan-mco.component.html',
    styleUrls: ['./create-tour-plan-mco.component.scss'],
})
export class CreateTourPlanMcoComponent implements OnInit, OnDestroy {
    tourPlanForm: FormGroup;
    exampleHeader = ExampleHeader
    branch: any;
    zone: any;
    circle: any;
    timeStatus: any;
    date = new FormControl();
    minDate = new Date();
    Purpose: any;
    Remarks: any;
    VisitedDate;
    public LovCall = new Lov();
    purposeofVisitLov: any;
    TourPlan = new TourPlan;
    tragetList: Array<TragetLits>;
    tragetLitsPartnentDto: Array<TragetLitsPartnentDto>;
    disAbleDate: any = []
    // Pagination
    Limit: any;
    OffSet: number = 0;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    dataValue: any
    pageIndex = 1;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    startDate: any;
    endDate: any;
    navigationSubscription: any;
    showSubmit: boolean = false;
    // edit from search
    isEdit: any = null;
    EditViewMode: boolean = false;
    tourPlanEditView: any;
    tourPlanSubmit: any = {};
    //upflag object
    upFlag: any;
    viewMode = false;

    btnText = 'Add';
    private TourPlanSchedule: any;
    currentActivity: Activity

    constructor(private fb: FormBuilder, public dialog: MatDialog, private _lovService: LovService,
                private layoutUtilsService: LayoutUtilsService,
                private tourPlanService: TourPlanService,
                private targetPlan: TargetTourplanService,
                private spinner: NgxSpinnerService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private cdRef: ChangeDetectorRef,
                public datepipe: DatePipe,
                public toastr: ToastrService,
                private userUtilsService: UserUtilsService
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;

        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                //this.initialiseInvites();
            }
        });

        var CheckEdit = localStorage.getItem("EditTourPlan");
        if (CheckEdit == '0') {
            localStorage.setItem("SearchTourPlan", "");
        }
    }

    ngOnInit(): void {
        
        this.currentActivity = this.userUtilsService.getActivity('Create Tour Plan For MCO')
        this.createForm();
        this.getPurposeofVisitLov();
        this.targetPlan.closeCalendarSource.subscribe((data) => {
        })
        this.disAbleDate = [];

        var upFlag = this.activatedRoute.snapshot.params['upFlag'];
        this.isEdit = localStorage.getItem("EditViewTourPlan");
        let visibility = localStorage.getItem('Visibility')

        if (this.isEdit != null && this.isEdit != "0") {
            this.tourPlanEditView = JSON.parse(localStorage.getItem("SearchTourPlan"));
            this.EditViewMode = true;
            if (visibility == 'true') {
                this.viewMode = true
            } else {
                this.viewMode = false
            }
        }

        this.upFlag = upFlag
        if (upFlag == "1" && this.isEdit == "1") {

            localStorage.setItem('EditViewTourPlan', '0');
            localStorage.removeItem('SearchTourPlan')
            this.spinner.show();
            setTimeout(() => this.editTourPlan(this.tourPlanEditView), 1000);
        }

    }

    controlReset() {
        this.tourPlanForm.controls['TourPlanId'].reset()
        this.tourPlanForm.controls['CircleId'].reset()
        this.tourPlanForm.controls['VisitedDate'].reset()
        this.tourPlanForm.controls['Purpose'].reset()
        this.tourPlanForm.controls['Remarks'].reset()
        this.tourPlanForm.controls['Status'].reset()
        this.btnText = 'Add';
    }

    async getPurposeofVisitLov() {
        var lovData: any = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.TourPlanPurpose});
        this.purposeofVisitLov = lovData.LOVs.sort((a, b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0));
        console.log(this.purposeofVisitLov)

    }

    private createForm() {
        this.tourPlanForm = this.fb.group({
            TourPlanId: [],
            CircleName: [],
            VisitedDate: ["", Validators.required],
            Purpose: ["", Validators.required],
            Remarks: ["", Validators.required],
            Status: [""],
        });

    }


    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    AddCal() {

        if (this.tourPlanForm.invalid) {
            const controls = this.tourPlanForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            for (let el in this.tourPlanForm.controls) {
                if (this.tourPlanForm.controls[el].errors) {
                    this.toastr.error("Please add " + el);
                    return;
                }
            }
            return;
        }

        var v = JSON.stringify(this.tourPlanForm.value)
        this.TourPlan = Object.assign(this.tourPlanForm.value);
        if (this.tourPlanForm.controls.Status.value == 'R') {
            this.TourPlan.Status = "S";
        } else {
            this.TourPlan.Status = "P";
        }
        //this.startDate.format('YYYY-MM-DD'), this.endDate.format('YYYY-MM-DD')
        this.startDate = this.datepipe.transform(this.startDate, 'YYYY-MM-dd');
        this.endDate = this.datepipe.transform(this.endDate, 'YYYY-MM-dd')

        this.spinner.show()
        this.tourPlanService
            .createTourPlan(this.TourPlan, this.zone, this.branch, this.circle, this.startDate, this.endDate, 'MCO')
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe(
                (baseResponse) => {
                    if (baseResponse.Success) {
                        this.tragetList = [];
                        this.tragetList = baseResponse.TourPlan.TourPlans;
                        this.dataValue = this.tragetList;
                        this.totalItems = this.tragetList.length
                        this.tragetList = this.dataValue?.slice(0, this.itemsPerPage);
                        this.layoutUtilsService.alertElementSuccess(
                            "",
                            baseResponse.Message,
                            baseResponse.Code = null
                        );
                        this.controlReset();

                        if (this.showSubmit != true) {
                            this.showSubmit = true
                        }

                        if (this.EditViewMode == true) {
                            this.EditViewMode = false;
                        }
                    } else {
                        this.layoutUtilsService.alertElement(
                            "",
                            baseResponse.Message,
                            baseResponse.Code = null
                        );
                    }
                });
    }


    onChange = () => {
        if (!this.zone ) {
            var Message = 'Please select Zone';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        var year = new Date();
        var y = year.getFullYear(), m = year.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        var startDate = this.datepipe.transform(firstDay, 'yyyy-MM-dd')
        var endDate = this.datepipe.transform(lastDay, 'yyyy-MM-dd')
        var daylist = this.targetPlan.getDaysArray(new Date(startDate), new Date(endDate));
        var zone = this.zone;

        const dialogRef = this.dialog.open(CreateTourPlanPopupComponent, {
            width: '60%',
            data: {daylist, year, zone},
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result?.data?.data == 0)
                return;
            if (result?.data?.data?.date)
                this.tourPlanForm.controls["VisitedDate"].setValue(this.datepipe.transform(new Date(result.data.data.date), 'YYYY-MM-dd'))
            this.TourPlanSchedule = result.data?.TourPlanSchedule?.TourPlanSchedule;
            if (this.TourPlanSchedule == 1) {
                this.startDate = moment(new Date(result.data.data.date)).startOf('day');
                this.endDate = moment(new Date(result.data.data.date)).endOf('day');

                this.startDate = this.datepipe.transform(this.startDate, 'YYYY-MM-dd');
                this.endDate = this.datepipe.transform(this.endDate, 'YYYY-MM-dd');

                //this.SearchTourPlan(this.startDate.format('YYYY-MM-dd'), this.endDate.format('YYYY-MM-dd'))
                this.SearchTourPlan(this.startDate, this.endDate)
            }
            if (this.TourPlanSchedule == 2) {
                this.startDate = moment(new Date(result.data.data.date)).startOf('week');
                this.endDate = moment(new Date(result.data.data.date)).endOf('week')

                this.startDate = this.datepipe.transform(this.startDate, 'YYYY-MM-dd');
                this.endDate = this.datepipe.transform(this.endDate, 'YYYY-MM-dd');

                //this.SearchTourPlan(this.startDate.format('YYYY-MM-dd'), this.endDate.format('YYYY-MM-dd'))
                this.SearchTourPlan(this.startDate, this.endDate)
            }
            if (this.TourPlanSchedule == 3) {
                this.startDate = moment(new Date(result.data.data.date)).startOf('month');
                this.endDate = moment(new Date(result.data.data.date)).endOf('month');

                this.startDate = this.datepipe.transform(this.startDate, 'YYYY-MM-dd');
                this.endDate = this.datepipe.transform(this.endDate, 'YYYY-MM-dd');

                //this.SearchTourPlan(this.startDate.format('YYYY-MM-dd'), this.endDate.format('YYYY-MM-dd'))
                this.SearchTourPlan(this.startDate, this.endDate)
            }
        });

    };

    SearchTourPlan(startDate, endDate) {

        if (!this.zone && this.isEdit!='1') {
            var Message = 'Please select Zone';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        this.spinner.show();
        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();
        this.TourPlan = Object.assign(this.tourPlanForm.value);
        var TourPlan = {
            "CircleId": this.TourPlan?.CircleId,
            "StartDate": this.targetPlan.dateFormte(startDate),
            "EndDate": this.targetPlan.dateFormte(endDate),
            "Status": "P",
            "Limit": 10,
            "Offset": 0

        }


        this.tourPlanService.GetScheduleBaseTourPlan(TourPlan, count, currentIndex, this.branch, this.zone, 'MCO')
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.OffSet = this.pageIndex;
                    this.tragetList = baseResponse.TourPlan.TourPlans;
                    this.showSubmit = true;
                } else {
                    this.tragetList = []
                }
            });
    }

    editTourPlan(item) {

        var visitDate;
        console.log(item)
        this.tourPlanForm.get('TourPlanId').patchValue(item?.TourPlanId);
        this.tourPlanForm.get('ZoneId').patchValue(item?.ZoneId);
        console.log(this.branch)
        if (this.branch?.BranchId == item?.BranchId) {
            this.tourPlanForm.get('BranchCode').patchValue(this.branch?.BranchCode);
        }
        this.tourPlanForm.get('CircleId').patchValue(item?.CircleId?.toString());

        visitDate = item.VisitedDate;
        var day = visitDate.slice(0, 2), month = visitDate.slice(2, 4), year = visitDate.slice(4, 8);
        visitDate = year + "-" + month + "-" + day;
        this.tourPlanForm.get('VisitedDate').patchValue(visitDate);
        this.tourPlanForm.get('Status').patchValue(item?.Status);

        if (item?.Status == 'R') {
            this.btnText = 'Submit';
        } else {
            this.btnText = 'Update';
        }

        if (this.EditViewMode == true) {
            this.startDate = moment(new Date(visitDate)).startOf('week');
            this.endDate = moment(new Date(visitDate)).endOf('week')

            this.startDate = this.datepipe.transform(this.startDate, 'YYYY-MM-dd');
            this.endDate = this.datepipe.transform(this.endDate, 'YYYY-MM-dd');
            this.SearchTourPlan(this.startDate, this.endDate)
        }

        this.tourPlanForm.get('Purpose').patchValue(item.Purpose);
        this.tourPlanForm.get('Remarks').patchValue(item.Remarks);
    }

    checkStatus(item, action) {
        if (action == 'edit') {
            if (item.Status == 'P' || item.Status == 'R') {
                return true;
            } else {
                return false;
            }
        }
        if (action == 'delete') {
            if (item.Status == 'P' || item.Status == 'R') {
                return true;
            } else {
                return false;
            }
        }
        if (action == 'submit') {
            if (item.Status == 'P' || item.Status == 'R') {
                return true;
            } else {
                return false;
            }
        }
    }

    deleteTourPlan(item) {


        let dialogRef = this.layoutUtilsService.AlertElementConfirmation("Do you really want to delete the Tour Plan?");
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                this.spinner.show();

                this.TourPlan = item;
                this.TourPlan.Status = 'C';
                this.tourPlanService
                    .ChanageTourStatus(this.TourPlan, 'MCO')
                    .pipe(finalize(() => {
                        this.spinner.hide();
                    }))
                    .subscribe(
                        (baseResponse) => {
                            if (baseResponse.Success) {
                                this.tragetList = [];
                                this.SearchTourPlan(this.startDate, this.endDate);
                                this.controlReset()
                                this.layoutUtilsService.alertElementSuccess(
                                    "",
                                    baseResponse.Message,
                                    baseResponse.Code = null
                                );
                            } else {
                                this.layoutUtilsService.alertElement(
                                    "",
                                    baseResponse.Message,
                                    baseResponse.Code = null
                                );
                            }
                        });
            } else {
                return
            }
        })

    }


    submitTourPlan() {
        let type = '';
        if (this.TourPlanSchedule == 1) {
            type = 'Daily';
        } else if (this.TourPlanSchedule == 2) {
            type = 'Weekly';
        } else {
            type = 'Monthly';
        }
        let dialogRef = this.layoutUtilsService.AlertElementConfirmation('Confirmation', `Tour Plan submission schedule is : <strong>${type}</strong><br>Make sure you have added the Tour Plan From: <strong>${moment(this.startDate).format('DD-MM-YYYY')}</strong> To: <strong>${moment(this.endDate).format('DD-MM-YYYY')}</strong> <br> Once the Tour Plan is submitted, You will no longer be able to add Tour Plan in this date range`);
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {

                this.spinner.show();
                this.tourPlanSubmit = this.tragetList;
                this.TourPlan.Status = 'S';
                this.tourPlanSubmit.Status = this.TourPlan.Status
                this.tourPlanService
                    .ChanageTourStatusMultiple(this.tourPlanSubmit, 'MCO')
                    .pipe(finalize(() => {
                        this.spinner.hide();
                    }))
                    .subscribe(
                        (baseResponse) => {
                            if (baseResponse.Success) {
                                this.tragetList = [];
                                this.tragetList = baseResponse.TourPlan.TourPlans;
                                this.dataValue = this.tragetList;
                                this.totalItems = this.tragetList.length
                                this.tragetList = this.dataValue?.slice(0, this.itemsPerPage);
                                this.layoutUtilsService.alertElementSuccess(
                                    "",
                                    baseResponse.Message,
                                    baseResponse.Code = null
                                );
                                this.controlReset();
                                this.showSubmit = false;
                            } else {
                                this.layoutUtilsService.alertElement(
                                    "",
                                    baseResponse.Message,
                                    baseResponse.Code = null
                                );
                            }
                        });
            } else {
                return
            }
        })
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {

        this.pageIndex = pageIndex;
        this.tragetList = this.dataValue.slice(
            pageIndex * this.itemsPerPage - this.itemsPerPage,
            pageIndex * this.itemsPerPage
        );
    }

    // getStatus(status: string) {
    //
    //     if (status == 'P') {
    //         return "Submit";
    //     } else if (status == 'N') {
    //         return "Pending";
    //     } else if (status == 'S') {
    //         return "Submitted";
    //     } else if (status == 'A') {
    //         return "Authorized";
    //     } else if (status == 'R') {
    //         return "Refer Back";
    //     }
    // }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    dateChange(date: string) {
        var day = date.slice(0, 2),
            month = date.slice(2, 4),
            year = date.slice(4, 8);
        return day + "-" + month + "-" + year;
    }

}

export class TragetLits {
    BranchId: any
    CircleId: any
    CircleCode: any
    Purpose: any
    Remarks: any
    Status: any
    StatusName: any
    TotalRecords: any
    TourPlanId: any
    UserId: any
    VisitedDate: any
    ZoneId: any
    ZoneName: any;
    BranchName: any;
}

export class TragetLitsPartnentDto {
    date: any
    tragetLitsChileDto: Array<TragetLitsChileDto> = new Array<TragetLitsChileDto>();

}

export class TragetLitsChileDto {
    Purpose: any
    Remarks: any
}


/** Custom header component for datepicker. */
@Component({
    selector: 'example-header',
    styleUrls: ['./create-tour-plan-mco.component.scss'],
    template: `
        <div class="mat-calendar-header">
            <div class="mat-calendar-controls">
                <!-- <button mat-button type="button" class="mat-calendar-period-button"
                        (click)="currentPeriodClicked()" [attr.aria-label]="periodButtonLabel"
                        cdkAriaLive="polite">
                  {{periodButtonText}}
                  <div class="mat-calendar-arrow"
                       [class.mat-calendar-invert]="calendar.currentView != 'month'"></div>
                </button> -->

                <div class="mat-calendar-spacer"></div>

                <ng-content></ng-content>

                <button mat-icon-button type="button" class="mat-calendar-previous-button mr-3 text-green font-bold"
                        [disabled]="!previousEnabled()" (click)="customPrev()"
                        [attr.aria-label]="prevButtonLabel"><
                </button>

                <button mat-icon-button type="button" class="mat-calendar-next-button  text-green font-bold"
                        [disabled]="!nextEnabled()" (click)="customNext()"
                        [attr.aria-label]="nextButtonLabel">
                    >
                </button>
            </div>
        </div>  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleHeader extends MatCalendarHeader<any> {


    currentPeriodClicked(): void {
        this.calendar.currentView = this.calendar.currentView == 'month' ? 'multi-year' : 'month';
    }

    customPrev(): void {
        //const obj = AppInjector.get(TargetTourplanService);
        //obj.closeCalander(this.calendar.activeDate)
        this.previousClicked()
    }

    customNext(): void {
        const obj = AppInjector.get(TargetTourplanService);
        //var date =this.calendar.activeDate;
        // obj.closeCalander(date)
        this.nextClicked()
    }

}
