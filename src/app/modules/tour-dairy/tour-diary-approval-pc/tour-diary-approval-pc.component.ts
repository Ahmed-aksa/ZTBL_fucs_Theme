import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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
import {SignaturePadForDiaryApproval} from "../signature-pad-for-tour/app-signature-pad-for-diary-approval";
import {MatDialog} from "@angular/material/dialog";
import {Activity} from "../../../shared/models/activity.model";

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
    gridForm: FormGroup;
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
    systemGenerated: any;
    data: any;
    currentActivity: Activity;

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
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {
        this.loggedInUser = userService.getSearchResultsDataOfZonesBranchCircle();
    }

    ngOnInit(): void {
        this.currentActivity = this.userService.getActivity('Tour Diary Approval For PC')
        this.data = JSON.parse(localStorage.getItem('TourDiary'));
        if (JSON.parse(localStorage.getItem('TourDiary'))) {
            localStorage.removeItem('TourDiary');
        } else {
            this.toastr.error("No Tour Diary For Approval Found");
            this.router.navigate(['/tour-diary/tour-diary-approval']);
        }
        this.createForm()
    }

    createForm() {

        this.gridForm = this.fb.group({
            NameOfOfficer: [null, [Validators.required]],
            Ppno: [null, [Validators.required]],
            Month: [null],
            Name: [null],
            Date: [null],
            Designation: [null],
            TourDate: [null, [Validators.required]],
            DiaryId: [null],
            TourPlanId: [null, [Validators.required]],
            DepartureFromPlace: [null, [Validators.required]],
            DepartureFromTime: [null, [Validators.required]],
            ArrivalAtPlace: [null, [Validators.required]],
            ArrivalAtTime: [null, [Validators.required]],
            NoOfDefaulterContacted: [null],
            ResultContactMade: [null],
            MeasureBoostUpRecord: [null],
            Remarks: [null],
        });
    }


    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;

        if (this.zone) {
            this.getTourDiaryDetail();
        }
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
        this.TourDiary = Object.assign(this.data);
        this.spinner.show();
        this.tourDiaryService.getTourDiaryDetail(this.zone, this.branch, this.circle, this.TourDiary)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.TourDiaryList = baseResponse.TourDiary.TourDiaries;
                this.systemGenerated = baseResponse.TourDiary.SystemGeneratedData;
            } else {

                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });
    }

}
