import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {finalize} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {SignaturePadForTourComponent} from "../../tour-plan/signature-pad-for-tour/signature-pad-for-tour.component";
import {SignaturePadForDiaryApproval} from "../signature-pad-for-tour/app-signature-pad-for-diary-approval";
import {Activity} from "../../../shared/models/activity.model";

@Component({
    selector: 'app-tour-diary-approval-ro',
    templateUrl: './tour-diary-approval-ro.component.html',
    styleUrls: ['./tour-diary-approval-ro.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})

export class TourDiaryApprovalRoComponent implements OnInit {
    loggedInUser: any;
    gridForm: FormGroup;
    maxDate: Date;
    zone: any;
    branch: any;
    circle: any;
    sign;
    TourPlan;
    Format24: boolean = true;
    isUpdate: boolean = false;
    TourDiaryList = [];
    date: string;
    data: Object;
    systemGenerated: any;
    TourDiary;
    currentActivity: Activity;

    constructor(
        private fb: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private tourDiaryService: TourDiaryService,
        private userUtilsService: UserUtilsService,
        public dialog: MatDialog,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.loggedInUser = userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    }

    ngOnInit(): void {
        this.currentActivity = this.userUtilsService.getActivity('Tour Diary Approval For RO')
        this.data = JSON.parse(localStorage.getItem('TourDiary'))
        if (this.data) {
            localStorage.removeItem('TourDiary');
        } else {
            this.toastr.error("No Tour Diary For Approval Found");
            this.router.navigate(['/tour-diary/tour-diary-approval']);
        }
        this.createForm();
    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle;

        if (this.zone) {
            this.getTourDiaryDetail();
        }

    }

    createForm() {
        this.gridForm = this.fb.group({
            Name: ["", [Validators.required]],
            Ppno: ["", [Validators.required]],
            DiaryId: [null],
            TourPlanId: [null, [Validators.required]],
            TourDate: [null, [Validators.required]],
            DepartureFromPlace: [null, [Validators.required]],
            DepartureFromTime: [null, [Validators.required]],
            ArrivalAtPlace: [null, [Validators.required]],
            ArrivalAtTime: [null, [Validators.required]],
            NoOfDefaulterContacted: [null],
            ResultContactMade: [null],
            MeasureBoostUpRecord: [null],
            Remarks: [null],
            Status: [null],
        });
    }

    changeStatus(status) {
        const signatureDialogRef = this.dialog.open(
            SignaturePadForDiaryApproval,
            {
                disableClose: true,
                data: {data: this.TourDiaryList, status: status}
            },
        );
        signatureDialogRef.afterClosed().subscribe((res)=>{
            if(res == true){
                this.router.navigate(['/tour-diary/tour-diary-approval']);
            }
            else{
                return
            }
        })
    }


    getTourDiaryDetail() {
        this.TourDiary = Object.assign(this.data);
        this.spinner.show();
        this.tourDiaryService.getTourDiaryDetail(this.zone, this.branch, this.circle, this.TourDiary,'BM')
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {

                this.TourDiaryList = baseResponse.TourDiary.TourDiaries;
                this.systemGenerated=baseResponse.TourDiary.SystemGeneratedData;
            } else {

                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });
    }

}
