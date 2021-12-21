import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from 'app/shared/services/dashboard.service';
import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent

} from "ng-apexcharts";
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    theme: ApexTheme;
    title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-mco-dashborad',
    templateUrl: './mco-dashborad.component.html',
    styleUrls: ['./mco-dashborad.component.scss']
})
export class McoDashboradComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions1: Partial<ChartOptions>;
    public chartOptions2: Partial<ChartOptions>;
    public chartOptions3: Partial<ChartOptions>;
    DisbursmentAchievement: any = [];
    RecoveryAchievement: any = [];
    UtilizationMutation: any = [];

    constructor(private _dashboardService: DashboardService, private spinner: NgxSpinnerService) {
    }

    ngOnInit(): void {

    }

    assignRoleData(DashboardReport: any) {
        this.chartOptions1 = this._dashboardService.assignKeys(DashboardReport.PerformanceIndicator, 'Performance Indicators');
        this.chartOptions2 = this._dashboardService.assignKeys(DashboardReport.LoanPorfolio, 'Loan Portfolio');
        this.chartOptions3 = this._dashboardService.assignKeys(DashboardReport.LoanPorfolio2, 'Loan Portfolio');
    }
}
