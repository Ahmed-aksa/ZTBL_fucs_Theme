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
import { MatDialog } from '@angular/material/dialog';
import { MapReqDialogComponent } from './map-req-dialog/map-req-dialog.component';

@Component({
  selector: 'mapping-request',
  templateUrl: './mapping-request.component.html',
  styleUrls: ['./mapping-request.component.scss'],
  exportAs: 'mapping-request'
})
export class MappingRequestComponent implements OnInit {


  constructor(
   private dialog: MatDialog
  )
  { }

  ngOnInit() {
  }

  mappingRec(){
    this.dialog.open(MapReqDialogComponent, { panelClass: ['full-screen-modal'], disableClose: true})  //disableClose: true })
  }

}
