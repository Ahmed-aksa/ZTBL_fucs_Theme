import {
    Component,
    OnInit,
    Input,
    forwardRef,
    ChangeDetectionStrategy,
    Injector,
    Inject,
    ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LayoutUtilsService} from "../../../shared/services/layout-utils.service";
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
    selector: 'create-tour-plan',
    templateUrl: './create-tour-plan.component.html',
    styleUrls: ['./create-tour-plan.component.scss'],
})
export class CreateTourLlanComponent implements OnInit {
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

    constructor(private fb: FormBuilder, public dialog: MatDialog, private _lovService: LovService,
                private layoutUtilsService: LayoutUtilsService,
                private tourPlanService: TourPlanService,
                private targetPlan: TargetTourplanService,
                private spinner: NgxSpinnerService,
                public datepipe: DatePipe
    ) {
    }

    ngOnInit(): void {
        this.createForm();
        this.getPurposeofVisitLov();
        this.targetPlan.closeCalendarSource.subscribe((data) => {
        })
        this.disAbleDate = [];
    }

    controlReset(){
        this.tourPlanForm.controls['CircleName'].reset()
        this.tourPlanForm.controls['VisitedDate'].reset()
        this.tourPlanForm.controls['Purpose'].reset()
        this.tourPlanForm.controls['Remarks'].reset()
        this.tourPlanForm.controls['Status'].reset()
    }

    async getPurposeofVisitLov() {
        var lovData = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.TourPlanPurpose});
        this.purposeofVisitLov = lovData.LOVs;

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
            return;
        }
        var v = JSON.stringify(this.tourPlanForm.value)
        this.TourPlan = Object.assign(this.tourPlanForm.value);
        this.TourPlan.Status = "P";
        //this.startDate.format('YYYY-MM-DD'), this.endDate.format('YYYY-MM-DD')
        this.startDate = this.datepipe.transform(this.startDate, 'YYYY-MM-dd');
        this.endDate = this.datepipe.transform(this.endDate, 'YYYY-MM-dd')
        this.tourPlanService
            .createTourPlan(this.TourPlan, this.zone, this.branch, this.circle, this.startDate, this.endDate)
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
        var year = new Date();
        var y = year.getFullYear(), m = year.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        var startDate = this.datepipe.transform(firstDay, 'yyyy-MM-dd')
        var endDate = this.datepipe.transform(lastDay, 'yyyy-MM-dd')
        var daylist = this.targetPlan.getDaysArray(new Date(startDate), new Date(endDate));
        const dialogRef = this.dialog.open(CreateTourPlanPopupComponent, {
            width: '60%',
            data: {daylist, year},
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe(result => {
            debugger
            if (result?.data?.data == 0)
                return;
            if (result?.data?.data?.date)
                this.tourPlanForm.controls["VisitedDate"].setValue(this.datepipe.transform(new Date(result.data.data.date), 'YYYY-MM-dd'))
            let TourPlanSchedule = result.data?.TourPlanSchedule?.TourPlanSchedule;
            if (TourPlanSchedule == 1) {
                this.startDate = moment(new Date(result.data.data.date)).startOf('day');
                this.endDate = moment(new Date(result.data.data.date)).endOf('day');

                this.startDate = this.datepipe.transform(this.startDate,'YYYY-MM-dd');
                this.endDate = this.datepipe.transform(this.endDate,'YYYY-MM-dd');

                //this.SearchTourPlan(this.startDate.format('YYYY-MM-dd'), this.endDate.format('YYYY-MM-dd'))
                this.SearchTourPlan(this.startDate, this.endDate)
            }
            if (TourPlanSchedule == 2) {
                this.startDate = moment(new Date(result.data.data.date)).startOf('week');
                this.endDate = moment(new Date(result.data.data.date)).endOf('week')

                this.startDate = this.datepipe.transform(this.startDate,'YYYY-MM-dd');
                this.endDate = this.datepipe.transform(this.endDate,'YYYY-MM-dd');

                //this.SearchTourPlan(this.startDate.format('YYYY-MM-dd'), this.endDate.format('YYYY-MM-dd'))
                this.SearchTourPlan(this.startDate, this.endDate)
            }
            if (TourPlanSchedule == 3) {
                this.startDate = moment(new Date(result.data.data.date)).startOf('month');
                this.endDate = moment(new Date(result.data.data.date)).endOf('month');

                this.startDate = this.datepipe.transform(this.startDate,'YYYY-MM-dd');
                this.endDate = this.datepipe.transform(this.endDate,'YYYY-MM-dd');

                //this.SearchTourPlan(this.startDate.format('YYYY-MM-dd'), this.endDate.format('YYYY-MM-dd'))
                this.SearchTourPlan(this.startDate, this.endDate)
            }
        });

    };

    SearchTourPlan(startDate, endDate) {
        debugger
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
        this.tourPlanService.GetScheduleBaseTourPlan(TourPlan, count, currentIndex, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.OffSet = this.pageIndex;
                    this.tragetList = baseResponse.TourPlan.TourPlans;
                } else {


                }
            });
    }

    editTourPlan(item) {
        this.tourPlanForm.get('TourPlanId').patchValue(item.TourPlanId);
        this.tourPlanForm.get('ZoneId').patchValue(item.ZoneId);
        this.tourPlanForm.get('BranchCode').patchValue(item?.BranchCode);
        this.tourPlanForm.get('CircleId').patchValue(item.CircleId);
        this.tourPlanForm.get('VisitedDate').patchValue(item.VisitedDate);
        this.tourPlanForm.get('Purpose').patchValue(item.Purpose);
        this.tourPlanForm.get('Remarks').patchValue(item.Remarks);
    }

    paginate(event: any) {
        debugger
        this.pageIndex = event;
        this.tragetList = this.dataValue.slice(
            event * this.itemsPerPage - this.itemsPerPage,
            event * this.itemsPerPage
        );
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

}

export class TragetLits {
    BranchId: any
    CircleId: any
    Purpose: any
    Remarks: any
    Status: any
    TotalRecords: any
    TourPlanId: any
    UserId: any
    VisitedDate: any
    ZoneId: any
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
    styleUrls: ['./create-tour-plan.component.scss'],
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
