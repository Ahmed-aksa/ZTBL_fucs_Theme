import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {finalize} from "rxjs/operators";
import {DateFormats} from "../../../shared/classes/lov.class";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {CommonService} from "../../../shared/services/common.service";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {SignaturePadForDiaryApproval} from "../signature-pad-for-tour/app-signature-pad-for-diary-approval";

@Component({
    selector: 'app-tour-diary-approval-bm',
    templateUrl: './tour-diary-approval-bm.component.html',
    styleUrls: ['./tour-diary-approval-bm.component.scss'],
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
export class TourDiaryApprovalBmComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;
    maxDate: Date;
    zone: any;
    branch: any;
    circle: any;
    sign;
    TourPlan;
    Format24: boolean = true;
    Today = this._common.workingDate();
    date: string;
    TourDiary;
    isUpdate: boolean = false;
    TourDiaryList: any;
    systemGenerated;
    data;

    constructor(
        private fb: FormBuilder,
        private userService: UserUtilsService,
        private _common: CommonService,
        private datePipe: DatePipe,
        private tourDiaryService: TourDiaryService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private _cdf: ChangeDetectorRef,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private router: Router,
    ) {
        this.loggedInUser = userService.getSearchResultsDataOfZonesBranchCircle();
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


    @ViewChild("timepicker") timepicker: any;

    openFromIcon(timepicker: { open: () => void }) {
        timepicker.open();
    }

    DateFormat() {
        if (this.Format24 === true) {
            return 24
        } else {
            return 12
        }
    }


    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    getTourDiaryDetail() {
        // if(!this.data){
        //
        // }
        this.TourDiary = Object.assign(this.data);
        debugger;
        if (!this.zone) {
            this.zone = {
                ZoneId: this.data.ZoneId
            };
            this.branch = {
                BranchId: this.data.BranchId,
                BranchCode:this.data?.BranchCode
            }
        }
        this.spinner.show();
        this.tourDiaryService.getTourDiaryDetail(this.zone, this.branch, this.circle, this.TourDiary, 'ZC')
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {

            if (baseResponse.Success) {

                this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                this.systemGenerated = baseResponse.TourDiary.SystemGeneratedData;
            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
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
        signatureDialogRef.afterClosed().subscribe((res) => {
            if (res == true) {
                this.router.navigate(['/tour-diary/tour-diary-approval']);
            } else {
                return
            }
        })

    }


}
