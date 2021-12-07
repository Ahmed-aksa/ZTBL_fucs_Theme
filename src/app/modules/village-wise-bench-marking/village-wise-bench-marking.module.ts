import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddUpdateBenchMarkingComponent} from './add-update-bench-marking/add-update-bench-marking.component';
import {GetVillageBenchMarkingComponent} from './get-village-bench-marking/get-village-bench-marking.component';
import {RemarkDialogComponent} from './get-village-bench-marking/remark-dialog/remark-dialog.component';
import {SharedModule} from 'app/shared/shared.module';
import {RouterModule} from '@angular/router';

const route = [
    {
        path: 'add-update-bench-marking',
        component: AddUpdateBenchMarkingComponent
    },
    {
        path: 'get-village-bench-marking',
        component: GetVillageBenchMarkingComponent

    }
];


@NgModule({
    declarations: [
        AddUpdateBenchMarkingComponent,
        GetVillageBenchMarkingComponent,
        RemarkDialogComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(route)
    ],
    entryComponents: [
        RemarkDialogComponent
    ]
})
export class VillageWiseBenchMarkingModule {
}
