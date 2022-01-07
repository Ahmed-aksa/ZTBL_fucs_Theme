import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {TourPlanComponent} from "./tour-plan/tour-plan.component";
import {SearchTourPlanComponent} from "./search-tour-plan/search-tour-plan.component";
import {CreateTourLlanComponent} from './create-tour-plan/create-tour-plan.component';
import {TargetsHierarchyComponent} from "./targets-hierarchy/targets-hierarchy.component";

const routing = [

    {
        path: "tour-plan",
        component: TourPlanComponent,
    },
    {
        path: "search-tour-plan",
        component: SearchTourPlanComponent,
    },
    {
        path: "target-hierarchy",
        component: TargetsHierarchyComponent,
    },
    // {
    //     path: "tour-plan-for-approval",
    //     component: TourPlanForApprovalComponent,
    // },
]

@NgModule({
    declarations: [
        TourPlanComponent,
        SearchTourPlanComponent,
        CreateTourLlanComponent,
        TargetsHierarchyComponent
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
    ]
})
export class TourPlanModule {
}
