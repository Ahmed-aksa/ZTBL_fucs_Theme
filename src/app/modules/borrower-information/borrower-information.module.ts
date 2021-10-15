import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BorrowerInformationComponent} from './borrower-information.component';
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";


const route=[
    {
        path: '',
        component: BorrowerInformationComponent
    }
]

@NgModule({
    declarations: [
        BorrowerInformationComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(route),
        SharedModule
    ]
})
export class BorrowerInformationModule {
}
