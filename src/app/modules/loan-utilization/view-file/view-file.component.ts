import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {style} from "@angular/animations";
import {fromEvent} from "rxjs";

@Component({
    selector: 'kt-view-file',
    templateUrl: './view-file.component.html',
    styleUrls: ['./view-file.component.scss']
})
export class ViewFileComponent implements OnInit {
    viewFileArray = [];
    url: any;
    scale;
    top;
    left;

    constructor(public dialogRef: MatDialogRef<ViewFileComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.url = data.url
        this.viewFileArray = data.documentView

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        fromEvent(window, "wheel").subscribe((ev: WheelEvent) => {
            const newScale = this.scale - ev.deltaY * 0.2;
            this.scale = Math.max(newScale, 100);
            this.top = ev.clientY - this.scale / 2;
            this.left = ev.clientX - this.scale / 2;
        });
    }

    rotate() {


        document.getElementById('image').style.transform += 'rotate(90deg)';
    }
}
