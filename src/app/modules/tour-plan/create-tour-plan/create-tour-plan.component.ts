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
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker/datepicker';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
      },
      display: {
        dateInput: 'MM/YYYY',
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
    constructor(private fb: FormBuilder, public dialog: MatDialog, private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private tourPlanService: TourPlanService,
        private spinner: NgxSpinnerService,
        public datepipe: DatePipe
    ) {
    }

    ngOnInit(): void {
        this.createForm();
        this.getPurposeofVisitLov();
        this.disAbleDate = [];
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

    dateFormte(date) {
        if (date) {
            try {
                var myArray = date.split("-");
                var VisitedDate = myArray[2] + "" + myArray[1] + "" + myArray[0];
                return VisitedDate;

            } catch (e) {
            }
        }
    }

    _openDatepickerOnClick(datepicker: MatDatepicker<Moment>) {
        if (!datepicker.opened) {
            datepicker.open();
        }
    }
    _takeFocusAway = (datepicker: MatDatepicker<Moment>) => { };

    // _yearSelectedHandler(chosenDate: Moment, datepicker: MatDatepicker<Moment>) {

    //     chosenDate.set({ date: 1 });

    //     this.date.setValue(chosenDate, { emitEvent: false });
    //     this.onChange(chosenDate.toDate());
    //     this.onTouched();
    // }
    _selectMonthHandler(chosenDate: Moment, datepicker: MatDatepicker<Moment>) {
        datepicker.close();
        chosenDate.set({ date: 1 });

        this.date.setValue(chosenDate, { emitEvent: false });
        this.onChange(chosenDate.toDate());
        this.onTouched();
    }
    // Function to call when the date changes.
    onChange = (year: Date) => {
        debugger;
        var  y = year.getFullYear(), m = year.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        var startDate=this.datepipe.transform(firstDay, 'yyyy-MM-dd')
        var endDate=this.datepipe.transform(lastDay, 'yyyy-MM-dd')

        var daylist = this.getDaysArray(new Date(startDate), new Date(endDate));
        this.tourPlanService.GetHolidays(this.dateFormte(startDate), this.dateFormte(endDate)).pipe(finalize(() => { })).subscribe(result => {
            this.disAbleDate = result;

        });

        const dialogRef = this.dialog.open(CreateTourPlanPopupComponent, {
            width: '60%',
            data: { daylist },
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe(result => {
            this.tragetLitsPartnentDto = result.data.data
        });

    };

    getDaysArray(start, end) {
        for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
            arr.push({ date: new Date(dt).toISOString().slice(0, 10), isCheck: false }) //();
        }
        return arr;
    };

    // Function to call when the input is touched (when a star is clicked).
    onTouched = () => { };
    display(id, display) {

        if (!display) { 
            return;
        }
        
        debugger;
        let current_display = document.getElementById('table_' + id).style.display;
        if (current_display == 'none') {
            document.getElementById('table_' + id).style.display = 'block';
        }
        else {
            document.getElementById('table_' + id).style.display = 'none';
        }
    }
    addTragetLitsChileDto(index) {
        debugger
        if (!this.tragetLitsPartnentDto[index].tragetLitsChileDto) { 
            this.tragetLitsPartnentDto[index].tragetLitsChileDto = [];
        }
        this.tragetLitsPartnentDto[index].tragetLitsChileDto.push(new TragetLitsChileDto())
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



