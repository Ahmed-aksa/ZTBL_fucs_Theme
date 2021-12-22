import {Component, OnInit, ViewChild} from '@angular/core';
import {
    ApexChart,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent
} from "ng-apexcharts";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
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
    selector: 'app-recovery-sam-division',
    templateUrl: './recovery-sam-division.component.html',
    styleUrls: ['./recovery-sam-division.component.scss']
})
export class RecoverySamDivisionComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    public chartOptions2: Partial<ChartOptions>;
    options: FormGroup;
    hideRequiredControl = new FormControl(false);
    floatLabelControl = new FormControl('auto');

    constructor(fb: FormBuilder, private spinner: NgxSpinnerService, private _dashboardService: DashboardService) {
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
        this.chartOptions = this._dashboardService.assignKeys(DashboardReport.PerformanceIndicator, 'Performance Indicators');
        this.chartOptions = this._dashboardService.assignKeys(DashboardReport.PerformanceIndicator, 'Performance Indicators');
    }
}
