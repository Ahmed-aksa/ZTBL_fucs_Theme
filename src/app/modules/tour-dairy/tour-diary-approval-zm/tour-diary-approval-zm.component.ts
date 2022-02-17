import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import {DateFormats} from '../../../shared/classes/lov.class';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LayoutUtilsService} from '../../../shared/services/layout_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserUtilsService} from '../../../shared/services/users_utils.service';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {finalize} from "rxjs/operators";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {TourDiary} from "../set-target/Models/tour-diary.model";
import {ToastrService} from "ngx-toastr";
import {SignaturePadForDiaryApproval} from "../signature-pad-for-tour/app-signature-pad-for-diary-approval";

@Component({
    selector: 'app-tour-diary-approval-zm',
    templateUrl: './tour-diary-approval-zm.component.html',
    styleUrls: ['./tour-diary-approval-zm.component.scss'],
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
export class TourDiaryApprovalZmComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;
    maxDate: Date;
    sign;
    SelectedBranches = [];
    preSelect: any;
    zone: any;
    branch: any;
    circle: any;
    TourPlan: any;
    TourDiary = new TourDiary();
    TourDiaryList = [];
    Format24:boolean=true;
    isUpdate:boolean=false;
    date: any;
    btnText = 'Save';
    data;
    systemGenerated: any;

    constructor(
        private fb: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private userUtilsService: UserUtilsService,
        private tourDiaryService: TourDiaryService,
        public dialog: MatDialog,
        private router: Router,
        private toastr: ToastrService,
        private userService: UserUtilsService,
    ) {
        this.loggedInUser = userUtilsService.getUserDetails();
        console.log(this.loggedInUser)
    }

    ngOnInit(): void {
        this.data = JSON.parse(localStorage.getItem('TourDiary'))
        if (this.data) {
            localStorage.removeItem('TourDiary');
        } else {
            this.toastr.error("No Tour Diary For Approval Found");
            this.router.navigate(['/tour-diary/tour-diary-approval']);
        }
        this.loggedInUser = this.userService.getUserDetails();
        this.getTourDiaryDetail();
    }


    getTourDiaryDetail() {
        this.TourDiary = Object.assign(this.data);
        this.spinner.show();
        console.log(JSON.stringify(this.TourDiary))
        this.tourDiaryService.getTourDiaryDetail(this.zone, this.branch, this.circle, this.TourDiary)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            debugger
            if (baseResponse.Success) {
                this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                this.systemGenerated=baseResponse.TourDiary.SystemGeneratedData;
            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });
    }


    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
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
}
