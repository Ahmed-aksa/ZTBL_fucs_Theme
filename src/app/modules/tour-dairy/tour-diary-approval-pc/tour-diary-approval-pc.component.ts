import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";
import {finalize} from "rxjs/operators";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {CommonService} from "../../../shared/services/common.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
    selector: 'app-tour-diary-approval-pc',
    templateUrl: './tour-diary-approval-pc.component.html',
    styleUrls: ['./tour-diary-approval-pc.component.scss'],
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
export class TourDiaryApprovalPcComponent implements OnInit {
    loggedInUser: any;
    maxDate: Date;
    zone: any;
    branch: any;
    circle: any;
    sign;
    TourPlan;
    Format24: boolean = true;
    date: string;
    TourDiary;
    isUpdate: boolean = false;
    TourDiaryList: any;

    constructor(
        private fb: FormBuilder,
        private userService: UserUtilsService,
        private _common: CommonService,
        private datePipe: DatePipe,
        private tourDiaryService: TourDiaryService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private _cdf: ChangeDetectorRef,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.loggedInUser = userService.getSearchResultsDataOfZonesBranchCircle();
    }

    ngOnInit(): void {
        if (JSON.parse(localStorage.getItem('TourDiary'))) {
            localStorage.removeItem('TourDiary');
        } else {
            this.toastr.error("No Tour Diary For Approval Found");
            this.router.navigate(['/tour-diary/tour-diary-approval']);
        }
    }


    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
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
