/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no- */
/* eslint-disable prefer-const */
/* eslint-disable eol-last */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { MappingViolationService } from '../service/mapping-violation.service';

@Component({
  selector: 'app-map-notification-status',
  templateUrl: './map-notification-status.component.html',
  styleUrls: ['./map-notification-status.component.scss']
})
export class MapNotificationStatusComponent implements OnInit {

  constructor(
    private mappingViolate: MappingViolationService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<MapNotificationStatusComponent>,
    private layoutUtilsService: LayoutUtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  status: any;
  create = false;
  violat = false;
  
  close(result: any): void {
    this.dialogRef.close(result);
  }

  ngOnInit() {
    
    if(this.data.type == 'violation'){
      this.violat = true
    }

    this.getStatus(); 
  }

  getStatus(){
    this.spinner.show();
    this.mappingViolate.getNotificationStatus(this.data.mapp)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      
      if(baseResponse.Success === true){
        this.status = baseResponse.Message
        if(this.status != 'TRUE'){
          this.create = true;
        }     
      }
    })
  }


  onCreate(){
    var res = {message : this.status};
    this.data = res;
    this.close(this.data)
  }

  block(){
    
    this.spinner.show();
        this.mappingViolate.blockUser(this.data.mapp)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
          )
          .subscribe((baseResponse: BaseResponseModel) =>{
            
            
            if(baseResponse.Success === true){
              this.layoutUtilsService.alertElementSuccess('', baseResponse.Message)
            }
          })
  }

}