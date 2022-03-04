import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'app/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
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
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {IconPickerModule} from 'ngx-icon-picker';
import {CreateLoanComponent} from './create-loan/create-loan.component';
import {ClApplicationHeaderComponent} from './cl-application-header/cl-application-header.component';
import {ClCustomersComponent} from './cl-customers/cl-customers.component';
import {ClPurposeComponent} from './cl-purpose/cl-purpose.component';
import {ClSecuritiesComponent} from './cl-securities/cl-securities.component';
import {ClLegalHeirsComponent} from './cl-legal-heirs/cl-legal-heirs.component';
import {
    ClAppraisalOfProposedInvestmentComponent
} from './cl-appraisal-of-proposed-investment/cl-appraisal-of-proposed-investment.component';
import {ClLoanWitnessComponent} from './cl-loan-witness/cl-loan-witness.component';
import {ClUploadDocumentComponent} from './cl-upload-document/cl-upload-document.component';
import {
    ClGlSchemeCropConfigurationComponent
} from './cl-gl-scheme-crop-configuration/cl-gl-scheme-crop-configuration.component';
import {ClDocumentViewComponent} from './cl-document-view/cl-document-view.component';
import {SaveOrrComponent} from './save-orr/save-orr.component';
import {OrrListComponent} from './orr-list/orr-list.component';
import {ClSearchLoanComponent} from './cl-search-loan/cl-search-loan.component';
import {CalculateDbrComponent} from './calculate-dbr/calculate-dbr.component';
import {SearchDbrComponent} from './search-dbr/search-dbr.component';
import {ReferbackLoanUtilizationComponent} from './referback-loan-from-orr/referback-loan-uti.component';
import {ClPendingLoanComponent} from "./cl-pending-loan/cl-pending-loan.component";
import {ChargeCreationLoanComponent} from "./search-charge-creation-loan/search-charge-creation-loan.component";
import {ClViewLoanComponent} from "./cl-view-loan/cl-view-loan.component";
import {ReferbackLoanFromCADComponent} from "./referback-loan-from-CAD/referback-loan-from-CAD.component";
import {RejectedLoanComponent} from "./rejected-loan/rejected-loan.component";

const routing = [
    {
        path: 'create',
        component: CreateLoanComponent
    },
    {
        path: 'create/:transactionID/:lcno',
        component: CreateLoanComponent
    },
    {
        path: 'save-orr',
        component: SaveOrrComponent
    },
    {
        path: 'orr-list',
        component: OrrListComponent
    },
    {
        path: 'search',
        component: ClSearchLoanComponent
    },
    {
        path: 'view-loan',
        component: ClViewLoanComponent
    },

    {
        path: 'pending-loan',
        component: ClPendingLoanComponent
    },
    {
        path: 'calculte-dbr',
        component: CalculateDbrComponent
    },
    {
        path: 'search-dbr',
        component: SearchDbrComponent
    },
    {
        path: 'referback-loan-uti',
        component: ReferbackLoanUtilizationComponent
    },
    {
        path: 'referback-loan-CAD',
        component: ReferbackLoanFromCADComponent
    },
    {
        path: 'rejected-loan',
        component: RejectedLoanComponent
    },
    {
        path: 'search-charge-creation',
        component: ChargeCreationLoanComponent
    },
    {
        path: 'upload-documents',
        component: ClUploadDocumentComponent
    },
]

@NgModule({
    declarations: [
        CreateLoanComponent,
        ClApplicationHeaderComponent,
        ClCustomersComponent,
        ClPurposeComponent,
        ClSecuritiesComponent,
        ClLegalHeirsComponent,
        ClAppraisalOfProposedInvestmentComponent,
        ClLoanWitnessComponent,
        ClUploadDocumentComponent,
        ClGlSchemeCropConfigurationComponent,
        ClDocumentViewComponent,
        SaveOrrComponent,
        OrrListComponent,
        ClSearchLoanComponent,
        ClPendingLoanComponent,
        CalculateDbrComponent,
        SearchDbrComponent,
        ReferbackLoanUtilizationComponent,
        ChargeCreationLoanComponent,
        ClViewLoanComponent,
        ReferbackLoanFromCADComponent,
        RejectedLoanComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routing),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
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
        MatChipsModule,
        IconPickerModule,
        MatPaginatorModule,
    ],
})
export class LoanModule {
}
