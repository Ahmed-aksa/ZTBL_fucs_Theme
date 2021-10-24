/* eslint-disable arrow-parens */
/* eslint-disable no-debugger */
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
  selector: 'app-violate-dialog',
  templateUrl: './violate-dialog.component.html',
  styleUrls: ['./violate-dialog.component.scss']
})
export class ViolateDialogComponent implements OnInit {
  mappingVoilation = [];
  matTableLenght = false;
  itemsPerPage = 10;
  Offset = 0;

  dv;
  totalItems;
  pageIndex = 1;

  loading = false;

  constructor(
    private mappingViolate: MappingViolationService,
    private spinner: NgxSpinnerService,
    private layoutUtilsService: LayoutUtilsService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ViolateDialogComponent>,
  ) { }

  ngOnInit() {
    this.Search()
  }

  Search(){
    this.loading = true;
    this.spinner.show();
    this.mappingViolate.getMappingVoilation(this.itemsPerPage, this.Offset)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      debugger
      if(baseResponse.Success === true){
        console.log(baseResponse)
        this.loading = false;
        this.mappingVoilation = baseResponse.Notifications;
        this.dv = this.mappingVoilation;
        this.matTableLenght = true
        //this.totalItems = baseResponse.SeedKhadVendor.VendorDetails[0].TotalRecords

      }
      else {
        this.mappingVoilation = [];
        this.layoutUtilsService.alertElement("", baseResponse.Message);
        this.matTableLenght = false;
        this.loading = false;
        this.Offset = 0
      }
    })
  }

  viewStatus(voilation){
    console.log(voilation)
    const type = 'violation'
    const dialogRef = this.dialog.open(MapNotificationStatusComponent, { width: '1200px', height: '250px', data: {mapp: voilation, type: type},  disableClose: true });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else{
        this.spinner.show();
        this.mappingViolate.createMapping(voilation)
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
    this.mappingVoilation = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
  }

  close(result: any): void {
    this.dialogRef.close(result);
  }

}