import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent,
    ApexNoData
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
    noData: ApexNoData;
};

@Component({
    selector: 'app-evp-od-dashboard',
    templateUrl: './evp-od-dashboard.component.html',
    styleUrls: ['./evp-od-dashboard.component.scss']
})
export class EvpOdDashboardComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    @Input('ProfileID') profile_id: any;
    year: any;
    years: any;
    public chartOptions: Partial<ChartOptions>;
    options: FormGroup;
    hideRequiredControl = new FormControl(false);
    floatLabelControl = new FormControl('auto');
    ResourcesCount: [string, unknown][];
    UtilizationMutation: any;

    constructor(fb: FormBuilder, private spinner: NgxSpinnerService, public dashboardService: DashboardService) {
        this.options = fb.group({
            hideRequired: this.hideRequiredControl,
            floatLabel: this.floatLabelControl,
        });
    }


    ngOnInit(): void {
        this.spinner.show();
        this.year=(new Date()).getFullYear().toString();
        this.getYears();
        this.getData();
       
    }

    assignRoleData(DashboardReport: any) {
        this.spinner.show();
        if (!DashboardReport) {
            return
        }
        try {
            this.chartOptions = this.dashboardService.assignKeys(DashboardReport.PerformanceIndicator, 'Performance Indicators');
            this.ResourcesCount = DashboardReport?.ResourcesCount;
            this.UtilizationMutation = DashboardReport?.UtilizationMutation; 

        } catch (err) {
        } finally {
            this.spinner.hide();
        }

    }

    getData() {
        this.spinner.show();
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
