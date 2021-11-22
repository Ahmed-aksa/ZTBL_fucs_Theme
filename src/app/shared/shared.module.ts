import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from "ngx-toastr";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCardModule} from "@angular/material/card";
import {MatSortModule} from "@angular/material/sort";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";
import {MatListModule} from "@angular/material/list";
import {MatChipsModule} from "@angular/material/chips";
import {MatTreeModule} from "@angular/material/tree";
import {NgxPaginationModule} from 'ngx-pagination';
import {MatRadioModule} from "@angular/material/radio";
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {NgxMaskModule} from 'ngx-mask';
import {NgxSpinnerModule} from 'ngx-spinner';
import {AgmCoreModule} from "@agm/core";
import {
    ActionNotificationComponent,
    AlertComponent,
    AlertDialogCaptureComponent, AlertDialogComponent,
    AlertDialogConfirmationComponent,
    AlertDialogSuccessComponent,
    AlertDialogWarnComponent,
    AlertMessageComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
} from "./crud";
import {MatNativeDateModule} from "@angular/material/core";
import {HttpUtilsService} from "./services/http_utils.service";
import {UserUtilsService} from "./services/users_utils.service";
import {LayoutUtilsService} from "./services/layout_utils.service";
import {ViewFileComponent} from './component/view-file/view-file.component';
import {AlphabetOnlyDirective} from './directives/alphabet-only.directive';
import {NumberOnlyDirective} from './directives/number-only.directive';
import {AlphaNumericFieldDirective} from './directives/alpha-numeric-field.directive';
import {CapsOnlyDirective} from './directives/caps-only.directive';
import {AlphaNumSpecialDirective} from './directives/alpha-num-special.directive';
import {NumberAndDecimalDirective} from './directives/number-and-decimal.directive';
import {ZoneBranchCircleComponent} from "../zone-branch-circle/zone-branch-circle.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ViewMapsComponent} from "./component/view-map/view-map.component";


@NgModule({
    declarations: [
        UpdateStatusDialogComponent,
        FetchEntityDialogComponent,
        DeleteEntityDialogComponent,
        AlertMessageComponent,
        AlertDialogWarnComponent,
        AlertDialogSuccessComponent,
        AlertDialogConfirmationComponent,
        AlertDialogCaptureComponent,
        AlertDialogComponent,
        AlertComponent,
        ActionNotificationComponent,
        ViewFileComponent,
        AlphabetOnlyDirective,
        NumberOnlyDirective,
        AlphaNumericFieldDirective,
        CapsOnlyDirective,
        AlphaNumSpecialDirective,
        NumberAndDecimalDirective,
        ZoneBranchCircleComponent,
        ViewMapsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        FormsModule,
        MatSelectModule,
        MatInputModule,
        MatTableModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatIconModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatCardModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatTabsModule,
        MatTooltipModule,
        MatDialogModule,
        MatButtonModule,
        MatListModule,
        MatChipsModule,
        MatTreeModule,
        NgxMatSelectSearchModule,
        NgxMaskModule.forRoot(),
        NgxSpinnerModule,
        NgxPaginationModule,
        MatFormFieldModule,
        MatInputModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC3SrcUt_3iPERnX-hk46YYsKJiCTzJ5z0',
            libraries: ['places', 'drawing', 'geometry'],
        }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
        MatTableModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatIconModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatCardModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatTabsModule,
        MatTooltipModule,
        MatDialogModule,
        MatButtonModule,
        MatListModule,
        MatChipsModule,
        MatTreeModule,
        NgxMatSelectSearchModule,
        NgxMaskModule,
        NgxSpinnerModule,
        NgxPaginationModule,
        AgmCoreModule,
        AlertComponent,
        AlphabetOnlyDirective,
        NumberOnlyDirective,
        AlphaNumericFieldDirective,
        CapsOnlyDirective,
        AlphaNumSpecialDirective,
        NumberAndDecimalDirective,
        ZoneBranchCircleComponent,
    ],
    entryComponents: [
        UpdateStatusDialogComponent,
        FetchEntityDialogComponent,
        DeleteEntityDialogComponent,
        AlertMessageComponent,
        AlertDialogWarnComponent,
        AlertDialogSuccessComponent,
        AlertDialogConfirmationComponent,
        AlertDialogCaptureComponent,
        AlertDialogComponent,
        AlertComponent,
        ActionNotificationComponent,
        ViewMapsComponent
    ],
    providers: [
        HttpUtilsService,
        UserUtilsService,
        LayoutUtilsService
    ]
})
export class SharedModule {
}
