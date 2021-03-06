import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FuseCardModule} from "../../../@fuse/components/card";
import {FuseAlertModule} from "../../../@fuse/components/alert";
import {SharedModule} from "../../shared/shared.module";
import {AuthSignInComponent} from "./sign-in/sign-in.component";
import {RouterModule} from "@angular/router";
import {OtpComponent} from './otp/otp.component';

const route = [
    {
        path: 'sign-in',
        component: AuthSignInComponent
    }
]

@NgModule({
    declarations: [
        AuthSignInComponent,
        OtpComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule,
        RouterModule.forChild(route)

    ]
})
export class AuthModule {
}
