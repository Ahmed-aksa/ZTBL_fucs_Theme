import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import { NgApexchartsModule } from "ng-apexcharts";
import { McoDashboradComponent } from './mco-dashborad/mco-dashborad.component';
import { RecoveryOfficerDashboardComponent } from './recovery-officer-dashboard/recovery-officer-dashboard.component';
import { BranchManagerDashboardComponent } from './branch-manager-dashboard/branch-manager-dashboard.component';
import { ZonalChiefDashboardComponent } from './zonal-chief-dashboard/zonal-chief-dashboard.component';
import { EvpOdDashboardComponent } from './evp-od-dashboard/evp-od-dashboard.component';

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
        EvpOdDashboardComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(route),
        SharedModule,
        NgApexchartsModule
    ]
})
export class DashboardModule {
}
