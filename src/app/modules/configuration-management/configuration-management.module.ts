import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfigurationManagementComponent} from './configuration-management.component';
import {DocumentTypeListComponent} from './document-type-list/document-type-list.component';
import {DocumentTypeEditComponent} from './document-type-edit/document-type-edit.component';
import {ConfigurationListComponent} from './configuration-list/configuration-list.component';
import {ConfigurationEditComponent} from './configuration-edit/configuration-edit.component';
import {ConfigurationHistoryComponent} from './configuration-history/configuration-history.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {RefreshLovComponent} from "./refresh-lov/refresh-lov.component";


const routes: Routes = [
    {
        path: '',
        component: ConfigurationManagementComponent,
        children: [
            {
                path: '',
                redirectTo: 'configurations',
                pathMatch: 'full'
            },
            {
                path: 'configurations',
                component: ConfigurationListComponent
            },
            {
                path: 'document-types',
                component: DocumentTypeListComponent
            },
            {
                path: 'refresh-lovs',
                component: RefreshLovComponent
            },
        ]
    }
];

@NgModule({
    declarations: [
        ConfigurationManagementComponent,
        DocumentTypeListComponent,
        DocumentTypeEditComponent,
        ConfigurationListComponent,
        ConfigurationEditComponent,
        ConfigurationHistoryComponent,
        RefreshLovComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    entryComponents: [
        ConfigurationListComponent,
        DocumentTypeEditComponent
    ],
    providers: []
})
export class ConfigurationManagementModule {
}
