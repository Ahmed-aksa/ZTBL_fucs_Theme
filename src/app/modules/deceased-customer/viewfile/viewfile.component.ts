import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { ViewFileComponent } from 'app/shared/component/view-file/view-file.component';

@Component({
  selector: 'app-viewfile',
  templateUrl: './viewfile.component.html',
  styleUrls: ['./viewfile.component.scss']
})
export class ViewfileComponent implements OnInit {
    viewFileArray = [];
    url: any;

    constructor(public dialogRef: MatDialogRef<ViewFileComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        debugger
        this.url = data.url
        this.viewFileArray = data.documentView

    }

  ngOnInit(): void {
  }

}
