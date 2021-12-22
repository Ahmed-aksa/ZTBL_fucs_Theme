import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'app/shared/services/dashboard.service';
import {
    ApexChart,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent
} from "ng-apexcharts";
import { NgxSpinnerService } from 'ngx-spinner';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    theme: ApexTheme;
    title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-president-ztbl',
    templateUrl: './president-ztbl.component.html',
    styleUrls: ['./president-ztbl.component.scss']
})
export class PresidentZtblComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions1: Partial<ChartOptions>;
    public chartOptions2: Partial<ChartOptions>;
    public chartOptions3: Partial<ChartOptions>;
    public chartOptions4: Partial<ChartOptions>;
    ResourcesCount: [string, unknown][];
    CountryWorst5: any;
    CountryTop5: any;


    constructor(private spinner: NgxSpinnerService, private _dashboardService: DashboardService) {
       
    }

    ngOnInit(): void {
    }
    assignRoleData(DashboardReport: any) {
        
        this.spinner.show();
        if (!DashboardReport) {
            return
        }

        this.chartOptions1 = this._dashboardService.assignKeys(DashboardReport.PerformanceIndicator, 'Performance Indicators');
        this.chartOptions2 = this._dashboardService.assignKeys(DashboardReport.LoanPorfolio, 'Bank  Book');
        this.chartOptions3 = this._dashboardService.assignKeys(DashboardReport.NoOfBorrowers, 'No. Of Borrowers');
        this.chartOptions4 = this._dashboardService.assignKeys(DashboardReport.NoOfAccountHolder, 'No. Of Accounts');
        this.ResourcesCount = Object.entries(DashboardReport?.ResourcesCount);
        this.CountryWorst5 = DashboardReport?.CountryWorst5;
        this.CountryTop5 = DashboardReport?.CountryTop5;
        //this.UtilizationMutation = Object.entries(DashboardReport?.UtilizationMutation);
        this.spinner.hide()

    }

}
