import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-view-document',
    templateUrl: './view-document.component.html',
    styleUrls: ['./view-document.component.scss']
})
export class ViewDocumentComponent implements OnInit {
    type: string = '';
    id: number = 0;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((param) => {
            if (param) {
                this.type = param.type;
                this.id = param.v_id;
            }
        })
    }

}
