/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MakeRescheduleComponent } from './make-reschedule/make-reschedule.component';
import { PendingRescheduleCasesComponent } from './pending-reschedule-cases/pending-reschedule-cases.component';
import { ReferBackRescheduleCasesComponent } from './refer-back-reschedule-cases/refer-back-reschedule-cases.component';
import { RequestForRlComponent } from './request-for-rl/request-for-rl.component';
import { SearchRcComponent } from './search-rc/search-rc.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { NewGlCodeComponent } from './make-reschedule/new-gl-code/new-gl-code.component';

const route = ([
  {
    path: 'make-reschedule',
    component: MakeRescheduleComponent
  },
  {
    path: 'pending-reschedule',
    component: PendingRescheduleCasesComponent
  },
  {
    path: 'refer-back-reschedule',
    component: ReferBackRescheduleCasesComponent
  },
  {
    path: 'search-reschedule',
    component: SearchRcComponent
  },
  {
    path: 'request-reschedule-loan',
    component: RequestForRlComponent
  }     
])

@NgModule({
  declarations: [
    MakeRescheduleComponent,
    PendingRescheduleCasesComponent,
    ReferBackRescheduleCasesComponent,
    RequestForRlComponent,
    SearchRcComponent,
    NewGlCodeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ],
  entryComponents:[
    NewGlCodeComponent
  ]
})
export class RescheduleCasesModule { }
