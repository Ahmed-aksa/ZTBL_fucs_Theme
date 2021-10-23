import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { SearchLoanUtilizationComponent} from './search-loan-uti/search-loan-uti.component';
import { SearchUtilizationComponent } from './search-utilization/search-utilization.component';
import { LoanUtilizationComponent } from './loan-utilization/loan-utilization.component';

const routing = [

    {
      path: 'loan-uti',
      component: LoanUtilizationComponent
    },
     {
      path: 'search-uti',
      component: SearchUtilizationComponent
    },
    {
      path: 'search-loan-uti',
      component: SearchLoanUtilizationComponent
    },

]

@NgModule({
  declarations: [SearchLoanUtilizationComponent,SearchUtilizationComponent,LoanUtilizationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routing),
  ]
})
export class LoanUtilizationModule { }
