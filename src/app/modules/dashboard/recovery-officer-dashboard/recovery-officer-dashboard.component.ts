import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {
    ChartComponent,
} from "ng-apexcharts";
import {DashboardService} from "../../../shared/services/dashboard.service";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {ChartOptions} from "../dashboard.component";

@Component({
    selector: 'app-recovery-officer-dashboard',
    templateUrl: './recovery-officer-dashboard.component.html',
    styleUrls: ['./recovery-officer-dashboard.component.scss']
})
export class RecoveryOfficerDashboardComponent implements OnInit {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    @Input('ProfileID') profile_id: any;
    year: any;
    years: any;

    recoveryAchievment: any;
    creditCeiling: any;
    circlePositions: any;
    CreditCeiling: any;

    constructor(private dashboardService: DashboardService, private spinner: NgxSpinnerService) {
    }

    ngOnInit(): void {
        this.year=(new Date()).getFullYear().toString();
        this.getYears();
        this.getData();
    }

    assignRoleData(DashboardReport: any) {
        debugger
        if (!DashboardReport?.RecoveryAchievement) {
            return
        }
        this.recoveryAchievment = this.dashboardService.getSortDate(DashboardReport?.RecoveryAchievement);
        this.circlePositions = DashboardReport.CirclePositions;
        this.CreditCeiling = DashboardReport.CreditCeiling;
        this.chartOptions = this.dashboardService.assignKeys(DashboardReport.LoanPorfolio, 'Loan Portfolio');
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
