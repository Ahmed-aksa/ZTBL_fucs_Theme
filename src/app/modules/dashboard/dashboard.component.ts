import {Component, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionExpireService} from 'app/shared/services/session-expire.service';
import {Router} from '@angular/router';
import {ThrowStmt} from '@angular/compiler';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from "rxjs/operators";
import {DashboardService} from "../../shared/services/dashboard.service";
import {McoDashboradComponent} from "./mco-dashborad/mco-dashborad.component";
import {RecoveryOfficerDashboardComponent} from "./recovery-officer-dashboard/recovery-officer-dashboard.component";
import {BranchManagerDashboardComponent} from './branch-manager-dashboard/branch-manager-dashboard.component';
import {ZonalChiefDashboardComponent} from './zonal-chief-dashboard/zonal-chief-dashboard.component';
import {EvpCreditDashboardComponent} from './evp-credit-dashboard/evp-credit-dashboard.component';
import {EvpOdDashboardComponent} from "./evp-od-dashboard/evp-od-dashboard.component";
import {PresidentZtblComponent} from './president-ztbl/president-ztbl.component';
import {RegionalCheifComponent} from './regional-cheif/regional-cheif.component';
import {ProvincialChiefComponent} from './provincial-chief/provincial-chief.component';
import {RecoverySamDivisionComponent} from './recovery-sam-division/recovery-sam-division.component';
import {
    ApexChart, ApexDataLabels,
    ApexNoData,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexTheme,
    ApexTitleSubtitle, ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    colors: any[];
    theme: ApexTheme;
    title: ApexTitleSubtitle;
    noData: ApexNoData;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
};

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {

    @ViewChild(McoDashboradComponent, {static: false}) mcoDashboardComponent: McoDashboradComponent;
    @ViewChild(RecoveryOfficerDashboardComponent, {static: false}) recoveryOfficerDashboardComponent: RecoveryOfficerDashboardComponent;
    @ViewChild(BranchManagerDashboardComponent, {static: false}) branchManagerDashboardComponent: BranchManagerDashboardComponent;
    @ViewChild(ZonalChiefDashboardComponent, {static: false}) zonalChiefDashboardComponent: ZonalChiefDashboardComponent;
    @ViewChild(EvpCreditDashboardComponent, {static: false}) evpCreditDashboardComponent: EvpCreditDashboardComponent;
    @ViewChild(EvpOdDashboardComponent, {static: false}) evpOdDashboardComponent: EvpOdDashboardComponent;
    @ViewChild(PresidentZtblComponent, {static: false}) presidentZtblComponent: PresidentZtblComponent;
    @ViewChild(RegionalCheifComponent, {static: false}) regionalCheifComponent: RegionalCheifComponent;
    @ViewChild(ProvincialChiefComponent, {static: false}) provincialChiefComponent: ProvincialChiefComponent;
    @ViewChild(RecoverySamDivisionComponent, {static: false}) recoverySamDivisionComponent: RecoverySamDivisionComponent;
    popup: any = false;
    time: any
    sessionTime: any;
    userGroup: any = [];
    rolesData: any;

    constructor(private _sessionExpireService: SessionExpireService, private _router: Router, private spinner: NgxSpinnerService, private _dashboardService: DashboardService) {

    }

    dataSource = new MatTableDataSource();
    displayedColumns = ['EmployeeNo', 'EmployeeName', 'PhoneNumber', 'Email', 'ZoneName', 'BranchName', 'UserCircles', 'actions'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    ngOnInit(): void {

        this.userGroup = JSON.parse(localStorage.getItem("ZTBLUser"))?.User?.userGroup
    }
}
