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
import {SignaturePadForDiaryApproval} from "../signature-pad-for-tour/app-signature-pad-for-diary-approval";

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
    systemGenerated: any;
    data: any;

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
        this.data = JSON.parse(localStorage.getItem('TourDiary'));
        if (JSON.parse(localStorage.getItem('TourDiary'))) {
            localStorage.removeItem('TourDiary');
        } else {
            this.toastr.error("No Tour Diary For Approval Found");
            this.router.navigate(['/tour-diary/tour-diary-approval']);
        }
        this.getTourDiaryDetail();
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

    changeStatus(status) {
        const signatureDialogRef = this.dialog.open(
            SignaturePadForDiaryApproval,
            {
                disableClose: true,
                data: {data: this.TourDiaryList, status: status}
            },
        );
        signatureDialogRef.afterClosed().subscribe((res) => {
            if (res == true) {
                this.router.navigate(['/tour-diary/tour-diary-approval']);
            } else {
                return
            }
        })
    }

    getTourDiaryDetail() {
        this.spinner.show();
        this.tourDiaryService.getTourDiaryDetail(this.zone, this.branch, Object.assign(this.data))
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {
                debugger;
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.TourDiaryList = baseResponse.TourDiary.TourDiaries;
                this.systemGenerated = baseResponse.TourDiary.SystemGeneratedData;
            } else {

                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });
    }
}
