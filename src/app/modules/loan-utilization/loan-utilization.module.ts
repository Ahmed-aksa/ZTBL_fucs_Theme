import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {SearchLoanUtilizationComponent} from './search-loan-uti/search-loan-uti.component';
import {SearchUtilizationComponent} from './search-utilization/search-utilization.component';
import {LoanUtilizationComponent} from './loan-utilization/loan-utilization.component';
import {ViewFileComponent} from './view-file/view-file.component';
import {MatInputModule} from "@angular/material/input";

const routing = [

    {
        path: 'loan-uti',
        component: LoanUtilizationComponent
    },
    {
        path: 'search-uti',
        component: SearchUtilizationComponent
    },
    {
        path: 'search-loan-uti',
        component: SearchLoanUtilizationComponent
    },

]

@NgModule({
    declarations: [SearchLoanUtilizationComponent, SearchUtilizationComponent, LoanUtilizationComponent, ViewFileComponent,],
    imports: [
        CommonModule,
        SharedModule,
        MatInputModule,
        RouterModule.forChild(routing),
    ],
    entryComponents: [
        ViewFileComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class LoanUtilizationModule {
}
