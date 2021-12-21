import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'app/shared/services/dashboard.service';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexTheme,
  ApexTitleSubtitle,
  ChartComponent
  
} from "ng-apexcharts";
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  theme: ApexTheme;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-mco-dashborad',
  templateUrl: './mco-dashborad.component.html',
  styleUrls: ['./mco-dashborad.component.scss']
})
export class McoDashboradComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public chartOptions3: Partial<ChartOptions>;
  DisbursmentAchievement:any=[];
  RecoveryAchievement:any=[];
  UtilizationMutation:any=[];
  constructor(private _dashboardService: DashboardService, private spinner:NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this._dashboardService.getMcoDashboardDate().pipe(finalize(()=>{this.spinner.hide()})).subscribe(result => {
      debugger;

     this.DisbursmentAchievement=Object.entries(result.DashboardReport.DisbursmentAchievement);
     this.RecoveryAchievement=Object.entries(result.DashboardReport.RecoveryAchievement);
     this.UtilizationMutation=Object.entries(result.DashboardReport.UtilizationMutation);


      this.PerformanceIndicators(result?.DashboardReport?.PerformanceIndicator);
      this.LoanPorfolio(result?.DashboardReport?.LoanPorfolio)
      this.LoanPorfolio2(result?.DashboardReport?.LoanPorfolio2)
    });
  }
  PerformanceIndicators(PerformanceIndicator: any) {
    var obj = [];
    (Object.values(PerformanceIndicator)).forEach(x => {
      obj.push(Number(x));

    })
    this.chartOptions1 = {
      series: obj, //Object.values(PerformanceIndicator),
      chart: {
        width: "100%",
        type: "pie"
      },
      labels: Object.keys(PerformanceIndicator),
      theme: {
        monochrome: {
          enabled: false
        }
      },
      title: {
        text: "Performance Indicators"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  LoanPorfolio(LoanPorfolio: any) {
    var obj = [];
    (Object.values(LoanPorfolio)).forEach(x => {
      obj.push(Number(x));

    })
    this.chartOptions2 = {
      series: obj,
      chart: {
        width: "100%",
        type: "pie"
      },
      labels: Object.keys(LoanPorfolio),
      theme: {
        monochrome: {
          enabled: true
        }
      },
      title: {
        text: "Circle Bench Mark"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  LoanPorfolio2(LoanPorfolio2:any){
    var obj = [];
    (Object.values(LoanPorfolio2)).forEach(x => {
      obj.push(Number(x));

    })
    this.chartOptions3 = {
      series: obj,
      chart: {
        width: "100%",
        type: "pie"
      },
      labels: Object.keys(LoanPorfolio2),
      theme: {
        monochrome: {
          enabled: false
        }
      },
      title: {
        text: "Loan Portfolio"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

}
