import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {NgApexchartsModule} from "ng-apexcharts";
import {McoDashboradComponent} from './mco-dashborad/mco-dashborad.component';
import {RecoveryOfficerDashboardComponent} from './recovery-officer-dashboard/recovery-officer-dashboard.component';
import {BranchManagerDashboardComponent} from './branch-manager-dashboard/branch-manager-dashboard.component';
import {ZonalChiefDashboardComponent} from './zonal-chief-dashboard/zonal-chief-dashboard.component';
import {EvpOdDashboardComponent} from './evp-od-dashboard/evp-od-dashboard.component';
import {EvpCreditDashboardComponent} from './evp-credit-dashboard/evp-credit-dashboard.component';
import {RecoveryAvailableComponent} from './recovery-available/recovery-available.component';
import { PresidentZtblComponent } from './president-ztbl/president-ztbl.component';
import { RegionalCheifComponent } from './regional-cheif/regional-cheif.component';
import { CustomerModule } from '../customer/customer.module';
import { RecoverySamDivisionComponent } from './recovery-sam-division/recovery-sam-division.component';

const route = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'mcoDashborad',
        component: McoDashboradComponent
    },
    {
        path: 'recoveryofficerDashborad',
        component: RecoveryOfficerDashboardComponent
    },
    {
        path: 'branchmanagerDashborad',
        component: BranchManagerDashboardComponent
    },
    {
        path: 'zonalchiefDashborad',
        component: ZonalChiefDashboardComponent
    },
    {
        path: 'evpodDashborad',
        component: EvpOdDashboardComponent
    },
];

@NgModule({
    declarations: [
        DashboardComponent,
        McoDashboradComponent,
        RecoveryOfficerDashboardComponent,
        BranchManagerDashboardComponent,
        BranchManagerDashboardComponent,
        ZonalChiefDashboardComponent,
        EvpOdDashboardComponent,
        EvpCreditDashboardComponent,
        RecoveryAvailableComponent,
        PresidentZtblComponent,
        RegionalCheifComponent,
        RecoverySamDivisionComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(route),
        SharedModule,
        NgApexchartsModule,
        CustomerModule
    ]
})
export class DashboardModule {
}
