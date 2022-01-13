import { Component, OnInit } from '@angular/core';
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";
import {FormBuilder, FormGroup} from "@angular/forms";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {SignatureDailogDairyComponent} from "../signature-dailog-dairy/signature-dailog-dairy.component";

@Component({
    selector: 'app-tour-diary-ro',
    templateUrl: './tour-diary-ro.component.html',
    styleUrls: ['./tour-diary-ro.component.scss'],
    providers: [
        DatePipe,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        {provide: MAT_DATE_FORMATS, useValue: DateFormats},
    ],
})

export class TourDiaryRoComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;
    maxDate: Date;
    zone: any;
    branch: any;
    circle: any;
    sign;

    constructor(
        private fb: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private userUtilsService: UserUtilsService,
        public dialog: MatDialog,
        private router: Router
    ) {
        this.loggedInUser = userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    }

    ngOnInit(): void {
        this.createForm();
    }

    isEnableReceipt(isTrCodeChange: boolean) {
        var Date = this.gridForm.controls.Date.value;
        if (Date._isAMomentObject == undefined) {
            try {
                var day = this.gridForm.controls.Date.value.getDate();
                var month = this.gridForm.controls.Date.value.getMonth() + 1;
                var year = this.gridForm.controls.Date.value.getFullYear();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.gridForm.controls.Date.setValue(branchWorkingDate);
            } catch (e) {
            }
        } else {
            try {
                var day = this.gridForm.controls.Date.value.toDate().getDate();
                var month =
                    this.gridForm.controls.Date.value.toDate().getMonth() + 1;
                var year = this.gridForm.controls.Date.value
                    .toDate()
                    .getFullYear();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                Date = day + '' + month + '' + year;

                const branchWorkingDate = new Date(year, month - 1, day);
                this.gridForm.controls.Date.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }

    createForm() {
        this.gridForm = this.fb.group({
            NameOfOfficer: [''],
            PPNO: [''],
            Month: [''],
            Name: [''],
            Designation: [''],
            Date: [''],
        });
    }

    submit() {
        const signatureDialogRef = this.dialog.open(
            SignatureDailogDairyComponent,
            {width: '500px', disableClose: true}
        );
    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle;

    }
}
