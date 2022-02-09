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
    url = [];
    scale;
    top;
    left;
    is_zoomed = false;

    config = {
        btnContainerClass: '',            // The CSS class(es) to be applied to the button container
         btnClass: 'default',              // The CSS class(es) that will be applied to the buttons e.g. default is needed for FontAwesome icons, while not needed for Material Icons
        btnSubClass: 'material-icons',    // The CSS class(es) that will be applied to span elements inside material buttons (a Elements)
        zoomFactor: 0.1,                  // The amount that the scale will be increased by
        containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
        wheelZoom: true,                  // If true, the mouse wheel can be used to zoom in
        allowFullscreen: true,            // If true, the fullscreen button will be shown, allowing the user to enter fullscreen mode
        allowKeyboardNavigation: true,    // If true, the left / right arrow keys can be used for navigation
        btnShow: {                        // Control which icons should be visible
            zoomIn: true,
            zoomOut: true,
            rotateClockwise: true,
            rotateCounterClockwise: true,
            next: false,
            prev: false,
            reset: true
        },
        btnIcons: {                       // The icon classes that will apply to the buttons. By default, font-awesome is used.
            zoomIn: {
                classes: 'close-icon',        // this property will be used for FontAwesome and other libraries to set the icons via the classes - choose one: classes or text
                text: 'zoom_in'               // this property will be used for Material-Icons and similar libraries to set the icons via the text
            },
            zoomOut: {
                classes: 'fa fa-minus',
                text: 'zoom_out'
            },
            rotateClockwise: {
                classes: 'fa fa-repeat',
                text: 'rotate_right'
            },
            rotateCounterClockwise: {
                classes: 'fa fa-undo',
                text: 'rotate_left'
            },
            next: {
                classes: 'fa fa-arrow-right',
                text: 'arrow_right'
            },
            prev: {
                classes: 'fa fa-arrow-left',
                text: 'arrow_left'
            },
            fullscreen: {
                classes: 'fa fa-arrows-alt',
                text: 'fullscreen'
            },
            reset: {
                classes: 'fa fa-undo',
                text: 'restore'
            }
        }
    };


    constructor(public dialogRef: MatDialogRef<ViewFileComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        // this.url = data.url
        // this.url = 'http://localhost:4200/assets/media/logos/profilepicturelogo.png';

        if(this.data?.url ){
            
            this.url.push(this.data?.url);
        }else{
            this.url.push('http://localhost:4200/assets/media/logos/profilepicturelogo.png')
        }
        this.viewFileArray = data.documentView

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        fromEvent(window, "wheel").subscribe((ev: WheelEvent) => {
            this.is_zoomed = true;
            const newScale = this.scale - ev.deltaY * 0.2;
            this.scale = Math.max(newScale, 100);
            this.top = ev.clientY - this.scale / 2;
            this.left = ev.clientX - this.scale / 2;
        });
    }

    rotate() {
        if (this.is_zoomed) {
            document.getElementById('image').style.transform = 'rotate(90deg)';
            this.scale = 1;
            this.left = 1;
            this.top = 1;
            this.is_zoomed = false;
        } else {
            document.getElementById('image').style.transform += 'rotate(90deg)';

        }
    }
}
