import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from 'app/shared/services/dashboard.service';
import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent,
    ApexNoData

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
    noData: ApexNoData;
};

@Component({
    selector: 'app-mco-dashborad',
    templateUrl: './mco-dashborad.component.html',
    styleUrls: ['./mco-dashborad.component.scss']
})
export class McoDashboradComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    @ViewChild(McoDashboradComponent, {static: false}) mcoDashboardComponent: McoDashboradComponent;
    @Input('ProfileID') profile_id: any;

    public chartOptions1: Partial<ChartOptions>;
    public chartOptions2: Partial<ChartOptions>;
    public chartOptions3: Partial<ChartOptions>;
    public chartOptions4: Partial<ChartOptions>;
    DisbursmentAchievement: any = [];
    RecoveryAchievement: any = [];
    UtilizationMutation: any;
    year: any;
    years: any;

    constructor(public _dashboardService: DashboardService, private spinner: NgxSpinnerService) {
    }

    ngOnInit(): void {
        this.year = (new Date()).getFullYear().toString();
        this.getYears();
        this.getData();

    }

    assignRoleData(DashboardReport: any) {
        this.chartOptions1 = this._dashboardService.assignKeys(DashboardReport?.PerformanceIndicator, 'Performance Indicators');
        this.chartOptions2 = this._dashboardService.assignKeys(DashboardReport?.LoanPorfolio, 'Loan Portfolio');
        this.chartOptions3 = this._dashboardService.assignKeys(DashboardReport?.LoanPorfolio2, 'Loan Portfolio');
        this.chartOptions4 = this._dashboardService.assignKeys(DashboardReport?.CircleRadius, 'Circle Radius');

        this.DisbursmentAchievement = this._dashboardService.getSortDate(DashboardReport?.DisbursmentAchievement);
        this.RecoveryAchievement = this._dashboardService.getSortDate(DashboardReport?.RecoveryAchievement);
        this.UtilizationMutation = DashboardReport?.UtilizationMutation;

    }

    getYears() {
        this._dashboardService.getYears().subscribe((data) => {
            this.years = data.DashboardReport.YearsForHistoricalData;
        })
    }

    getData() {
        this.spinner.show()
        this._dashboardService.getDashboardData(this.profile_id, this.year).pipe(finalize(() => {
            this.spinner.hide()
        })).subscribe(result => {
            if (result.Code != "-1") {
                this.assignRoleData(result.DashboardReport);
            }
        });
    }
}
