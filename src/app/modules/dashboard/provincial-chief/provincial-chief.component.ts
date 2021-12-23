import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'app/shared/services/dashboard.service';
import { ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartOptions } from '../evp-credit-dashboard/evp-credit-dashboard.component';

@Component({
  selector: 'app-provincial-chief',
  templateUrl: './provincial-chief.component.html',
  styleUrls: ['./provincial-chief.component.scss']
})
export class ProvincialChiefComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  RecoveryAchievement: [string, unknown][];
  CirclePositions: any;
  p: any;
  CreditCeiling: any;

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
       this.CreditCeiling = DashboardReport.CreditCeiling;
      this.spinner.hide()

  }

}
