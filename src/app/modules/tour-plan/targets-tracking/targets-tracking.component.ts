import {Component, OnInit} from '@angular/core';
import moment, {Moment} from "moment";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {MatDatepicker} from "@angular/material/datepicker";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TourPlanService} from "../Service/tour-plan.service";

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'YYYY',
    },
};

@Component({
    selector: 'app-targets-tracking',
    templateUrl: './targets-tracking.component.html',
    styleUrls: ['./targets-tracking.component.scss'],
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})
export class TargetsTrackingComponent implements OnInit {
    targetTrackingForm: FormGroup;
    year = moment().format('DD-MMMM-YYYY');
    target_0: any;

    constructor(private formBuilder: FormBuilder, private trackingService: TourPlanService) {
    }

    ngOnInit(): void {
        this.createForm();
    }

    chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
        this.targetTrackingForm.value.date = normalizedYear.format('DD-MMMM-YYYY');
        this.year = normalizedYear.format('DD-MMMM-YYYY');
        datepicker.close();
    }

    private createForm() {
        this.targetTrackingForm = this.formBuilder.group({
            date: moment().format('DD-MMMM-YYYY'),
            search: ''
        })
    }

    getTargetTracks() {
        this.trackingService.getTargetsTracks(0, 0, this.year).subscribe((data) => {
            if (data.Success) {
                this.target_0 = data.Target;
            }
        });
    }
}
