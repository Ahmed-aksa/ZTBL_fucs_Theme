import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import {IconPickerModule} from 'ngx-icon-picker';
import { AgmCoreModule } from '@agm/core';
import { AssignPageListComponent } from './assign-pages/assign-pages-list/assign-pages-list.component';
import { RoleListComponent } from './Role/role-list/role-list.component';
import { ActivityFormDialogComponent } from './activity/activity-edit/activity-form.dialog.component';
import { CreateEditRoleComponent } from './Role/create-edit-role/create-edit-role.component';
import { StoreModule } from '@ngrx/store';
import { usersReducer } from 'app/shared/reducers/user.reducers';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from 'app/shared/effects/user.effects';
import { ProfileService } from './activity/profile.service';
import { HttpUtilsService } from 'app/shared/services/http_utils.service';
import { InterceptService } from 'app/shared/services/intercept.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TypesUtilsService } from 'app/shared/services/types-utils.service';
import { LayoutUtilsService } from 'app/shared/services/layout-utils.service';


const route = [
  {
      path: '',
     // component: DashboardComponent
  },
  {
    path: 'roles',
    component: RoleListComponent
  },
];

@NgModule({
  declarations: [
    AssignPageListComponent,
    RoleListComponent,
    ActivityFormDialogComponent,
    CreateEditRoleComponent,
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
  providers: [
   
  ]
})
export class UserManagementModule { }
