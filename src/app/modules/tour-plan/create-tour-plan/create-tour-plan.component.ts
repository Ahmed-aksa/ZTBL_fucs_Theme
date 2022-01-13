import {Component, OnInit, Input, forwardRef, ChangeDetectionStrategy, Injector, Inject, ViewChild} from '@angular/core';
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
import { BehaviorSubject } from 'rxjs';
import { AppInjector } from '../tour-plan.module';
import { MatPaginator } from '@angular/material/paginator';

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
      pageIndex = 1;
      @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

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
            //this.GetHolidays(data);
        })
        this.disAbleDate = [];
    }

    async getPurposeofVisitLov() {
        var lovData = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.TourPlanPurpose});
        this.purposeofVisitLov = lovData.LOVs;

    }

    private createForm() {
        this.tourPlanForm = this.fb.group({
            TourPlanId: [],
            CircleName: [],
            VisitedDate: ["",  Validators.required],
            Purpose: ["", Validators.required],
            Remarks: ["", Validators.required],
            Status: [""],
        });
        //this.GetHolidays(new Date());

    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    // setVisitedDate() {
    //     var VisitedDate = this.tourPlanForm.controls.VisitedDate.value;
    //     if (VisitedDate._isAMomentObject == undefined) {
    //         try {
    //             var day = this.tourPlanForm.controls.VisitedDate.value.getDate();
    //             var month = this.tourPlanForm.controls.VisitedDate.value.getMonth() + 1;
    //             var year = this.tourPlanForm.controls.VisitedDate.value.getFullYear();
    //             if (month < 10) {
    //                 month = "0" + month;
    //             }
    //             if (day < 10) {
    //                 day = "0" + day;
    //             }
    //             VisitedDate = day + "" + month + "" + year;
    //             const branchWorkingDate = new Date(year, month - 1, day);
    //             this.GetHolidays(branchWorkingDate);
    //             this.VisitedDate = VisitedDate;
    //             this.tourPlanForm.controls.VisitedDate.setValue(branchWorkingDate)
    //         } catch (e) {
    //         }
    //     } else {
    //         try {
    //             var day = this.tourPlanForm.controls.VisitedDate.value.toDate().getDate();
    //             var month = this.tourPlanForm.controls.VisitedDate.value.toDate().getMonth() + 1;
    //             var year = this.tourPlanForm.controls.VisitedDate.value.toDate().getFullYear();
    //             if (month < 10) {
    //                 month = "0" + month;
    //             }
    //             if (day < 10) {
    //                 day = "0" + day;
    //             }
    //             VisitedDate = day + "" + month + "" + year;
    //             const branchWorkingDate = new Date(year, month - 1, day);
    //             this.GetHolidays(branchWorkingDate);
    //             this.VisitedDate = VisitedDate;
    //             this.tourPlanForm.controls.VisitedDate.setValue(branchWorkingDate);
    //         } catch (e) {
    //         }
    //     }

    // }

    // dateFilter = (d: Date) => {
    //     if (!d) {
    //         return;
    //     }
    //     var date = new Date(d);
    //     var isTrue = this.disAbleDate.indexOf(+date.getDate()) == -1;
    //     console.log(isTrue);
    //     return isTrue;
    // };

    AddCal() {

        if (this.tourPlanForm.invalid) {
            const controls = this.tourPlanForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            return;
        }
        debugger;
        var v = JSON.stringify(this.tourPlanForm.value)
        this.TourPlan = Object.assign(this.tourPlanForm.value);
        // this.TourPlan.VisitedDate = this.VisitedDate;
        this.TourPlan.Status = "P";
        this.tourPlanService
            .createTourPlan(this.TourPlan)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe(
                (baseResponse) => {
                    if (baseResponse.Success) {
                        this.tragetList = [];
                        this.tragetList = baseResponse.TourPlan.TourPlans;
                        this.layoutUtilsService.alertElementSuccess(
                            "",
                            baseResponse.Message,
                            baseResponse.Code = null
                        );
                        this.tourPlanForm.reset()
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

        var year=new Date();
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
            if(result?.data?.data?.date)
            this.tourPlanForm.controls["VisitedDate"].setValue(this.datepipe.transform( new Date(result.data.data.date), 'dd/MM/yyyy'))
            let TourPlanSchedule=result.data?.TourPlanSchedule?.TourPlanSchedule;
            debugger;
            if(TourPlanSchedule==1){
                var startDate = moment(new Date(result.data.data.date)).startOf('day');
                var endDate = moment(new Date(result.data.data.date)).endOf('day');
                this.SearchTourPlan(startDate.format('YYYY-MM-DD'),endDate.format('YYYY-MM-DD'))
            }

            if(TourPlanSchedule==2){
                var startDate = moment(new Date(result.data.data.date)).startOf('week');
                var endDate = moment(new Date(result.data.data.date)).endOf('week')
                this.SearchTourPlan(startDate.format('YYYY-MM-DD'),endDate.format('YYYY-MM-DD'))
            }
            if(TourPlanSchedule==3){
                var startDate = moment(new Date(result.data.data.date)).startOf('month');
                var endDate = moment(new Date(result.data.data.date)).endOf('month');
                this.SearchTourPlan(startDate.format('YYYY-MM-DD'),endDate.format('YYYY-MM-DD'))
            }
        });

    };

    SearchTourPlan(startDate, endDate) {

        this.spinner.show();
        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();
        // zone: any;
        // circle: any;
        this.TourPlan = Object.assign(this.tourPlanForm.value);
        var TourPlan = {
            "CircleId":this.TourPlan?.CircleId,
            "StartDate": this.targetPlan.dateFormte(startDate),
            "EndDate": this.targetPlan.dateFormte(endDate),
            "Status": "P",
            "Limit": 10,
            "Offset": 0
            
        }
        this.tourPlanService.SearchTourPlan(TourPlan, count, currentIndex, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.OffSet = this.pageIndex;
                    //this.dataSource = this.dv.slice(0, this.itemsPerPage);
                } else {

                    
                }
            });
    }



    // Function to call when the input is touched (when a star is clicked).
    // onTouched = () => {
    // };

    // display(id, display) {
    //     if (!display) {
    //         return;
    //     }
    //     let current_display = document.getElementById('table_' + id).style.display;
    //     if (current_display == 'none') {
    //         document.getElementById('table_' + id).style.display = 'block';
    //     } else {
    //         document.getElementById('table_' + id).style.display = 'none';
    //     }
    // }

    // addTragetLitsChileDto(index) {
    //     if (!this.tragetLitsPartnentDto[index].tragetLitsChileDto) {
    //         this.tragetLitsPartnentDto[index].tragetLitsChileDto = [];
    //     }
    //     this.tragetLitsPartnentDto[index].tragetLitsChileDto.push(new TragetLitsChileDto())
    // }
    // setClass() {
    //     return (date: any) => {
    //         if (date.getDate() == 1)
    //             this.changeMonth(date);
    //     };
    // }
    // changeMonth(date: Date) {
    //     //debugger;
    //     //this.GetHolidays(date);
    // }
    
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
