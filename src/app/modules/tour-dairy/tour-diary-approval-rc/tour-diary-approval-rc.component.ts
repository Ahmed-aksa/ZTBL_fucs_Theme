import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {finalize} from "rxjs/operators";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {DateFormats} from "../../../shared/classes/lov.class";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-tour-diary-approval-rc',
    templateUrl: './tour-diary-approval-rc.component.html',
    styleUrls: ['./tour-diary-approval-rc.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class TourDiaryApprovalRcComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;
    maxDate: Date;
    zone: any;
    branch: any;
    circle: any;
    sign;
    TourPlan;
    Format24: boolean = true;
    isUpdate: boolean = false;
    TourDiary;
    TourDiaryList = [];
    date: string;

    constructor(
        private fb: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private userUtilsService: UserUtilsService,
        private tourDiaryService: TourDiaryService,
        public dialog: MatDialog,
        private router: Router,
        private datePipe: DatePipe,
        private toastr: ToastrService
    ) {
        this.loggedInUser = userUtilsService.getUserDetails();
    }

    ngOnInit(): void {
        if (JSON.parse(localStorage.getItem('TourDiary'))) {
            localStorage.removeItem('TourDiary');
        } else {
            this.toastr.error("No Tour Diary For Approval Found");
            this.router.navigate(['/tour-diary/tour-diary-approval']);
        }
    }

    DateFormat() {
        if (this.Format24 === true) {
            return 24
        } else {
            return 12
        }

    }


    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle;

    }

    approve() {
        const dialogRef = this.layoutUtilsService.AlertElementConfirmation("", "Are You Suer you want to confirm the approval?");


        dialogRef.afterClosed().subscribe(res => {

            if (!res) {
                return;
            }
            this.toastr.success("Approved");
        })
    }

    referback() {
        const dialogRef = this.layoutUtilsService.AlertElementConfirmation("", "Are You Suer you want to confirm the Referback?");


        dialogRef.afterClosed().subscribe(res => {

            if (!res) {
                return;
            }
            this.toastr.success("Referbacked");
        })
    }
}
