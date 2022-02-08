import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetTargetComponent} from './set-target/set-target.component';
import {SignatureDailogDairyComponent} from './signature-dailog-dairy/signature-dailog-dairy.component';
import {TourDiaryMcoComponent} from './tour-dairy-mco/tour-dairy-mco.component';
import {TourDiaryZcComponent} from './tour-dairy-zc/tour-dairy-zc.component';
import {TourDiaryZmComponent} from './tour-dairy-zm/tour-dairy-zm.component';
import {ViewFileComponent} from './view-file/view-file.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgxSpinnerModule} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {SignaturePadModule} from "angular2-signaturepad";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {SetTargetService} from "./set-target/Services/set-target.service";
import {SharedModule} from 'app/shared/shared.module';
import { ViewTargetComponent } from './view-target/view-target.component';
import {TargetsComponent} from "./Targets.component";
import { TourDiaryRoComponent } from './tour-diary-ro/tour-diary-ro.component';
import { TourDiaryBmComponent } from './tour-diary-bm/tour-diary-bm.component';
import { TourDiaryPcComponent } from './tour-diary-pc/tour-diary-pc.component';
import { TourDiaryRcComponent } from './tour-diary-rc/tour-diary-rc.component';
import {SetTargetTabsComponent} from "./set-target-tabs/set-target-tabs.component";
import {IConfig, NgxMaskModule} from "ngx-mask";
import {NgxMaterialTimepickerComponent, NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {SearchTourDiaryComponent} from "./search-tour-diary/search-tour-diary.component";
export const options: Partial<IConfig> = {
    thousandSeparator: ","
};



const routing = [
    {
        path: "set-target",
        component: TargetsComponent,
    },
    {
        path: "view-targets",
        component: TargetsComponent,
    },
    {
        path: "create-tour-diary",
        component: TourDiaryMcoComponent,
    },
    {
        path: "create-tour-diary-zm",
        component: TourDiaryZmComponent,
    },
    {
        path: "create-tour-diary-zc",
        component: TourDiaryZcComponent,
    },
    {
        path: "create-tour-diary-bm",
        component: TourDiaryBmComponent,
    },
    {
        path: "create-tour-diary-pc",
        component: TourDiaryPcComponent,
    },
    {
        path: "create-tour-diary-ro",
        component: TourDiaryRoComponent,
    },
    {
        path: "create-tour-diary-rc",
        component: TourDiaryRcComponent,
    },
    {
        path: "view-target",
        component: ViewTargetComponent,
    },{
        path: "search-tour-diary",
        component: SearchTourDiaryComponent,
    }
];


@NgModule({
    declarations: [
        SetTargetComponent,
        SignatureDailogDairyComponent,
        TourDiaryMcoComponent,
        TourDiaryZcComponent,
        TourDiaryZmComponent,
        ViewFileComponent,
        ViewTargetComponent,
        TargetsComponent,
        TourDiaryRcComponent,
        TourDiaryPcComponent,
        TourDiaryBmComponent,
        TourDiaryRoComponent,
        SetTargetTabsComponent,
        SearchTourDiaryComponent
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
        NgxMaskModule.forRoot(options),
        NgxMaterialTimepickerModule.setLocale('en-US')
    ],
    providers: [
        DatePipe,
        SetTargetService
    ],
})
export class TourDiaryModule {
}
