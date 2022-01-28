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
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {DashboardService} from "../../../shared/services/dashboard.service";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    colors: any[];
    theme: ApexTheme;
    title: ApexTitleSubtitle;
    noData: ApexNoData;
};

@Component({
    selector: 'app-evp-credit-dashboard',
    templateUrl: './evp-credit-dashboard.component.html',
    styleUrls: ['./evp-credit-dashboard.component.scss']
})


export class EvpCreditDashboardComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    @Input('ProfileID') profile_id: any;
    year: any;
    years: any;
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
    CreditCeiling: any;

    constructor(fb: FormBuilder, public dashboardService: DashboardService, private spinner: NgxSpinnerService) {
        this.options = fb.group({
            hideRequired: this.hideRequiredControl,
            floatLabel: this.floatLabelControl,
        });
    }

    ngOnInit(): void {
        this.year=(new Date()).getFullYear().toString();
        this.getYears();
        this.getData();
        
    }


    assignRoleData(DashboardReport: any) {
        if (!DashboardReport) {
            return
        }
        this.chartOptions1 = this.dashboardService.assignKeys(DashboardReport.LoanPorfolio, 'Bank Book');
        this.chartOptions2 = this.dashboardService.assignKeys(DashboardReport.PerformanceIndicator, 'Performance Indicator');
        this.chartOptions3 = this.dashboardService.assignKeys(DashboardReport.PurposeWiseDisbursment, 'Purpose Wise Disbursement');
        this.chartOptions4 = this.dashboardService.assignKeys(DashboardReport.NoOfBorrowers, 'No Of Borrower');
        debugger;
        this.DisbursmentAchievement = (DashboardReport.DisbursmentAchievement);
        this.RecoveryAchievement = this.dashboardService.getSortDate(DashboardReport?.RecoveryAchievement); 
        this.CountryTop5 = DashboardReport?.CountryTop5;
        this.CreditCeiling = DashboardReport.CreditCeiling;
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

    getFormatString(str: any) {
        
        const myArray = str.split("_");
        return myArray[0] + " / " + myArray[1] +" (+/-)";
    }
}
