import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchNdcListComponent } from './search-ndc-list/search-ndc-list.component';



@NgModule({
  declarations: [
    SearchNdcListComponent
  ],
  imports: [
    CommonModule
  ],
    exports:[
        SearchNdcListComponent
    ]
})
export class NdcRequestsModule { }
