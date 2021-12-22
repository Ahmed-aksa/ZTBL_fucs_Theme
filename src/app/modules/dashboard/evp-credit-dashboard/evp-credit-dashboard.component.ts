import { Component, OnInit, ViewChild } from '@angular/core';
import {
    ApexChart,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent
} from "ng-apexcharts";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DashboardService } from "../../../shared/services/dashboard.service";

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
    DisbursmentAchievement: [string, unknown][];
    RecoveryAchievement: [string, unknown][];
    CountryTop5: any;

    constructor(fb: FormBuilder, private dashboardService: DashboardService) {
        this.options = fb.group({
            hideRequired: this.hideRequiredControl,
            floatLabel: this.floatLabelControl,
        });
    }

    ngOnInit(): void {
    }


    assignRoleData(DashboardReport: any) {
        if (!DashboardReport) {
            return
        }
        this.chartOptions1 = this.dashboardService.assignKeys(DashboardReport.LoanPorfolio, 'Bank Book');
        this.chartOptions2 = this.dashboardService.assignKeys(DashboardReport.PerformanceIndicator, 'Performance Indicator');
        this.chartOptions3 = this.dashboardService.assignKeys(DashboardReport.PurposeWiseDisbursment, 'Purpose Wise Disbursement');
        this.chartOptions4 = this.dashboardService.assignKeys(DashboardReport.NoOfBorrowers, 'No Of Borrower');
        this.DisbursmentAchievement = Object.entries(DashboardReport?.DisbursmentAchievement);
        this.RecoveryAchievement = Object.entries(DashboardReport?.RecoveryAchievement);
        this.CountryTop5 = DashboardReport?.CountryTop5;


    }
}
