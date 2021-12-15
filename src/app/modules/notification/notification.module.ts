import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecoveryCollectionNotificationsComponent } from './recovery-collection-notifications/recovery-collection-notifications.component';
import { DuePaymentsComponent } from './due-payments/due-payments.component';
import { PossibleCustomerLeadsComponent } from './possible-customer-leads/possible-customer-leads.component';
import { IntimateLoanerTextComponent } from './intimate-loaner-text/intimate-loaner-text.component';
import { LoanersComponent } from './loaners/loaners.component';
import { DeathOfCustomerComponent } from './death-of-customer/death-of-customer.component';
import { CnicExpiryLoanerComponent } from './cnic-expiry-loaner/cnic-expiry-loaner.component';
import { DemandNoticesComponent } from './demand-notices/demand-notices.component';
import { BusinessLeadsComponent } from './business-leads/business-leads.component';
import { UpcomingVisitsComponent } from './upcoming-visits/upcoming-visits.component';
import { LoanDefaultersComponent } from './loan-defaulters/loan-defaulters.component';
import { NotificationComponent } from './notification/notification.component';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import { NotificationPageComponent } from './notification-page/notification-page.component';
import { GetFenceViolationComponent } from './get-fence-violation/get-fence-violation.component';

const routing = [
    {
        path: 'notification-details',
        component: NotificationPageComponent
    },
    {
        path: 'cnic-expiry-loaner',
        component: CnicExpiryLoanerComponent
    },
    {
        path: 'due-payments',
        component: DuePaymentsComponent
    },
    {
        path: 'loan-defaulters',
        component: LoanDefaultersComponent
    },
    {
        path: 'possible-customer-leads',
        component: PossibleCustomerLeadsComponent
    },
    {
        path: 'intimate-loaners-text',
        component: IntimateLoanerTextComponent
    },
    {
        path: 'get-fence-violation',
        component: GetFenceViolationComponent
    },
]

@NgModule({
  declarations: [
    RecoveryCollectionNotificationsComponent,
    DuePaymentsComponent,
    PossibleCustomerLeadsComponent,
    IntimateLoanerTextComponent,
    LoanersComponent,
    DeathOfCustomerComponent,
    CnicExpiryLoanerComponent,
    DemandNoticesComponent,
    BusinessLeadsComponent,
    UpcomingVisitsComponent,
    LoanDefaultersComponent,
    NotificationComponent,
    NotificationPageComponent,
    GetFenceViolationComponent
  ],
  imports: [
      CommonModule,
      RouterModule.forChild(routing),
      SharedModule
  ],
    exports: [
        RecoveryCollectionNotificationsComponent,
        DuePaymentsComponent,
        PossibleCustomerLeadsComponent,
        IntimateLoanerTextComponent,
        LoanersComponent,
        DeathOfCustomerComponent,
        CnicExpiryLoanerComponent,
        DemandNoticesComponent,
        BusinessLeadsComponent,
        UpcomingVisitsComponent,
        LoanDefaultersComponent,
        NotificationComponent,
        GetFenceViolationComponent
    ]
})
export class NotificationModule { }
