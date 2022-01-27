import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent,
    ApexNoData
} from "ng-apexcharts";
import { DashboardService } from "../../../shared/services/dashboard.service";
import { finalize } from "rxjs/operators";
import { NgxSpinnerService } from 'ngx-spinner';


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
    selector: 'app-branch-manager-dashboard',
    templateUrl: './branch-manager-dashboard.component.html',
    styleUrls: ['./branch-manager-dashboard.component.scss']
})
export class BranchManagerDashboardComponent implements OnInit {
    @ViewChild("chart") chart: ChartComponent;
    public chartPerformanceIndicators: Partial<ChartOptions>;
    @Input('ProfileID') profile_id: any;
    public chartLoanPortfolio: Partial<ChartOptions>;
    public chartnoOfBorrowers: Partial<ChartOptions>;
    options: FormGroup;
    hideRequiredControl = new FormControl(false);
    floatLabelControl = new FormControl('auto');
    DisbursmentAchievement: any = [];
    RecoveryAchievement: any = [];
    CirclePositions: any = [];
    CreditCeiling: any;
    years: any;
    year: any;

    constructor(fb: FormBuilder, public dashboardService: DashboardService, private spinner: NgxSpinnerService) {
        this.options = fb.group({
            hideRequired: this.hideRequiredControl,
            floatLabel: this.floatLabelControl,
        });

    }


    ngOnInit(): void {
        this.getYears();
        this.getData();
        this.year = (new Date()).getFullYear().toString();
    }

    assignRoleData(DashboardReport: any) {
        this.DisbursmentAchievement = this.dashboardService.getSortDate(DashboardReport?.DisbursmentAchievement);
        this.RecoveryAchievement = this.dashboardService.getSortDate(DashboardReport?.RecoveryAchievement); 
        this.CirclePositions = DashboardReport.CirclePositions;
        this.CreditCeiling = DashboardReport.CreditCeiling;

        this.chartPerformanceIndicators = this.dashboardService.assignKeys(DashboardReport?.PerformanceIndicator, 'Performance Indicators');
        this.chartLoanPortfolio = this.dashboardService.assignKeys(DashboardReport?.LoanPorfolio, 'Loan Portfolio');
        this.chartnoOfBorrowers = this.dashboardService.assignKeys(DashboardReport?.NoOfBorrowers, 'No Of Borrowers');
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




   
}
