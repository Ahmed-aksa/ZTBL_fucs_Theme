import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {
    ApexChart,
    ApexNoData,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent
} from "ng-apexcharts";
import {finalize} from "rxjs/operators";
import {DashboardService} from "../../../shared/services/dashboard.service";
import {NgxSpinnerService} from "ngx-spinner";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    theme: ApexTheme;
    title: ApexTitleSubtitle;
    noData: ApexNoData;
};

@Component({
    selector: 'app-recovery-available',
    templateUrl: './recovery-available.component.html',
    styleUrls: ['./recovery-available.component.scss']
})
export class RecoveryAvailableComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;

    @Input('ProfileID') profile_id: any;
    year: any;
    years: any;
    public chartOptions: Partial<ChartOptions>;


    constructor(
        public dashboardService: DashboardService,
        private spinner: NgxSpinnerService
    ) {
    }

    ngOnInit(): void {
        this.getYears();
        this.getData();
        this.year=(new Date()).getFullYear().toString();
    }

    getData() {
        this.spinner.show()
        this.dashboardService.getDashboardData(this.profile_id, this.year).pipe(finalize(() => {
            this.spinner.hide()
        })).subscribe(result => {
            if (result.Code != "-1") {
                this.assignRoleData(result.DashboardReport);
            }
        });
    }

    getYears() {
        this.dashboardService.getYears().subscribe((data) => {
            this.years = data.DashboardReport.YearsForHistoricalData;
        })
    }

    private assignRoleData(DashboardReport: any) {

    }
}
