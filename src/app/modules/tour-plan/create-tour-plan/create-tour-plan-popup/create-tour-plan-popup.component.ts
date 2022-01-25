import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {finalize, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from 'app/core/auth/auth.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {DatePipe} from '@angular/common';
import {TargetTourplanService} from '../tragetTourPlan.service';
import {TourPlanService} from '../../Service/tour-plan.service';
import moment from 'moment';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';

@Component({
    selector: 'create-tour-plan-popup',
    templateUrl: './create-tour-plan-popup.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CreateTourPlanPopupComponent implements OnInit {

    TragetForm: FormGroup;
    loading = false;
    errors: any = [];
    daylist: any = [];
    disAbleDate = []
    private unsubscribe: Subject<any>;
    startDate: any;
    TourPlanSchedule: any;

    constructor(
        private authService: AuthService,
        private toaster: ToastrService,
        private fb: FormBuilder,
        private auth: AuthService,
        public dialogRef: MatDialogRef<CreateTourPlanPopupComponent>,
        private spinner: NgxSpinnerService,
        public datepipe: DatePipe,
        private targetPlan: TargetTourplanService,
        private tourPlanService: TourPlanService,
        private layoutUtilsService: LayoutUtilsService,
        @Inject(MAT_DIALOG_DATA) public data: any = [],
    ) {
        this.unsubscribe = new Subject();
    }


    ngOnInit() {
        this.initRegistrationForm();
        this.startDate = this.data.year
        this.daylist = this.data.daylist
        this.disAbleDate = [];
        this.GetHolidays();
    }


    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.loading = false;
    }


    initRegistrationForm() {
        this.TragetForm = this.fb.group({
            Tragetdate: [null, Validators.required],
            traget: [null, Validators.required],
            propue: [null, Validators.required],
        });
    }

    submit(data: any) {
        debugger
        this.onCloseClick(data);


    }

    isControlHasError(controlName: string, validationType: string): boolean {
        const control = this.TragetForm.controls[controlName];

        if (!control) {
            return false;
        }

        const result =
            control.hasError(validationType) &&
            (control.dirty || control.touched);
        return result;
    }

    onCloseClick(data: any): void {
        var TourPlanSchedule = this.TourPlanSchedule;
        this.dialogRef.close({data: {TourPlanSchedule, data}}); // Keep only this row
    }

    GetHolidays() {
        debugger;
        var y = this.startDate.getFullYear(), m = this.startDate.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        var startDate = moment(firstDay).format("YYYY-MM-DD"); //this.datepipe.transform(firstDay, 'YYYY-MM-dd')
        var endDate = moment(lastDay).format("YYYY-MM-DD");// this.datepipe.transform(lastDay, 'YYYY-MM-dd')
        var daylist = this.targetPlan.getDaysArray(new Date(startDate), new Date(endDate));
        this.daylist = daylist;
        this.spinner.show();
        this.disAbleDate = [];
        this.tourPlanService.GetHolidays(this.targetPlan.dateFormte(startDate), this.targetPlan.dateFormte(endDate)).pipe(finalize(() => {
            this.spinner.hide();

        })).subscribe(result => {
            if (result.Success) {
                this.TourPlanSchedule = result.TourPlan;
                result.TourPlan.HolidaysByDate.forEach(element => {
                    this.disAbleDate.push(Number(element.HolidayDate.substr(0, 2)))
                });
            } else {
                this.layoutUtilsService.alertElement(
                    "",
                    result.Message,
                    result.Code = null
                );
            }

        });
    }

    foewardDate() {
        var new_date = moment(this.startDate, "DD-MM-YYYY").add(1, 'M');
        this.startDate = new_date.toDate();
        this.GetHolidays();

    }

    backDate() {

        var new_date = moment(this.startDate, "DD-MM-YYYY").add(-1, 'M');
        this.startDate = new_date.toDate();
        ;
        this.GetHolidays();
    }

    isCheckDisable(data: any, index: any) {
        var date = data.date
        if (this.dateFilter(date)) {
            this.daylist[index].isCheck = true
            return true;
        } else {
            var currentDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
            if (date == currentDate) {
                return false;
            } else {
                var ischeck = (moment(date).isSameOrBefore(moment(currentDate))); // true
                this.daylist[index].isCheck = ischeck
                return ischeck
            }
        }

    }

    dateFilter(d: any) {
        if (!d) {
            return;
        }
        var date = this.targetPlan.dateFormte(d)
        date = date.substr(0, 2);
        var isTrue = this.disAbleDate?.indexOf(+date) == -1;
        return !isTrue;
    };
}
