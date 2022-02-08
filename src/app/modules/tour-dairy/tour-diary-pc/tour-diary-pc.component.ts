import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {SignatureDailogDairyComponent} from "../signature-dailog-dairy/signature-dailog-dairy.component";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";
import {finalize} from "rxjs/operators";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";

@Component({
    selector: 'app-tour-diary-pc',
    templateUrl: './tour-diary-pc.component.html',
    styleUrls: ['./tour-diary-pc.component.scss'],
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
export class TourDiaryPcComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;
    maxDate: Date;
    zone: any;
    branch: any;
    circle: any;
    sign;
    TourPlan;
    Format24:boolean=true;
    isUpdate:boolean=false;
    TourDiary;

    constructor(
        private fb: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private userUtilsService: UserUtilsService,
        private tourDiaryService: TourDiaryService,
        public dialog: MatDialog,
        private router: Router
    ) {
        this.loggedInUser = userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    }

    ngOnInit(): void {
        this.createForm();
    }

    isEnableReceipt(isTrCodeChange: boolean) {
        var Date = this.gridForm.controls.TourDate.value;
        if (Date._isAMomentObject == undefined) {
            try {
                var day = this.gridForm.controls.TourDate.value.getDate();
                var month = this.gridForm.controls.TourDate.value.getMonth() + 1;
                var year = this.gridForm.controls.TourDate.value.getFullYear();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.gridForm.controls.TourDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        } else {
            try {
                var day = this.gridForm.controls.TourDate.value.toDate().getDate();
                var month =
                    this.gridForm.controls.TourDate.value.toDate().getMonth() + 1;
                var year = this.gridForm.controls.TourDate.value
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
                this.gridForm.controls.TourDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }

    createForm() {
        this.gridForm = this.fb.group({
            NameOfOfficer: [null],
            PPNO: [null],
            Month: [null],
            Name: [null],
            Date: [null],
            Designation: [null],
            TourDate: [null],
            TourPlanId: [null],
            DepartureFromPlace: [null],
            DepartureFromTime: [null],
            ArrivalAtPlace: [null],
            ArrivalAtTime: [null],
            NoOfDefaultersContacted: [null],
            ResultsOfContactsSoMade: [null],
        });
    }

    @ViewChild("timepicker") timepicker: any;

    openFromIcon(timepicker: { open: () => void }) {
        // if (!this.formControlItem.disabled) {
        timepicker.open();
        // }
    }

    //Date Format
    DateFormat(){
        if(this.Format24===true){
            return 24
        }
        else{
            return 12
        }

    }

    saveTourDiary() {


        if (!this.zone) {
            var Message = 'Please select Zone';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        if (!this.branch) {
            var Message = 'Please select Branch';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        if (!this.circle) {
            var Message = 'Please select Circle';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        if (this.gridForm.invalid) {
            const controls = this.gridForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            return;
        }

        this.TourDiary = Object.assign(this.gridForm.getRawValue());

        this.spinner.show();
        this.tourDiaryService.saveDiary(this.zone,this.branch,this.TourDiary)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
            } else {

                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }

        });
    }

    onClearForm() {
        this.gridForm.controls['Name'].setValue("");
        this.gridForm.controls['Ppno'].setValue("");
        this.gridForm.controls['DiaryId'].setValue("");
        this.gridForm.controls['TourPlanId'].setValue("");
        this.gridForm.controls["ZoneId"].setValue(this.zone.ZoneId);
        this.gridForm.controls["BranchId"].setValue(this.branch.BranchId);
        this.gridForm.controls['CircleId'].setValue("");
        this.gridForm.controls['TourDate'].setValue("");
        this.gridForm.controls['DepartureFromPlace'].setValue("");
        this.gridForm.controls['DepartureFromTime'].setValue("");
        this.gridForm.controls['ArrivalAtPlace'].setValue("");
        this.gridForm.controls['ArrivalAtTime'].setValue("");
        this.gridForm.controls['DisbNoOfCasesReceived'].setValue("");
        this.gridForm.controls['DisbNoOfCasesAppraised'].setValue("");
        this.gridForm.controls['DisbNoOfRecordVerified'].setValue("");
        this.gridForm.controls['DisbNoOfSanctionedAuthorized'].setValue("");
        this.gridForm.controls['DisbSanctionLetterDelivered'].setValue("");
        this.gridForm.controls['DisbSupplyOrderDelivered'].setValue("");
        this.gridForm.controls['NoOfSanctnMutationVerified'].setValue("");
        this.gridForm.controls['NoOfUtilizationChecked'].setValue("");
        this.gridForm.controls['RecNoOfNoticeDelivered'].setValue("");
        this.gridForm.controls['RecNoOfLegalNoticeDelivered'].setValue("");
        this.gridForm.controls['RecNoOfDefaulterContacted'].setValue("");
        this.gridForm.controls['TotFarmersContacted'].setValue("");
        this.gridForm.controls['TotNoOfFarmersVisisted'].setValue("");
        this.gridForm.controls['AnyOtherWorkDone'].setValue("");
        this.gridForm.controls['Remarks'].setValue("");

        // this.setValue();

    }

    SubmitTourDiary() {
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
