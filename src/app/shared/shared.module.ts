import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from "ngx-toastr";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import { AlertDialogComponent, AlertDialogSuccessComponent, AlertDialogWarnComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from './crud';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ProfileService } from 'app/modules/user-management/activity/profile.service';
import { HttpUtilsService } from './services/http_utils.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
    declarations: [
        AlertDialogComponent,
        AlertDialogSuccessComponent,
        DeleteEntityDialogComponent,
        AlertDialogWarnComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        MatPaginatorModule,
        MatInputModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatFormFieldModule,
        MatRippleModule,
        MatDialogModule,
        HttpClientModule,
        MatSnackBarModule,
        ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule,
        MatPaginatorModule,
        MatInputModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatFormFieldModule,
        MatRippleModule,
        MatDialogModule,
        MatSnackBarModule,
        
    ],
    providers:[
    ]
})
export class SharedModule {
}
