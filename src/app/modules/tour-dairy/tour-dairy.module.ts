import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetTargetComponent} from './set-target/set-target.component';
import {SignatureDailogDairyComponent} from './signature-dailog-dairy/signature-dailog-dairy.component';
import {TourDairyMcoComponent} from './tour-dairy-mco/tour-dairy-mco.component';
import {TourDairyZcComponent} from './tour-dairy-zc/tour-dairy-zc.component';
import {TourDairyZmComponent} from './tour-dairy-zm/tour-dairy-zm.component';
import {ViewFileComponent} from './view-file/view-file.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgxSpinnerModule} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {SignaturePad, SignaturePadModule} from "angular2-signaturepad";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {SetTargetService} from "./set-target/Services/set-target.service";
import {SharedModule} from "../../shared/shared.module";

const routing = [
    {
        path: "set-target",
        component: SetTargetComponent,
    },
    {
        path: "create-tour-diary",
        component: TourDairyMcoComponent,
    },
    {
        path: "create-tour-diary-zm",
        component: TourDairyZmComponent,
    },
    {
        path: "create-tour-diary-zc",
        component: TourDairyZcComponent,
    },
];


@NgModule({
    declarations: [
        SetTargetComponent,
        SignatureDailogDairyComponent,
        TourDairyMcoComponent,
        TourDairyZcComponent,
        TourDairyZmComponent,
        ViewFileComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routing),
        SharedModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        NgxSpinnerModule,
        MatButtonModule,
        SignaturePadModule,
        MatDatepickerModule,
        MatIconModule,
        MatDialogModule,

    ],
    providers: [
        DatePipe,
        SetTargetService
    ],
})
export class TourDairyModule {
}
