import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-view-file',
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

    ngOnInit(): void {}
}
