import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { UserUtilsService } from "../../../shared/services/users_utils.service";
import { LayoutUtilsService } from "../../../shared/services/layout-utils.service";
import { TourPlan } from '../Model/tour-plan.model';
import { TourPlanService } from "../Service/tour-plan.service";
import { CircleService } from "../../../shared/services/circle.service";
import { CommonService } from "../../../shared/services/common.service";
import { BaseResponseModel } from "../../../shared/models/base_response.model";
import { Circle } from 'app/shared/models/circle.model';
import { Branch } from 'app/shared/models/branch.model';
import { Zone } from 'app/shared/models/zone.model';
import { SlashDateFormats } from "../../../shared/models/slash-format.class";
import { CreateTourPlanPopupComponent } from './create-tour-plan-popup/create-tour-plan-popup.component';
import { LovService } from 'app/shared/services/lov.service';
import { Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';

import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker/datepicker';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
      },
      display: {
        dateInput: 'YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      },
};


@Component({
    selector: 'create-tour-plan',
    templateUrl: './create-tour-plan.component.html',
    styleUrls: ['./create-tour-plan.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'pt' },
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => CreateTourLlanComponent),
          multi: true,
        },
      ],
})
export class CreateTourLlanComponent implements OnInit {
    tourPlanForm: FormGroup;

    branch: any;
    zone: any;
    circle: any;
    timeStatus: any;
    //date = new Date();
    date = new FormControl(moment());
    minDate = new Date();
    Purpose: any;
    Remarks: any;
    VisitedDate;
    public LovCall = new Lov();
    purposeofVisitLov: any;
    TourPlan = new TourPlan;
    tragetList: Array<TragetLits>;
    constructor(private fb: FormBuilder, public dialog: MatDialog, private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private tourPlanService: TourPlanService,
        private spinner: NgxSpinnerService,
    ) {
    }

    ngOnInit(): void {
        this.createForm();
        this.getPurposeofVisitLov()
    }
    async getPurposeofVisitLov() {
        var lovData = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.TourPlanPurpose });
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

    setVisitedDate() {
        var VisitedDate = this.tourPlanForm.controls.VisitedDate.value;
        if (VisitedDate._isAMomentObject == undefined) {
            try {
                var day = this.tourPlanForm.controls.VisitedDate.value.getDate();
                var month = this.tourPlanForm.controls.VisitedDate.value.getMonth() + 1;
                var year = this.tourPlanForm.controls.VisitedDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                VisitedDate = day + "" + month + "" + year;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.VisitedDate = VisitedDate;
                this.tourPlanForm.controls.VisitedDate.setValue(branchWorkingDate)
            } catch (e) {
            }
        } else {
            try {
                var day = this.tourPlanForm.controls.VisitedDate.value.toDate().getDate();
                var month = this.tourPlanForm.controls.VisitedDate.value.toDate().getMonth() + 1;
                var year = this.tourPlanForm.controls.VisitedDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                VisitedDate = day + "" + month + "" + year;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.VisitedDate = VisitedDate;
                this.tourPlanForm.controls.VisitedDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }

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
        this.TourPlan.VisitedDate = this.VisitedDate;
        this.TourPlan.Status = "P";
        this.tourPlanService
            .createTourPlan(this.TourPlan)
            .pipe(finalize(() => {
                this.tragetList = [];
                this.spinner.hide();
            }))
            .subscribe(
                (baseResponse) => {
                    if (baseResponse.Success) {
                        this.tragetList = baseResponse.TourPlan.TourPlans;
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

    }

    // debugger
    // var date1 =  this.date;
    // console.log(this.daysBetween(this.date, date1));
    // const dialogRef = this.dialog.open(CreateTourPlanPopupComponent, {
    //     height: '40%',
    //     width: '60%',
    //     data: {},
    //     disableClose: true,

    // });
    // daysBetween(startDate, endDate) {
    //     var millisecondsPerDay = 24 * 60 * 60 * 1000;
    //     endDate = this.treatAsUTC(endDate);
    //     startDate = this.treatAsUTC(startDate);
    //     var days = (endDate - startDate) / millisecondsPerDay;
    //     return days
    // }

    // treatAsUTC(date: any) {
    //     var result = new Date(date);
    //     result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    //     return result;
    // }

 

    // chosenYearHandler(normalizedYear: Moment) {
    //   const ctrlValue = this.date.value;
    //   ctrlValue.year(normalizedYear.year());
    //   this.date.setValue(ctrlValue);
    // }
  
    // chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    //   const ctrlValue = this.date.value;
    //   ctrlValue.month(normalizedMonth.month());
    //   this.date.setValue(ctrlValue);
    //   datepicker.close();
    // }

    _openDatepickerOnClick(datepicker: MatDatepicker<Moment>) {
        if (!datepicker.opened) {
          datepicker.open();
        }
      }
      _takeFocusAway = (datepicker: MatDatepicker<Moment>) => { };
      
  _yearSelectedHandler(chosenDate: Moment, datepicker: MatDatepicker<Moment>) {
    datepicker.close();

    chosenDate.set({ date: 1 });

    this.date.setValue(chosenDate, { emitEvent: false });
    this.onChange(chosenDate.toDate());
    this.onTouched();
  }
   // Function to call when the date changes.
   onChange = (year: Date) => { 
    console.log(year.getFullYear());
    debugger;

   };

   // Function to call when the input is touched (when a star is clicked).
   onTouched = () => { };
   countries=couret;
   term:any
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

const couret=[
    {
      "name": "Russia",
      "flag": "f/f3/Flag_of_Russia.svg",
      "area": 17075200,
      "population": 146989754
    },
    {
      "name": "France",
      "flag": "c/c3/Flag_of_France.svg",
      "area": 640679,
      "population": 64979548
    },
    {
      "name": "Germany",
      "flag": "b/ba/Flag_of_Germany.svg",
      "area": 357114,
      "population": 82114224
    },
    {
      "name": "Canada",
      "flag": "c/cf/Flag_of_Canada.svg",
      "area": 9976140,
      "population": 36624199
    },
    {
      "name": "Vietnam",
      "flag": "2/21/Flag_of_Vietnam.svg",
      "area": 331212,
      "population": 95540800
    },
    {
      "name": "Mexico",
      "flag": "f/fc/Flag_of_Mexico.svg",
      "area": 1964375,
      "population": 129163276
    },
    {
      "name": "United States",
      "flag": "a/a4/Flag_of_the_United_States.svg",
      "area": 9629091,
      "population": 324459463
    },
    {
      "name": "India",
      "flag": "4/41/Flag_of_India.svg",
      "area": 3287263,
      "population": 1324171354
    }
]