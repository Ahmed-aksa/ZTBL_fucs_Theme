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
    public chartOptions1: Partial<ChartOptions>;
    public chartOptions2: Partial<ChartOptions>;
    public chartOptions3: Partial<ChartOptions>;
    public chartOptions4: Partial<ChartOptions>;
    options: FormGroup;
    hideRequiredControl = new FormControl(false);
    floatLabelControl = new FormControl('auto');

    constructor(fb: FormBuilder,private apexCharts:ApexChart) {
        this.options = fb.group({
            hideRequired: this.hideRequiredControl,
            floatLabel: this.floatLabelControl,
        });

       this.chartOptions1= this.createCharts("Bank Book");
       this.chartOptions2= this.createCharts("Performance Indicators");
       this.chartOptions3=this.createCharts("Purpose wise Disbursements");
       this.chartOptions4=this.createCharts("No. of Borrowers");
      
    }

    ngOnInit(): void {
    }

    createCharts(title):Partial<ChartOptions>{
       return  {
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
                text:title
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
    assignRoleData(DashboardReport: any) {
        if(!DashboardReport){return}
        ///this.DisbursmentAchievement = Object.entries(DashboardReport.DisbursmentAchievement);
        //this.RecoveryAchievement = Object.entries(DashboardReport.RecoveryAchievement);
        //this.UtilizationMutation = Object.entries(DashboardReport.UtilizationMutation);

        this.assignKeys(DashboardReport.PerformanceIndicator);
    }

    assignKeys(PerformanceIndicator: any) {
        var obj = [];
        (Object.values(PerformanceIndicator)).forEach(x => {
            obj.push(Number(x));

        })
        this.chartOptions3.labels=Object.keys(PerformanceIndicator);
        this.chartOptions3.series= obj;
    }
}
