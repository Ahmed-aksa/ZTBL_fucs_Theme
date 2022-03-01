import {CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {TourPlanComponent} from "./tour-plan/tour-plan.component";
import {SearchTourPlanComponent} from "./search-tour-plan/search-tour-plan.component";
import {CreateTourPlanMcoComponent} from './create-tour-plan/create-tour-plan-mco.component';
import {CreateTourPlanPopupComponent} from './create-tour-plan/create-tour-plan-popup/create-tour-plan-popup.component';
import {TargetsHierarchyComponent} from './targets-hierarchy/targets-hierarchy.component';
import {TargetsTrackingComponent} from './targets-tracking/targets-tracking.component';
import {TourPlanForApprovalComponent} from './tour-plan-for-approval/tour-plan-for-approval.component';
import {SignaturePadForTourComponent} from './signature-pad-for-tour/signature-pad-for-tour.component';
import {SignaturePadModule} from "angular2-signaturepad";
import { TourApprovalTabComponent } from './tour-approval-tab/tour-approval-tab.component';
import {ViewTourPlanComponent} from "./view-tour-plan/view-tour-plan.component";
import {ViewTourTabComponent} from "./view-tour-tab/view-tour-tab.component";
import {CreateTourPlanZCComponent} from "./create-tour-plan-zc/create-tour-plan-zc.component";
import { CreateTourPlanZmComponent } from './create-tour-plan-zm/create-tour-plan-zm.component';
import { CreateTourPlanPcComponent } from './create-tour-plan-pc/create-tour-plan-pc.component';
import { CreateTourPlanRoComponent } from './create-tour-plan-ro/create-tour-plan-ro.component';
import { CreateTourPlanRcComponent } from './create-tour-plan-rc/create-tour-plan-rc.component';
import { CreateTourPlanBmComponent } from './create-tour-plan-bm/create-tour-plan-bm.component';
import {SearchTourPlanTabComponent} from "./search-tour-plan-tab/search-tour-plan-tab.component";

export let AppInjector: Injector;
const routing = [

    // {
    //     path: "tour-plan",
    //     component: TourPlanComponent,
    // },
    {
        path: "create-tour-plan-mco",
        component: CreateTourPlanMcoComponent,
    },{
        path: "create-tour-plan-bm",
        component: CreateTourPlanBmComponent,
    },
    {
        path: "create-tour-plan-ro",
        component: CreateTourPlanRoComponent,
    },
    {
        path: "create-tour-plan-zm",
        component: CreateTourPlanZmComponent,
    },
    {
        path: "create-tour-plan-zc",
        component: CreateTourPlanZCComponent,
    },
    {
        path: "create-tour-plan-rc",
        component: CreateTourPlanRcComponent,
    },
    {
        path: "create-tour-plan-pc",
        component: CreateTourPlanPcComponent,
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
    {
        path: "view-tour-plan",
        component: ViewTourPlanComponent,
    },
]

@NgModule({
    declarations: [
        TourPlanComponent,
        SearchTourPlanComponent,
        CreateTourPlanMcoComponent,
        CreateTourPlanPopupComponent,
        TargetsTrackingComponent,
        TourPlanForApprovalComponent,
        SignaturePadForTourComponent,
        TourApprovalTabComponent,
        ViewTourTabComponent,
        ViewTourPlanComponent,
        CreateTourPlanZCComponent,
        CreateTourPlanZmComponent,
        CreateTourPlanPcComponent,
        CreateTourPlanRoComponent,
        CreateTourPlanRcComponent,
        CreateTourPlanBmComponent,
        SearchTourPlanTabComponent

        // ViewTourPlanComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routing),
        SignaturePadModule,
    ],
    entryComponents: [
        SignaturePadForTourComponent,
        //    ViewFileComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    exports: [
        TourApprovalTabComponent,
        // AppInjector,
    ]
})
export class TourPlanModule {
    constructor(private injector: Injector) {
        AppInjector = this.injector;
    }
}
