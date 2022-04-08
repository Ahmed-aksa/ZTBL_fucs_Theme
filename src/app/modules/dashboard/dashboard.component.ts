import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionExpireService} from 'app/shared/services/session-expire.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
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
    ApexChart,
    ApexDataLabels,
    ApexNoData,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexTheme,
    ApexTitleSubtitle,
    ApexTooltip
} from "ng-apexcharts";
import {environment} from "../../../environments/environment";
import {EncryptDecryptService} from "../../shared/services/encrypt_decrypt.service";

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


    mco_profile_id: any;
    ro_profile_id: any;
    bm_profile_id: any;
    zm_profile_id: any;
    zc_profile_id: any;
    evp_od_profile_id: any;
    evp_cd_profile_id: any;
    recovery_sam_profile_id: any;
    pz_profile_id: any;
    rc_profile_id: any;
    pc_profile_id: any;
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
    dataSource = new MatTableDataSource();
    displayedColumns = ['EmployeeNo', 'EmployeeName', 'PhoneNumber', 'Email', 'ZoneName', 'BranchName', 'UserCircles', 'actions'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private _sessionExpireService: SessionExpireService, private _router: Router, private spinner: NgxSpinnerService,
                private enc: EncryptDecryptService,private _dashboardService: DashboardService) {

    }

    ngOnInit(): void {
        this.assignProfileIds();
        this.userGroup = JSON.parse(this.enc.decryptStorageData(localStorage.getItem("ZTBLUser")))?.User?.userGroup
    }

    private assignProfileIds() {
        this.mco_profile_id = environment.MCO_Group_ID;
        this.ro_profile_id = environment.RECOVERY_OFFICER;
        this.bm_profile_id = environment.BM;
        this.zm_profile_id = environment.ZM;
        this.evp_od_profile_id = environment.EVP_OD;
        this.zc_profile_id = environment.ZC;
        this.recovery_sam_profile_id = environment.EVP_RS;
        this.evp_cd_profile_id = environment.EVP_CD;
        this.pz_profile_id = environment.PZ;
        this.rc_profile_id = environment.Regional_CHIEF;
        this.pc_profile_id = environment.PROVINCIAL_CHEIF;
    }
}
