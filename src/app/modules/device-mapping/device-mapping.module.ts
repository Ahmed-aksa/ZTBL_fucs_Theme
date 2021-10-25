import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViolationsComponent } from './violations/violations.component';
import { MappingRequestComponent } from './mapping-request/mapping-request.component';
import { MapNotificationStatusComponent } from './map-notification-status/map-notification-status.component';
import { ViolateDialogComponent } from './violations/violate-dialog/violate-dialog.component';
import { MapReqDialogComponent } from './mapping-request/map-req-dialog/map-req-dialog.component';
import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  declarations: [
    ViolationsComponent,
    MappingRequestComponent,
    MapNotificationStatusComponent,
    ViolateDialogComponent,
    MapReqDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  entryComponents:[
    MapNotificationStatusComponent,
    ViolateDialogComponent,
    MapReqDialogComponent
  ],
  exports:[
    ViolationsComponent,
    MappingRequestComponent,
    MapNotificationStatusComponent,
    ViolateDialogComponent,
    MapReqDialogComponent
  ]
})
export class DeviceMappingModule { }
