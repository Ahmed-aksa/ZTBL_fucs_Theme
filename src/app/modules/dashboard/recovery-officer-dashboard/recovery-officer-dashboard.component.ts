import {Component, OnInit, ViewChild} from '@angular/core';
import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    theme: ApexTheme;
    title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-recovery-officer-dashboard',
    templateUrl: './recovery-officer-dashboard.component.html',
    styleUrls: ['./recovery-officer-dashboard.component.scss']
})
export class RecoveryOfficerDashboardComponent implements OnInit {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    recoveryAchievment: any;
    creditCeiling: any;
    circlePositions: any;

    constructor() {
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

    assignRoleData(DashboardReport: any) {
      if(!DashboardReport?.RecoveryAchievement){return}
        this.recoveryAchievment = Object.entries(DashboardReport?.RecoveryAchievement);
        this.circlePositions = DashboardReport.CirclePositions;
        var obj = [];
        (Object.values(DashboardReport?.LoanPorfolio)).forEach(x => {
            obj.push(Number(x));

        })
        this.chartOptions = {
            series: obj, //Object.values(PerformanceIndicator),
            chart: {
                width: "100%",
                type: "pie"
            },
            labels: Object.keys(DashboardReport?.LoanPorfolio),
            theme: {
                monochrome: {
                    enabled: false
                }
            },
            title: {
                text: "Loan Portfolio"
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
}
