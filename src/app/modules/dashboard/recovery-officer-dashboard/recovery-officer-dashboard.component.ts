import {Component, OnInit, ViewChild} from '@angular/core';
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

    constructor(private dashboardService: DashboardService) {
    }

    ngOnInit(): void {
    }

    assignRoleData(DashboardReport: any) {
        
        if (!DashboardReport?.RecoveryAchievement) {
            return
        }
        this.recoveryAchievment = Object.entries(DashboardReport?.RecoveryAchievement);
        this.circlePositions = DashboardReport.CirclePositions;
        this.chartOptions = this.dashboardService.assignKeys(DashboardReport.LoanPorfolio, 'Loan Portfolio');
    }
}
