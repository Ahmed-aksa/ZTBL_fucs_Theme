import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'kt-fa-branch',
    templateUrl: './fa-branch.component.html',
    styles: []
})
export class FaBranchComponent implements OnInit {

    public LnTransactionID: string;
    public Lcno: string;
    public ViewOnly: string;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.LnTransactionID = this.route.snapshot.params['LnTransactionID'];
        this.Lcno = this.route.snapshot.params['Lcno'];
        this.ViewOnly = this.route.snapshot.params['ViewOnly'];
    }

}
