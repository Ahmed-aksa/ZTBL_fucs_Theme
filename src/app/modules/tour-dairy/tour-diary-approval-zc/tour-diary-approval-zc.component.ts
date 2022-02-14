import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {finalize} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {DateFormats} from "../../../shared/classes/lov.class";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import { TourDiary } from '../set-target/Models/tour-diary.model';

@Component({
    selector: 'app-tour-diary-approval-zc',
    templateUrl: './tour-diary-approval-zc.component.html',
    styleUrls: ['./tour-diary-approval-zc.component.scss'],
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
export class TourDiaryApprovalZcComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;
    maxDate: Date;
    TourPlan;
    TourDiary = new TourDiary();
    sign;
    zone: any;
    branch: any;
    circle: any;
    Format24:boolean=true;
    date: any;
    btnText = 'Save';
    TourDiaryList;
    isUpdate:boolean=false;

    constructor(
        private fb: FormBuilder,
        private userService: UserUtilsService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private tourDiaryService: TourDiaryService,
        private userUtilsService: UserUtilsService,
        public dialog: MatDialog,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.loggedInUser = userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    }

    ngOnInit(): void {
        if (JSON.parse(localStorage.getItem('TourDiary'))) {
            localStorage.removeItem('TourDiary');
        } else {
            this.toastr.error("No Tour Diary For Approval Found");
            this.router.navigate(['/tour-diary/tour-diary-approval']);
        }
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


    getAllData(data) {
        if(data.final_zone[0]){
            this.zone = data.final_zone[0];
        }else{
            this.zone = data.final_zone;
        }
        this.branch = data.final_branch;
        this.circle = data.final_circle;

    }
}

