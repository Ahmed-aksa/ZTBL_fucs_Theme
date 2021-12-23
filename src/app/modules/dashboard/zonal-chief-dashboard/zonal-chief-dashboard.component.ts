import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent
} from "ng-apexcharts";
import {DashboardService} from "../../../shared/services/dashboard.service";


export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    theme: ApexTheme;
    title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-zonal-chief-dashboard',
    templateUrl: './zonal-chief-dashboard.component.html',
    styleUrls: ['./zonal-chief-dashboard.component.scss']
})
export class ZonalChiefDashboardComponent implements OnInit {

    @ViewChild("chart-zonal") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    options: FormGroup;
    hideRequiredControl = new FormControl(false);
    floatLabelControl = new FormControl('auto');
    DisbursmentAchievement: any = [];
    RecoveryAchievement: any = [];
    CirclePositions: any = [];
    public chartPerformanceIndicators: Partial<ChartOptions>;
    public chartLoanPortfolio: Partial<ChartOptions>;
    public chartnoOfBorrowers: Partial<ChartOptions>;
    CreditCeiling: any;

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
        this.DisbursmentAchievement = Object.entries(DashboardReport.DisbursmentAchievement);
        this.RecoveryAchievement = Object.entries(DashboardReport.RecoveryAchievement);
        this.CirclePositions = DashboardReport.CirclePositions;
        this.CreditCeiling = DashboardReport.CreditCeiling;
        this.chartPerformanceIndicators = this.dashboardService.assignKeys(DashboardReport.PerformanceIndicator, 'Performance Indicators');
        this.chartLoanPortfolio = this.dashboardService.assignKeys(DashboardReport.LoanPorfolio, 'Loan Portfolio');
        this.chartnoOfBorrowers = this.dashboardService.assignKeys(DashboardReport.NoOfBorrowers, 'No of Borrowers');
    }
}
