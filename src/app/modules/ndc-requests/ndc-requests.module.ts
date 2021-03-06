import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";
import {SearchNdcListComponent} from "./search-ndc-list/search-ndc-list.component";

const routing = [
    {
        path: 'search-ndc-list',
        component: SearchNdcListComponent
    },
]

@NgModule({
    declarations: [
        SearchNdcListComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routing),
        MatTableModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        SharedModule
    ],
    exports: [
        SearchNdcListComponent
    ]
})
export class NdcRequestsModule {
}
