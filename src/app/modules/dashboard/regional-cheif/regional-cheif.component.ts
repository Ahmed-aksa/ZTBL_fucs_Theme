import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'app/shared/services/dashboard.service';
import {
    ApexChart,
    ApexNoData,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent
} from "ng-apexcharts";
import { NgxSpinnerService } from 'ngx-spinner';
import {finalize} from "rxjs/operators";

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
    selector: 'app-regional-cheif',
    templateUrl: './regional-cheif.component.html',
    styleUrls: ['./regional-cheif.component.scss']
})


export class RegionalCheifComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    @Input('ProfileID') profile_id: any;
    year: any;
    years: any;
    public chartOptions: Partial<ChartOptions>;
    RecoveryAchievement: [string, unknown][];
    CirclePositions: any;
    p: any;
    CreditCeiling: any;

    constructor( private route: ActivatedRoute,
         private spinner: NgxSpinnerService,
         private dashboardService: DashboardService,
         private router: Router) {
    }

    ngOnInit(): void {
        this.getYears();
        this.getData();
    }
    assignRoleData(DashboardReport: any) {

        this.spinner.show();
        if (!DashboardReport) {
            return
        }

        this.chartOptions = this.dashboardService.assignKeys(DashboardReport.LoanPorfolio, 'Loan Portfolio(Branch Wise)');
         this.RecoveryAchievement = Object.entries(DashboardReport?.RecoveryAchievement);
         this.CirclePositions = DashboardReport?.CirclePositions;
         this.CreditCeiling = DashboardReport.CreditCeiling;
        this.spinner.hide()
    }
    getData() {
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
}

