import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DeceasedCusComponent} from './deceased-cus/deceased-cus.component';
import {ImageViewerComponent} from './image-viewer/image-viewer.component';
import {ReferbackDeceasedComponent} from './referback-deceased/referback-deceased.component';
import {SearchDeceasedComponent} from './search-deceased/search-deceased.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {NgxSpinnerModule} from "ngx-spinner";
import {MatSortModule} from "@angular/material/sort";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {ViewFileComponent} from "./view-file/view-file.component";
import {SetTargetService} from "../tour-dairy/set-target/Services/set-target.service";
import {DeceasedCustomerService} from "./Services/deceased-customer.service";

const routes = [
    {
        path: 'customers',
        component: DeceasedCusComponent
    },
    {
        path: 'referback',
        component: ReferbackDeceasedComponent
    },
    {
        path: 'search',
        component: SearchDeceasedComponent
    }
]


@NgModule({
    declarations: [
        DeceasedCusComponent,
        ImageViewerComponent,
        ReferbackDeceasedComponent,
        SearchDeceasedComponent,
        ViewFileComponent,

    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        MatFormFieldModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatSelectModule,
        MatTableModule,
        NgxSpinnerModule,
        MatSortModule,
        SharedModule,
    ],
    providers: [
        DeceasedCustomerService,
        SetTargetService,

    ]

})
export class DeceasedCustomerModule {
}
