import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {TourPlanComponent} from "./tour-plan/tour-plan.component";
import {SearchTourPlanComponent} from "./search-tour-plan/search-tour-plan.component";

const routing = [

    {
        path: "create-tour-plan",
        component: TourPlanComponent,
    },
    {
        path: "search-tour-plan",
        component: SearchTourPlanComponent,
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
