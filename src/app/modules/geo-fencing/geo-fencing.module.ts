import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {GeoFencingListComponent} from './geo-fencing-list/geo-fencing-list.component';
import {ViewGetFancingModalComponent} from "./view-get-fancing-modal/view-get-fancing-modal.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {RouterModule} from "@angular/router";
import {GeoFencingService} from "./service/geo-fencing-service.service";
import {AgmCoreModule} from "@agm/core";

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
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC3SrcUt_3iPERnX-hk46YYsKJiCTzJ5z0',
            libraries: ['places', 'drawing', 'geometry'],
        }),
    ],
    entryComponents: [
        ViewGetFancingModalComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [
        GeoFencingService
    ]
})
export class GeoFencingModule {
}
