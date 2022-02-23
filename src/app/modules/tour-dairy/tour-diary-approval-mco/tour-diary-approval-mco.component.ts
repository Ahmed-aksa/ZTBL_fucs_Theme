import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {CommonService} from "../../../shared/services/common.service";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";
import {finalize} from "rxjs/operators";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TourDiary} from "../set-target/Models/tour-diary.model";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {SignaturePadForDiaryApproval} from "../signature-pad-for-tour/app-signature-pad-for-diary-approval";
import {MatDialog} from "@angular/material/dialog";
import {Activity} from "../../../shared/models/activity.model";

@Component({
    selector: 'app-tour-diary-approval-mco',
    templateUrl: './tour-diary-approval-mco.component.html',
    styleUrls: ['./tour-diary-approval-mco.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class TourDiaryApprovalMcoComponent implements OnInit {
    loggedInUser: any;
    Today = this._common.workingDate();
    // minDate: Date;
    date: string;
    branch: any;
    zone: any;
    circle: any;
    TourDiary;
    TourDiaryList = [];
    TourPlan;
    Format24: boolean = true;
    isUpdate: boolean = false;
    data;
    systemGenerated: any;
    TotalNoOfCasesReceived=0;
    TotalDisbNoOfCasesAppraised=0;
    TotalDisbNoOfRecordVerified=0;
    TotalDisbNoOfSanctionedAuthorized=0;
    TotalDisbSanctionLetterDelivered=0;
    TotalDisbSupplyOrderDelivered=0;
    TotalRecNoOfDefaulterContacted=0;
    TotalRecNoOfLegalNoticeDelivered=0;
    TotalRecNoOfNoticeDelivered=0;
    TotalNoOfUtilizationChecked=0;
    TotalNoOfSanctnMutationVerified=0;
    TotalTOTNoOfFarmersVisisted=0;
    TotalTOTFarmersContacted=0;
    currentActivity: Activity;



    //**************** Time ****************************
    @ViewChild("timepicker") timepicker: any;

    /**
     * Lets the user click on the icon in the input.
     */
    openFromIcon(timepicker: { open: () => void }) {
        // if (!this.formControlItem.disabled) {
        timepicker.open();
        // }
    }

    //Date Format
    DateFormat() {
        if (this.Format24 === true) {
            return 24
        } else {
            return 12
        }
    }

    dateChange(date: string) {
        if(date){
            var day = date.slice(0, 2),
                month = date.slice(2, 4),
                year = date.slice(4, 8);
            return day + "-" + month + "-" + year;
        }

    }

    /**
     * Function to clear FormControl's value, called from the HTML template using the clear button
     *
     * @param $event - The Event's data object
     */
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

    }

    ngOnInit(): void {
        this.currentActivity = this.userService.getActivity('Tour Diary Approval For MCO')
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
        this.TourDiary = Object?.assign(this.data);
        this.spinner.show();
        console.log(JSON.stringify(this.TourDiary))
        this.tourDiaryService.getTourDiaryDetail(this.zone, this.branch, this.circle, this.TourDiary,'BM')
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {

            if (baseResponse.Success) {
                this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                this.systemGenerated=baseResponse.TourDiary.SystemGeneratedData;

                this.TourDiaryList.forEach(element=>{
                    this.TotalNoOfCasesReceived = this.TotalNoOfCasesReceived+Number(element?.DisbNoOfCasesReceived)
                });

                this.TourDiaryList.forEach(element=>{
                    this.TotalDisbNoOfCasesAppraised = this.TotalDisbNoOfCasesAppraised+Number(element?.DisbNoOfCasesAppraised)
                });
                this.TourDiaryList.forEach(element=>{
                    this.TotalDisbNoOfRecordVerified = this.TotalDisbNoOfRecordVerified+Number(element?.DisbNoOfRecordVerified)
                });
                this.TourDiaryList.forEach(element=>{
                    this.TotalDisbNoOfSanctionedAuthorized = this.TotalDisbNoOfSanctionedAuthorized+Number(element?.DisbNoOfSanctionedAuthorized)
                });
                this.TourDiaryList.forEach(element=>{
                    this.TotalDisbSanctionLetterDelivered = this.TotalDisbSanctionLetterDelivered+Number(element?.DisbSanctionLetterDelivered)
                });
                this.TourDiaryList.forEach(element=>{
                    this.TotalDisbSupplyOrderDelivered = this.TotalDisbSupplyOrderDelivered+Number(element?.DisbSupplyOrderDelivered)
                });
                this.TourDiaryList.forEach(element=>{
                    this.TotalRecNoOfDefaulterContacted = this.TotalRecNoOfDefaulterContacted+Number(element?.RecNoOfDefaulterContacted)
                });
                this.TourDiaryList.forEach(element=>{
                    this.TotalRecNoOfLegalNoticeDelivered = this.TotalRecNoOfLegalNoticeDelivered+Number(element?.RecNoOfLegalNoticeDelivered)
                });
                this.TourDiaryList.forEach(element=>{
                    this.TotalRecNoOfNoticeDelivered = this.TotalRecNoOfNoticeDelivered+Number(element?.RecNoOfNoticeDelivered)
                });
                this.TourDiaryList.forEach(element=>{
                    this.TotalNoOfUtilizationChecked = this.TotalNoOfUtilizationChecked+Number(element?.NoOfUtilizationChecked)
                });
                this.TourDiaryList.forEach(element=>{
                    this.TotalNoOfSanctnMutationVerified = this.TotalNoOfSanctnMutationVerified+Number(element?.NoOfSanctnMutationVerified)
                });
                this.TourDiaryList.forEach(element=>{
                    this.TotalTOTNoOfFarmersVisisted = this.TotalTOTNoOfFarmersVisisted+Number(element?.TOTNoOfFarmersVisisted)
                });

                this.TourDiaryList.forEach(element=>{


                    let a =  Number(element?.TOTFarmersContacted)
                    this.TotalTOTFarmersContacted = this.TotalTOTFarmersContacted+Number(element?.TOTFarmersContacted)
                });



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
    }
}
