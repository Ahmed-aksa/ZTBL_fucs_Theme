import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-image-popup',
    templateUrl: './image-popup.component.html',
    styleUrls: ['./image-popup.component.scss']
})
export class ImagePopupComponent implements OnInit {
    images: any;

    constructor(
        public dialogRef: MatDialogRef<ImagePopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }

    ngOnInit(): void {
        this.images = this.data.images;
    }

}
