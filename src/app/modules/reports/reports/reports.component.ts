/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {UserUtilsService} from '../../../shared/services/users_utils.service';
import {EncryptDecryptService} from "../../../shared/services/encrypt_decrypt.service";

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
    rowLength: number;

    constructor(
        private dialog: MatDialog,
        private user: UserUtilsService,
        private router: Router,
        private enc: EncryptDecryptService
    ) {
        this.reportLength()
    }

    ngOnInit(): void {
    }

    reportLength() {

        var reportMenu = this.enc.decryptStorageData(localStorage.getItem("ZTBLUser"));
        var report = JSON.parse(reportMenu)
        report.MenuBar.forEach(x => {
            if (x.parentId == '165') {
                this.rowLength = x.children.length;
            }
        });
    }

    IsReportCardVisable(url) {
        var ismatch = false
        var user =this.enc.decryptStorageData( localStorage.getItem("ZTBLUser"))
        if (user) {
            var userdate = JSON.parse(user);
            userdate.MenuBar.forEach(x => {
                var childURl = x?.children?.find(y => y.link?.includes(url))
                if (childURl) {
                    ismatch = true;
                } else {

                }

            });
            return ismatch;
        }
    }
}
