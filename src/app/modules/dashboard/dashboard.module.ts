import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import { NgApexchartsModule } from "ng-apexcharts";
import { McoDashboradComponent } from './mco-dashborad/mco-dashborad.component';

const route = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'mcoDashborad',
        component: McoDashboradComponent
    }
];

@NgModule({
    declarations: [
        DashboardComponent,
        McoDashboradComponent
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
