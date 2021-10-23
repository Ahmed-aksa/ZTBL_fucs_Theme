import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DeceasedCusComponent} from './deceased-cus/deceased-cus.component';
import {ImageViewerComponent} from './image-viewer/image-viewer.component';
import {ReferbackDeceasedComponent} from './referback-deceased/referback-deceased.component';
import {SearchDeceasedComponent} from './search-deceased/search-deceased.component';
import {ViewfileComponent} from './viewfile/viewfile.component';
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

const routes = [
    {
        path: 'deceased-customers',
        component: DeceasedCusComponent
    },
    {
        path: 'referback',
        component: ReferbackDeceasedComponent
    },
    {
        path: 'search-deceased',
        component: SearchDeceasedComponent
    }
]


@NgModule({
  declarations: [
    DeceasedCusComponent,
    ImageViewerComponent,
    ReferbackDeceasedComponent,
    SearchDeceasedComponent,
    ViewfileComponent
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
        SharedModule
    ],

})
export class DeceasedCustomerModule { }
