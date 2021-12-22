import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    selector: 'app-regional-cheif',
    templateUrl: './regional-cheif.component.html',
    styleUrls: ['./regional-cheif.component.scss']
})


export class RegionalCheifComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    RecoveryAchievement: [string, unknown][];
    CirclePositions: any;
    p: any;

    constructor( private route: ActivatedRoute,
         private spinner: NgxSpinnerService, 
         private _dashboardService: DashboardService,
         private router: Router) {
    }

    ngOnInit(): void {
    }
    assignRoleData(DashboardReport: any) {
        
        this.spinner.show();
        if (!DashboardReport) {
            return
        }

        this.chartOptions = this._dashboardService.assignKeys(DashboardReport.LoanPorfolio, 'Loan Portfolio(Branch Wise)');
         this.RecoveryAchievement = Object.entries(DashboardReport?.RecoveryAchievement);
         this.CirclePositions = DashboardReport?.CirclePositions;
        this.spinner.hide()

    }
}

