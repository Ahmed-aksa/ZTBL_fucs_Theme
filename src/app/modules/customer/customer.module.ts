import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckEligibilityComponent} from './check-eligibility/check-eligibility.component';
import {CustomerProfileComponent} from './customer-profile/customer-profile.component';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomerListComponent} from './customer-list/customer-list.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {NgxMaskModule} from 'ngx-mask';
import {AuthorizedCustomersComponent} from './authorized-customers/authorized-customers.component';
import {PendingCustomersComponent} from './pending-customers/pending-customers.component';
import {SubmitCustomersComponent} from './submit-customers/submit-customers.component';
import {ReferbackCustomersComponent} from './referback-customers/referback-customers.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {CorrectionPassbookComponent} from './correction-passbook/correction-passbook.component';
import {CorrectionPhoneComponent} from './correction-phone/correction-phone.component';
import {CoreModule} from 'app/core/core.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {SharedModule} from 'app/shared/shared.module';
import {CustomerComponent} from './customer.component';
import {AuthorizedCustomerComponent} from './authorized-customer/authorized-customer.component';
import {EligibilityRequestComponent} from './eligibility-request/eligibility-request.component';
import {ConsentFormComponent} from './consent-form/consent-form.component';
import {NgImageSliderModule} from "ng-image-slider";
import {ImagePopupComponent} from './image-popup/image-popup.component';
import {CustomerHistoryComponent} from './customer-history/customer-history.component';
import {SubmitDocumentsComponent} from './submit-documents/submit-documents.component';

//import {NgImageSliderModule} from "ng-image-slider";

@NgModule({
    declarations: [CheckEligibilityComponent, CustomerProfileComponent, CustomerListComponent, AuthorizedCustomersComponent, PendingCustomersComponent, SubmitCustomersComponent, ReferbackCustomersComponent, CorrectionPassbookComponent, CorrectionPhoneComponent, CustomerComponent, AuthorizedCustomerComponent, EligibilityRequestComponent, ConsentFormComponent, ImagePopupComponent, CustomerHistoryComponent, SubmitDocumentsComponent],
    exports: [CustomerListComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: 'customer-Profile',
                component: CustomerProfileComponent

            },
            {
                path: 'customerProfile',
                component: CustomerProfileComponent

            },
            {
                path: 'authorized-customers',
                component: AuthorizedCustomersComponent

            },
            {
                path: 'pending-customers',
                component: PendingCustomersComponent

            },
            {
                path: 'submit-customers',
                component: SubmitCustomersComponent

            },
            {
                path: 'referback-customers',
                component: ReferbackCustomersComponent

            },
            {
                path: 'check-eligibility',
                component: CheckEligibilityComponent
            },
            {
                path: 'search-customer',
                component: CustomerListComponent

            },
            {
                path: 'correction-passbook',
                component: CorrectionPassbookComponent

            },
            {
                path: 'correction-phonecell',
                component: CorrectionPhoneComponent

            },
            {
                path: 'eligibility-request',
                component: EligibilityRequestComponent
            }, {
                path: 'customer-history',
                component: CustomerHistoryComponent
            }
        ]),
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
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
        MatCardModule,
        MatChipsModule,
        NgxMatSelectSearchModule,
        NgxMaskModule.forRoot(),
        NgxSpinnerModule,
        NgImageSliderModule,
        //NgImageSliderModule
    ],
    entryComponents: [ConsentFormComponent, ImagePopupComponent, SubmitDocumentsComponent]

})
export class CustomerModule {
}
