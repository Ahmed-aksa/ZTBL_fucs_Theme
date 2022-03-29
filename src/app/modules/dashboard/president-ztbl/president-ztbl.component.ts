import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from 'app/shared/services/dashboard.service';
import {ChartComponent} from "ng-apexcharts";
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from "rxjs/operators";
import {ChartOptions} from '../dashboard.component';

@Component({
    selector: 'app-president-ztbl',
    templateUrl: './president-ztbl.component.html',
    styleUrls: ['./president-ztbl.component.scss']
})
export class PresidentZtblComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    @Input('ProfileID') profile_id: any;
    year: any;
    years: any;
    public chartOptions1: Partial<ChartOptions>;
    public chartOptions2: Partial<ChartOptions>;
    public chartOptions3: Partial<ChartOptions>;
    public chartOptions4: Partial<ChartOptions>;
    ResourcesCount: any;
    CountryWorst5: any;
    CountryTop5: any;


    constructor(private spinner: NgxSpinnerService, public dashboardService: DashboardService) {

    }

    ngOnInit(): void {
        this.year = (new Date()).getFullYear().toString();
        this.getYears();
        this.getData();

    }

    assignRoleData(DashboardReport: any) {

        this.spinner.show();
        if (!DashboardReport) {
            return
        }


        this.chartOptions1 = this.dashboardService.assignKeys(DashboardReport.PerformanceIndicator, 'Performance Indicators');
        this.chartOptions2 = this.dashboardService.assignKeys(DashboardReport.LoanPorfolio, 'Bank  Book');
        this.chartOptions3 = this.dashboardService.assignKeys(DashboardReport.NoOfBorrowers, 'No. Of Borrowers');
        this.chartOptions4 = this.dashboardService.assignKeys(DashboardReport.NoOfAccountHolder, 'No. Of Deposit Accounts');
        this.ResourcesCount = DashboardReport?.ResourcesCount;
        this.CountryWorst5 = DashboardReport?.CountryWorst5;
        this.CountryTop5 = DashboardReport?.CountryTop5;
        //this.UtilizationMutation = Object.entries(DashboardReport?.UtilizationMutation);
        this.spinner.hide()
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
