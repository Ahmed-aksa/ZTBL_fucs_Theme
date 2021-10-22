import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'app/shared/shared.module';
import {VendorListComponent} from './vendor-list/vendor-list.component';
import {AddNewVendorComponent} from './add-new-vendor/add-new-vendor.component';
import {VendorRadiusComponent} from './vendor-radius/vendor-radius.component';
import {UserInfoDialogComponent} from './vendor-radius/user-info-dialog/user-info-dialog.component';
import { AddressLocationComponent } from './add-new-vendor/address-location/address-location.component';

const route = [
    {
        path: 'add-vendor',
        component: AddNewVendorComponent
    },
    {
        path: 'add-vendor/:upFlag',
        component: AddNewVendorComponent

    },
    {
        path: 'view-list',
        component: VendorListComponent
    },
    {
        path: 'vendor-radius',
        component: VendorRadiusComponent
    }
];

@NgModule({
    declarations: [
        VendorListComponent,
        AddNewVendorComponent,
        VendorRadiusComponent,
        UserInfoDialogComponent,
        AddressLocationComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(route),
    ],
    entryComponents: [
        UserInfoDialogComponent,
        AddressLocationComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class KhaadSeedVendorModule {
}
