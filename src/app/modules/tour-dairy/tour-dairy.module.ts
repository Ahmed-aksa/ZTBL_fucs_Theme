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
import {ViewTargetComponent} from './view-target/view-target.component';
import {TargetsComponent} from "./Targets.component";
import {TourDiaryRoComponent} from './tour-diary-ro/tour-diary-ro.component';
import {TourDiaryBmComponent} from './tour-diary-bm/tour-diary-bm.component';
import {TourDiaryPcComponent} from './tour-diary-pc/tour-diary-pc.component';
import {TourDiaryRcComponent} from './tour-diary-rc/tour-diary-rc.component';
import {SetTargetTabsComponent} from "./set-target-tabs/set-target-tabs.component";
import {IConfig, NgxMaskModule} from "ngx-mask";
import {NgxMaterialTimepickerComponent, NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {SearchTourDiaryComponent} from "./search-tour-diary/search-tour-diary.component";
import {TourDiaryApprovalComponent} from './tour-diary-approval/tour-diary-approval.component';
import {TourPlanModule} from "../tour-plan/tour-plan.module";
import {TourApprovalTabComponent} from "./tour-diary-approval-tab/tour-diary-approval-tab.component";
import {TourDiaryApprovalBmComponent} from "./tour-diary-approval-bm/tour-diary-approval-bm.component";
import {TourDiaryApprovalZmComponent} from "./tour-diary-approval-zm/tour-diary-approval-zm.component";
import {TourDiaryApprovalMcoComponent} from "./tour-diary-approval-mco/tour-diary-approval-mco.component";
import {TourDiaryApprovalPcComponent} from "./tour-diary-approval-pc/tour-diary-approval-pc.component";
import {TourDiaryApprovalRcComponent} from "./tour-diary-approval-rc/tour-diary-approval-rc.component";
import {TourDiaryApprovalRoComponent} from "./tour-diary-approval-ro/tour-diary-approval-ro.component";
import {TourDiaryApprovalZcComponent} from "./tour-diary-approval-zc/tour-diary-approval-zc.component";

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
        path: "create-tour-diary-approval-bm",
        component: TourDiaryBmComponent,
    },
    {
        path: "create-tour-diary-approval-pc",
        component: TourDiaryPcComponent,
    },
    {
        path: "create-tour-diary-approval-ro",
        component: TourDiaryRoComponent,
    },
    {
        path: "create-tour-diary-approval-rc",
        component: TourDiaryRcComponent,
    },
    {
        path: "view-target",
        component: ViewTargetComponent,
    },
    {
        path: "search-tour-diary",
        component: SearchTourDiaryComponent,
    },
    {
        path: "tour-diary-approval",
        component: TourDiaryApprovalComponent,
    },
    //Approval URL
    {
        path: "tour-diary-approval-bm",
        component: TourDiaryApprovalBmComponent,
    }, {
        path: "tour-diary-approval-zm",
        component: TourDiaryApprovalZmComponent,
    }, {
        path: "tour-diary-approval-mco",
        component: TourDiaryApprovalMcoComponent,
    }, {
        path: "tour-diary-approval-pc",
        component: TourDiaryApprovalPcComponent,
    }, {
        path: "tour-diary-approval-rc",
        component: TourDiaryApprovalRcComponent,
    }, {
        path: "tour-diary-approval-ro",
        component: TourDiaryApprovalRoComponent,
    }, {
        path: "tour-diary-approval-zc",
        component: TourDiaryApprovalZcComponent,
    },
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
        SearchTourDiaryComponent,
        TourDiaryApprovalComponent,
        TourApprovalTabComponent,

        // Diary Approvals
        TourDiaryApprovalBmComponent,
        TourDiaryApprovalZmComponent,
        TourDiaryApprovalMcoComponent,
        TourDiaryApprovalPcComponent,
        TourDiaryApprovalRcComponent,
        TourDiaryApprovalRoComponent,
        TourDiaryApprovalZcComponent


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
        NgxMaterialTimepickerModule.setLocale('en-US'),
        TourPlanModule
    ],
    providers: [
        DatePipe,
        SetTargetService
    ],
})
export class TourDiaryModule {
}
