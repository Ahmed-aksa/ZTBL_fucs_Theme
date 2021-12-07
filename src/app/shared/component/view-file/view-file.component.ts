import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'kt-view-file',
    templateUrl: './view-file.component.html',
    styleUrls: ['./view-file.component.scss'],
})
export class ViewFileComponent implements OnInit {
    viewFileArray = [];
    url: any;

    constructor(
        public dialogRef: MatDialogRef<ViewFileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.url = data.url;
        this.viewFileArray = data.documentView;
    }

    ngOnInit() {
    }
}
