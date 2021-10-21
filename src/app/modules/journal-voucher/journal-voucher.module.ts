import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {JvmasterCodeDialogComponentComponent} from './jvmaster-code-dialog-component/jvmaster-code-dialog-component.component';
import {JvOrganizationalStructureComponentComponent} from './jv-organizational-structure-component/jv-organizational-structure-component.component';
import {SharedModule} from "../../shared/shared.module";
import {JvFormComponent} from './jv-form/jv-form.component';
import {SearchJvFormComponent} from './search-jv-form/search-jv-form.component';
import {SearchJvRbComponent} from './search-jv-rb/search-jv-rb.component';
import {SearchJvPendingComponent} from './search-jv-pending/search-jv-pending.component';
import {RouterModule} from "@angular/router";
import {SearchJvComponent} from './search-jv/search-jv.component';


@NgModule({
    declarations: [
        JvmasterCodeDialogComponentComponent,
        JvOrganizationalStructureComponentComponent,
        JvFormComponent,
        SearchJvFormComponent,
        SearchJvRbComponent,
        SearchJvPendingComponent,
        SearchJvComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'form',
                component: JvFormComponent,
            },
            {
                path: 'form/:up-flag',
                component: JvFormComponent,
            },
            {
                path: 'search-jv',
                component: SearchJvComponent
            },
            {
                path: 'search-refer-back',
                component: SearchJvRbComponent,
            },
            {
                path: 'search-pending',
                component: SearchJvPendingComponent
            }
        ]),
        SharedModule
    ],
    entryComponents: [
        JvmasterCodeDialogComponentComponent,
        JvOrganizationalStructureComponentComponent
    ],
    providers: [
        DatePipe
    ]

})
export class JournalVoucherModule {
}
