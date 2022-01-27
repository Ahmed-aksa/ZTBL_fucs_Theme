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
import {NgxSpinnerService} from "ngx-spinner";
import {DashboardService} from "../../../shared/services/dashboard.service";
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
    selector: 'app-recovery-sam-division',
    templateUrl: './recovery-sam-division.component.html',
    styleUrls: ['./recovery-sam-division.component.scss']
})
export class RecoverySamDivisionComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    @Input('ProfileID') profile_id: any;
    year: any;
    years: any;
    public chartOptions1: Partial<ChartOptions>;
    public chartOptions2: Partial<ChartOptions>;
    options: FormGroup;
    hideRequiredControl = new FormControl(false);
    floatLabelControl = new FormControl('auto');
    DisbursmentAchievement: [string, unknown][];
    RecoveryAchievement: [string, unknown][];
    Top10NplZones: any;
    Top10SamZones: any;
    CreditCeiling: any;

    constructor(fb: FormBuilder, private spinner: NgxSpinnerService, public dashboardService: DashboardService) {
        this.options = fb.group({
            hideRequired: this.hideRequiredControl,
            floatLabel: this.floatLabelControl,
        });
    }


    ngOnInit(): void {
        this.getYears();
        this.getData();
    }

    assignRoleData(DashboardReport: any) {

        if (!DashboardReport) {
            return
        }
        this.chartOptions1 = this.dashboardService.assignKeys(DashboardReport.LoanPorfolio, 'Bank Book');
        this.chartOptions2 = this.dashboardService.assignKeys(DashboardReport.CreditCeiling, 'Credit Ceiling');

        this.DisbursmentAchievement = this.dashboardService.getSortDate(DashboardReport?.DisbursmentAchievement);
        this.RecoveryAchievement = this.dashboardService.getSortDate(DashboardReport?.RecoveryAchievement);
        
        this.Top10NplZones = DashboardReport.Top10NplZones;
        this.Top10SamZones = DashboardReport.Top10SamZones;
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
}
