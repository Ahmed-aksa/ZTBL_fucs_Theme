/* eslint-disable arrow-parens */
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
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { MapNotificationStatusComponent } from '../../map-notification-status/map-notification-status.component';
import { MappingViolationService } from '../../service/mapping-violation.service';

@Component({
  selector: 'app-map-req-dialog',
  templateUrl: './map-req-dialog.component.html',
  styleUrls: ['./map-req-dialog.component.scss']
})
export class MapReqDialogComponent implements OnInit {

  mappingRequest = [];
  itemsPerPage = 10;
  Offset = 0;

  dv;
  totalItems;
  pageIndex = 1;

  loading = false;
  matTableLenght = false;

  constructor(
    private mappingViolate: MappingViolationService,
    private spinner: NgxSpinnerService,
    private layoutUtilsService: LayoutUtilsService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<MapReqDialogComponent>,
  ) { }

  ngOnInit() {
    this.Search()
  }

  Search(){

    this.spinner.show();
    this.mappingViolate.getMappingRequest(this.itemsPerPage, this.Offset)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      if(baseResponse.Success === true){
        this.loading = false;
        this.mappingRequest = baseResponse.Notifications
        this.dv = this.mappingRequest;
        this.matTableLenght = true
        //this.totalItems = baseResponse.SeedKhadVendor.VendorDetails[0].TotalRecords     
      }
      else {
        this.mappingRequest = []
        this.layoutUtilsService.alertElement("", baseResponse.Message);
        this.matTableLenght = false;
        this.loading = false;
        this.Offset = 0
      }
    })
  }

  close(result: any): void {
    this.dialogRef.close(result);
  }

  viewStatus(mapping){
    const type = 'request';
    const dialogRef = this.dialog.open(MapNotificationStatusComponent, { panelClass: ['w-8/12'], data: {mapp: mapping, type: type}, disableClose: true });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else{
        this.spinner.show();
        this.mappingViolate.createMapping(mapping)
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
    });
  }

  paginate(pageIndex : any, pageSize: any = this.itemsPerPage){
    
    this.itemsPerPage = pageSize;
      this.Offset = (pageIndex -1) * this.itemsPerPage;
    this.pageIndex = pageIndex;
    this.Search();
    this.mappingRequest = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
  }

}
