import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReportManagmentComponent} from './report-managment.component';
import {ApilogDetailComponent} from './apilog-detail/apilog-detail.component';
import {ApilogsListComponent} from './apilogs-list/apilogs-list.component';
import {EcibQueueComponent} from './ecib-queue/ecib-queue.component';
import {McoReoveryCountsComponent} from './mco-reovery-counts/mco-reovery-counts.component';
import {SharedModule} from "../../shared/shared.module";
import {NotificationHistoryComponent} from './notification-history/notification-history.component';
import {RouterModule, Routes} from "@angular/router";
import {ExceptionDetailComponent} from './exception-detail/exception-detail.component';
import {ExceptionlogListComponent} from "./exception-log/exception-log.component";
import {NotificationDetailsComponent} from "./notification-detail/notification-detail.component";
import {LocationDetailsComponent} from './location-details/location-details.component';
import {LocationHistoryListComponent} from "./location-history/location-history.component";

const routes: Routes = [
    {
        path: '',
        component: ReportManagmentComponent,
        children: [
            {
                path: '',
                redirectTo: 'api-logs',
                pathMatch: 'full'
            },
            {
                path: 'api-logs',
                component: ApilogsListComponent
            },
            {
                path: 'exception-logs',
                component: ExceptionlogListComponent
            },
            {
                path: 'notification-history',
                component: NotificationHistoryComponent
            },
            {
                path: 'user-history',
                component: LocationHistoryListComponent
            },

            {
                path: 'ecib-qeue',
                component: EcibQueueComponent
            },
            {
                path: 'mco-recovery-count',
                component: McoReoveryCountsComponent
            }

        ]
    }
];

@NgModule({
    declarations: [
        ReportManagmentComponent,
        ApilogDetailComponent,
        ApilogsListComponent,
        EcibQueueComponent,
        ExceptionlogListComponent,
        LocationHistoryListComponent,
        McoReoveryCountsComponent,
        NotificationHistoryComponent,
        ExceptionDetailComponent,
        NotificationDetailsComponent,
        LocationDetailsComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    entryComponents:
        [
            ApilogDetailComponent,
            ExceptionDetailComponent,
            NotificationDetailsComponent,
            LocationDetailsComponent
        ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportManagmentModule {
}
