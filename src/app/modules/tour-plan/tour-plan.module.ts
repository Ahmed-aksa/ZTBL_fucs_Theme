import {CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {TourPlanComponent} from "./tour-plan/tour-plan.component";
import {SearchTourPlanComponent} from "./search-tour-plan/search-tour-plan.component";
import {CreateTourLlanComponent} from './create-tour-plan/create-tour-plan.component';
import {CreateTourPlanPopupComponent} from './create-tour-plan/create-tour-plan-popup/create-tour-plan-popup.component';
import {TargetsHierarchyComponent} from './targets-hierarchy/targets-hierarchy.component';
import {TargetsTrackingComponent} from './targets-tracking/targets-tracking.component';
import { TourPlanForApprovalComponent } from './tour-plan-for-approval/tour-plan-for-approval.component';

export let AppInjector: Injector;
const routing = [

    // {
    //     path: "tour-plan",
    //     component: TourPlanComponent,
    // },
    {
        path: "tour-plan",
        component: CreateTourLlanComponent,
    },
    {
        path: "search-tour-plan",
        component: SearchTourPlanComponent,
    },
    {
        path: "target-hierarchy",
        component: TargetsHierarchyComponent,
    },
    {
        path: "target-tracking",
        component: TargetsTrackingComponent,
    },
    {
        path: "tour-plan-for-approval",
        component: TourPlanForApprovalComponent,
    },
]

@NgModule({
    declarations: [
        TourPlanComponent,
        SearchTourPlanComponent,
        CreateTourLlanComponent,
        CreateTourPlanPopupComponent,
        TargetsTrackingComponent,
        TourPlanForApprovalComponent
        // TourPlanForApprovalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routing),
    ],
    entryComponents: [
        //    ViewFileComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    exports: [
        // AppInjector,
    ]
})
export class TourPlanModule {
    constructor(private injector: Injector) {
        AppInjector = this.injector;
    }
}
