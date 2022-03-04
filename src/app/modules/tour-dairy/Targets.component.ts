import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-Targets',
    templateUrl: './Targets.component.html',
    styleUrls: ['./Targets.component.scss'],
})
export class TargetsComponent implements OnInit {

    userGroup: any = [];
    isHiddenTab: boolean = true

    constructor() {
    }

    ngOnInit(): void {
        this.userGroup = JSON.parse(localStorage.getItem("ZTBLUser"))?.User?.userGroup;
    }

    applyClass() {
        if (this.userGroup?.length == 1) {
            return "dash-tab";
        }
    }
}
