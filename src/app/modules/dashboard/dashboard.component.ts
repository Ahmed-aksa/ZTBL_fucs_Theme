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
import {ClApplicationHeaderComponent} from "../loan/cl-application-header/cl-application-header.component";
import {ClCustomersComponent} from "../loan/cl-customers/cl-customers.component";
import {ClSecuritiesComponent} from "../loan/cl-securities/cl-securities.component";
import {ClLegalHeirsComponent} from "../loan/cl-legal-heirs/cl-legal-heirs.component";
import {ClPurposeComponent} from "../loan/cl-purpose/cl-purpose.component";
import {ClLoanWitnessComponent} from "../loan/cl-loan-witness/cl-loan-witness.component";
import {McoDashboradComponent} from "./mco-dashborad/mco-dashborad.component";
import {RecoveryOfficerDashboardComponent} from "./recovery-officer-dashboard/recovery-officer-dashboard.component";
import { BranchManagerDashboardComponent } from './branch-manager-dashboard/branch-manager-dashboard.component';
import { ZonalChiefDashboardComponent } from './zonal-chief-dashboard/zonal-chief-dashboard.component';
import { EvpCreditDashboardComponent } from './evp-credit-dashboard/evp-credit-dashboard.component';
import {EvpOdDashboardComponent} from "./evp-od-dashboard/evp-od-dashboard.component";
import { PresidentZtblComponent } from './president-ztbl/president-ztbl.component';
import { RegionalCheifComponent } from './regional-cheif/regional-cheif.component';
import { ProvincialChiefComponent } from './provincial-chief/provincial-chief.component';
import { RecoverySamDivisionComponent } from './recovery-sam-division/recovery-sam-division.component';

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
        this.spinner.show();
    }

    dataSource = new MatTableDataSource();
    displayedColumns = ['EmployeeNo', 'EmployeeName', 'PhoneNumber', 'Email', 'ZoneName', 'BranchName', 'UserCircles', 'actions'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    ngOnInit(): void {

        this.userGroup = JSON.parse(localStorage.getItem("ZTBLUser"))?.User?.userGroup
            //     this.mcoDashboardComponent?.assignRoleData(result.DashboardReport);
            //     this.recoveryOfficerDashboardComponent?.assignRoleData(result.DashboardReport);
            //     this.branchManagerDashboardComponent?.assignRoleData(result.DashboardReport);
            //     this.zonalChiefDashboardComponent?.assignRoleData(result.DashboardReport);
            //     this.evpCreditDashboardComponent?.assignRoleData(result.DashboardReport);
            //     this.evpOdDashboardComponent?.assignRoleData(result.DashboardReport);
            //     this.presidentZtblComponent?.assignRoleData(result.DashboardReport);
            //     this.regionalCheifComponent?.assignRoleData(result.DashboardReport);
            //     this.provincialChiefComponent?.assignRoleData(result.DashboardReport);
            //     this.recoverySamDivisionComponent?.assignRoleData(result.DashboardReport);


    }



    // @HostListener('window:keydown')
    // @HostListener('window:mousedown')
    // // @HostListener('mousemove')
    // checkUserActivity() {
    //     this.setSessionTime();
    // }

}
