import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexTheme,
  ApexTitleSubtitle,
  ChartComponent
} from "ng-apexcharts";


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  theme: ApexTheme;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-branch-manager-dashboard',
  templateUrl: './branch-manager-dashboard.component.html',
  styleUrls: ['./branch-manager-dashboard.component.scss']
})
export class BranchManagerDashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartPerformanceIndicators: Partial<ChartOptions>;
  public chartLoanPortfolio: Partial<ChartOptions>;
  public chartnoOfBorrowers: Partial<ChartOptions>;
  options: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');
  DisbursmentAchievement:any=[];
  RecoveryAchievement:any=[];
  CirclePositions:any=[];

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });
  
  }


  ngOnInit(): void {

  }
  assignRoleData(DashboardReport: any) {
    debugger;
    ///this.DisbursmentAchievement = Object.entries(DashboardReport.DisbursmentAchievement);
    //this.RecoveryAchievement = Object.entries(DashboardReport.RecoveryAchievement);
    //this.UtilizationMutation = Object.entries(DashboardReport.UtilizationMutation);

    this.DisbursmentAchievement = Object.entries(DashboardReport.DisbursmentAchievement);
    this.RecoveryAchievement = Object.entries(DashboardReport.RecoveryAchievement);
    this.CirclePositions = DashboardReport.CirclePositions;

    this.ChartPerformanceIndicators(DashboardReport.PerformanceIndicator);
    this.ChartLoanPortfolio(DashboardReport.LoanPorfolio)
    this.ChartnoOfBorrowers(DashboardReport.NoOfBorrowers)
  }

  ChartPerformanceIndicators(PerformanceIndicators: any) {
    var obj = [];
    (Object.values(PerformanceIndicators)).forEach(x => {
        obj.push(Number(x));
    });
    this.chartPerformanceIndicators = {
      series: [25, 15, 44, 55, 41, 17],
      chart: {
        width: "100%",
        type: "pie"
      },
      labels:  Object.keys(PerformanceIndicators),
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
  ChartLoanPortfolio(LoanPorfolio:any){
    var obj = [];
    (Object.values(LoanPorfolio)).forEach(x => {
        obj.push(Number(x));
    });
    this.chartLoanPortfolio = {
      series: [25, 15, 44, 55, 41, 17],
      chart: {
        width: "100%",
        type: "pie"
      },
      labels:  Object.keys(LoanPorfolio),
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
  ChartnoOfBorrowers(NoOfBorrowers:any){
    var obj = [];
    (Object.values(NoOfBorrowers)).forEach(x => {
        obj.push(Number(x));
    });
    this.chartnoOfBorrowers = {
      series: [25, 15, 44, 55, 41, 17],
      chart: {
        width: "100%",
        type: "pie"
      },
      labels:  Object.keys(NoOfBorrowers),
      theme: {
        monochrome: {
          enabled: false
        }
      },
      title: {
        text: "No Of Borrowers "
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
