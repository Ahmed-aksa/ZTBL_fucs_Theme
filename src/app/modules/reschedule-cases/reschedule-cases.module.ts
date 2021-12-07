/* eslint-disable eol-last */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MakeRcComponent} from './make-reschedule/make-reschedule.component';
import {PendingRescheduleCasesComponent} from './pending-reschedule-cases/pending-reschedule-cases.component';
import {ReferBackRescheduleCasesComponent} from './refer-back-reschedule-cases/refer-back-reschedule-cases.component';
import {RequestForRlComponent} from './request-for-rl/request-for-rl.component';
import {SearchRcComponent} from './search-rc/search-rc.component';
import {NewGlCodeComponent} from './make-reschedule/new-gl-code/new-gl-code.component';
import {SharedModule} from 'app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {UploadDocumentsComponent} from './make-reschedule/upload-documents/upload-documents.component';

@NgModule({
    declarations: [
        MakeRcComponent,
        PendingRescheduleCasesComponent,
        ReferBackRescheduleCasesComponent,
        RequestForRlComponent,
        SearchRcComponent,
        NewGlCodeComponent,
        UploadDocumentsComponent
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
