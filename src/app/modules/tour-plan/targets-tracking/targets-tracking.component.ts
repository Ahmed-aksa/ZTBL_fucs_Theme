import {Component, OnInit} from '@angular/core';
import moment, {Moment} from "moment";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {MatDatepicker} from "@angular/material/datepicker";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TourPlanService} from "../Service/tour-plan.service";
import {MatExpansionPanel} from "@angular/material/expansion";
import {NgxSpinnerService} from "ngx-spinner";

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
    target_1: any;
    target_2: any;
    target_3: any;
    target_4: any;

    constructor(private formBuilder: FormBuilder, private trackingService: TourPlanService, private spinner: NgxSpinnerService) {
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

    getTargetTracks(id = 0, next = 0, index = 0, incoming_data = null) {
        this.spinner.show();
        this.trackingService.getTargetsTracks(id, next, this.year).subscribe((data) => {
            this.spinner.hide();
            if (data.Success) {
                if (next == 1) {
                    this.target_1 = data.Target.Heading;
                } else if (next == 2) {
                    this.target_2 = data.Target.Heading;
                } else if (next == 3) {
                    this.target_3 = data.Target.Heading;
                } else if (next == 4) {
                    this.target_4 = data.Target.Heading
                }
                if (id == 0)
                    this.target_0 = data.Target;
                else {
                    incoming_data[index].Target = data.Target.Targets;
                }
            }
        });
    }
}
