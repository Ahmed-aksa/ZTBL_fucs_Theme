import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MakeRcComponent} from './make-rc/make-rc.component';
import {PendingRescheduleCasesComponent} from './pending-reschedule-cases/pending-reschedule-cases.component';
import {ReferBackRescheduleCasesComponent} from './refer-back-reschedule-cases/refer-back-reschedule-cases.component';
import {RequestForRlComponent} from './request-for-rl/request-for-rl.component';
import {SearchRcComponent} from './search-rc/search-rc.component';
import {NewGlCodeComponent} from './make-rc/new-gl-code/new-gl-code.component';
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";


@NgModule({
    declarations: [
        MakeRcComponent,
        PendingRescheduleCasesComponent,
        ReferBackRescheduleCasesComponent,
        RequestForRlComponent,
        SearchRcComponent,
        NewGlCodeComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'make-reschedule',
                component: MakeRcComponent
            },
            {
                path: 'pending-reschedule',
                component: PendingRescheduleCasesComponent
            },
            {
                path: 'refer-back-reschedule',
                component: ReferBackRescheduleCasesComponent
            },
            {
                path: 'search-reschedule',
                component: SearchRcComponent
            },
            {
                path: 'request-reschedule-loan',
                component: RequestForRlComponent
            }
        ]),
        SharedModule
    ],
    entryComponents: [
        NewGlCodeComponent
    ]
})
export class RescheduleCasesModule {
}
