import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MakeRcComponent } from './make-rc/make-rc.component';
import { PendingRescheduleCasesComponent } from './pending-reschedule-cases/pending-reschedule-cases.component';
import { ReferBackRescheduleCasesComponent } from './refer-back-reschedule-cases/refer-back-reschedule-cases.component';
import { RequestForRlComponent } from './request-for-rl/request-for-rl.component';
import { SearchRcComponent } from './search-rc/search-rc.component';



@NgModule({
  declarations: [
    MakeRcComponent,
    PendingRescheduleCasesComponent,
    ReferBackRescheduleCasesComponent,
    RequestForRlComponent,
    SearchRcComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RescheduleCasesModule { }
