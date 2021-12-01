import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {IconPickerModule} from 'ngx-icon-picker';
import {AgmCoreModule} from '@agm/core';
import {AssignPageListComponent} from './assign-pages/assign-pages-list/assign-pages-list.component';
import {RoleListComponent} from './Role/role-list/role-list.component';
import {ActivityFormDialogComponent} from './activity/activity-edit/activity-form.dialog.component';
import {CreateEditRoleComponent} from './Role/create-edit-role/create-edit-role.component';
import {StoreModule} from '@ngrx/store';
import {usersReducer} from 'app/shared/reducers/user.reducers';
import {EffectsModule} from '@ngrx/effects';
import {UserEffects} from 'app/shared/effects/user.effects';

import {ActivityListComponent} from './activity/activity-list/activity-list.component';
import {ProfileFormDialogComponent} from './Profile/profile-edit/profile-form.dialog.component';
import {RoleEditComponent} from './Profile/role-edit/role-edit.component';
import {CircleListComponent} from './users/circle-list/circle-list.component';
import {GeofencingEditComponent} from './users/geofencing-edit/geofencing-edit.component';
import {CircleViewMapComponent} from './users/circle-view-map/circle-view-map.component';
import {EligibilityLogsComponent} from './eligibility-logs/eligibility-logs.component';
import {EligibilityLogDetailComponent} from './eligibility-log-detail/eligibility-log-detail.component';


const route = [
    {
        path: 'assign-pages',
        component: ProfileFormDialogComponent
    },
    {
        path: 'roles',
        component: RoleListComponent
    },
    {
        path: 'pages',
        component: ActivityListComponent
    },
    {
        path: 'circles',
        component: CircleListComponent
    },
    {
        path: 'geofencingedit/:id',
        component: GeofencingEditComponent
    },
    {
        path: 'viewCirclesfence',
        component: CircleViewMapComponent
    },
    {
        path: 'eligibility-logs',
        component: EligibilityLogsComponent
    },
];

@NgModule({
    declarations: [
        AssignPageListComponent,
        RoleListComponent,
        ActivityFormDialogComponent,
        CreateEditRoleComponent,
        ActivityListComponent,
        ProfileFormDialogComponent,
        RoleEditComponent,
        CircleListComponent,
        GeofencingEditComponent,
        CircleViewMapComponent,
        EligibilityLogsComponent,
        EligibilityLogDetailComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(route),
        StoreModule.forFeature('users', usersReducer),
        EffectsModule.forFeature([UserEffects]),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC3SrcUt_3iPERnX-hk46YYsKJiCTzJ5z0',
            libraries: ['places', 'drawing', 'geometry'],
        }),
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
        MatPaginatorModule

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [EligibilityLogDetailComponent],
    providers: []
})
export class UserManagementModule {
}
