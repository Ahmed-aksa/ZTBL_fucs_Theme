import {Component, OnInit, ViewChild} from '@angular/core';
import {
    ApexChart,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent
} from "ng-apexcharts";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    theme: ApexTheme;
    title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-evp-credit-dashboard',
    templateUrl: './evp-credit-dashboard.component.html',
    styleUrls: ['./evp-credit-dashboard.component.scss']
})


export class EvpCreditDashboardComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    options: FormGroup;
    hideRequiredControl = new FormControl(false);
    floatLabelControl = new FormControl('auto');

    constructor(fb: FormBuilder) {
        this.options = fb.group({
            hideRequired: this.hideRequiredControl,
            floatLabel: this.floatLabelControl,
        });
        this.chartOptions = {
            series: [25, 15, 44, 55, 41, 17],
            chart: {
                width: "100%",
                type: "pie"
            },
            labels: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            theme: {
                monochrome: {
                    enabled: false
                }
            },
            title: {
                text: "Performance Indicators"
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ]
        };
    }

    ngOnInit(): void {
    }
}
