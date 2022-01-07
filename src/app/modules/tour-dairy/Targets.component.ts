import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-Targets',
    templateUrl: './Targets.component.html',
    styleUrls: ['./Targets.component.scss'],
})
export class TargetsComponent implements OnInit {

    userGroup: any = [];

    constructor() {

    }


    ngOnInit(): void {
        debugger
        this.userGroup = JSON.parse(localStorage.getItem("ZTBLUser"))?.User?.userGroup

    }


}
