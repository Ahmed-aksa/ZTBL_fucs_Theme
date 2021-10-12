import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {GeoFencingListComponent} from './geo-fencing-list/geo-fencing-list.component';
import {ViewGetFancingModalComponent} from "./view-get-fancing-modal/view-get-fancing-modal.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {RouterModule} from "@angular/router";

const routes = [
    {
        path: '',
        component: GeoFencingListComponent
    }
]

@NgModule({
    declarations: [
        GeoFencingListComponent,
        ViewGetFancingModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MatSidenavModule,
        DragDropModule,
        RouterModule.forChild(routes)
    ],
    entryComponents: [
        ViewGetFancingModalComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class GeoFencingModule {
}
