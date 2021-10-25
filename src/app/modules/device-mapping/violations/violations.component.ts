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
import { ViolateDialogComponent } from './violate-dialog/violate-dialog.component';

@Component({
  selector: 'violations',
  templateUrl: './violations.component.html',
  styleUrls: ['./violations.component.scss'],
  exportAs: 'violations'
})
export class ViolationsComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  violation(){
    this.dialog.open(ViolateDialogComponent, { panelClass: ['full-screen-modal'], disableClose: true})  //disableClose: true })
  }

}