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
import {finalize} from "rxjs/operators";
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
    selector: 'app-evp-od-dashboard',
    templateUrl: './evp-od-dashboard.component.html',
    styleUrls: ['./evp-od-dashboard.component.scss']
})
export class EvpOdDashboardComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
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
    }
}
