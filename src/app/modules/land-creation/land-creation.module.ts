import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AreaConverterComponent} from './area-converter/area-converter.component';
import {CorrectionPassbookComponent} from './correction-passbook/correction-passbook.component';
import {CustLandInformationComponent} from './cust-land-information/cust-land-information.component';
import {CustLandListComponent} from './cust-land-list/cust-land-list.component';
import {CustomerListDialogComponent} from './customer-list-dialog/customer-list-dialog.component';
import {LandChargeCreationComponent} from './land-charge-creation/land-charge-creation.component';
import {LargeFilesUploadComponent} from './large-files-upload/large-files-upload.component';
import {LandHistoryComponent} from './land-history/land-history.component';
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";
import {KtDialogService} from "../../shared/services/kt-dialog.service";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";


@NgModule({
    declarations: [
        AreaConverterComponent,
        CorrectionPassbookComponent,
        CustLandInformationComponent,
        CustLandListComponent,
        CustomerListDialogComponent,
        LandChargeCreationComponent,
        LargeFilesUploadComponent,
        LandHistoryComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
                {
                    path: 'land-info-add',
                    component: CustLandInformationComponent

                },
                {
                    path: 'land-info-add/:upFlag',
                    component: CustLandInformationComponent
                },
                {
                    path: 'land-info-list',
                    component: CustLandListComponent
                },
                {
                    path: 'land-info-history/:lID',
                    //path: 'land-info-history/:id/:id2',
                    component: LandHistoryComponent
                },
                {
                    path: 'correction-passbook',
                    component: CorrectionPassbookComponent

                }
            ]
        ),
        SharedModule
    ],
    entryComponents: [
        LandChargeCreationComponent,
        AreaConverterComponent,
        LargeFilesUploadComponent,
        LandHistoryComponent,
        CustomerListDialogComponent
    ],
})
export class LandCreationModule {
}
