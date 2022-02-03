import {Component, OnInit, ViewChild} from '@angular/core';
import {SignatureDailogDairyComponent} from "../signature-dailog-dairy/signature-dailog-dairy.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";

@Component({
    selector: 'app-tour-dairy-zc',
    templateUrl: './tour-dairy-zc.component.html',
    styleUrls: ['./tour-dairy-zc.component.scss'],
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
export class TourDairyZcComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;
    maxDate: Date;
    TourPlan;
    sign;
    zone: any;
    branch: any;
    circle: any;
    Format24:boolean=true;
    isUpdate:boolean=false;

    constructor(
        private fb: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private userUtilsService: UserUtilsService,
        public dialog: MatDialog,
        private router: Router
    ) {
        this.loggedInUser = userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    }

    ngOnInit(): void {
        this.createForm();
    }

    isEnableReceipt(isTrCodeChange: boolean) {
        var Date = this.gridForm.controls.Date.value;
        if (Date._isAMomentObject == undefined) {
            try {
                var day = this.gridForm.controls.Date.value.getDate();
                var month = this.gridForm.controls.Date.value.getMonth() + 1;
                var year = this.gridForm.controls.Date.value.getFullYear();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.gridForm.controls.Date.setValue(branchWorkingDate);
            } catch (e) {
            }
        } else {
            try {
                var day = this.gridForm.controls.Date.value.toDate().getDate();
                var month =
                    this.gridForm.controls.Date.value.toDate().getMonth() + 1;
                var year = this.gridForm.controls.Date.value
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
                this.gridForm.controls.Date.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }


    saveTourDiary(){}

    onClearForm() {
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

        this.isUpdate=false;
        //this.setValue();

    }

    // isEnableReceipt(isTrCodeChange: boolean) {
    //     var Date = this.gridForm.controls.TourDate.value;
    //     if (Date._isAMomentObject == undefined) {
    //         try {
    //             var day = this.gridForm.controls.TourDate.value.getDate();
    //             var month = this.gridForm.controls.TourDate.value.getMonth() + 1;
    //             var year = this.gridForm.controls.TourDate.value.getFullYear();
    //             if (month < 10) {
    //                 month = '0' + month;
    //             }
    //             if (day < 10) {
    //                 day = '0' + day;
    //             }
    //             const branchWorkingDate = new Date(year, month - 1, day);
    //             this.gridForm.controls.TourDate.setValue(branchWorkingDate);
    //         } catch (e) {
    //         }
    //     } else {
    //         try {
    //             var day = this.gridForm.controls.TourDate.value.toDate().getDate();
    //             var month =
    //                 this.gridForm.controls.TourDate.value.toDate().getMonth() + 1;
    //             var year = this.gridForm.controls.TourDate.value
    //                 .toDate()
    //                 .getFullYear();
    //             if (month < 10) {
    //                 month = '0' + month;
    //             }
    //             if (day < 10) {
    //                 day = '0' + day;
    //             }
    //             Date = day + '' + month + '' + year;
    //
    //             const branchWorkingDate = new Date(year, month - 1, day);
    //             this.gridForm.controls.TourDate.setValue(branchWorkingDate);
    //         } catch (e) {
    //         }
    //     }
    // }

    createForm() {
        this.gridForm = this.fb.group({
            NameOfOfficer: [''],
            PPNO: [null],
            Month: [null],
            Zone: [null],
            TourDate: [null],
            Date: [null],
            TourPlanId: [null],
            DepartureFromPlace: [null],
            DepartureFromTime: [null],
            ArrivalAtPlace: [null],
            ArrivalAtTime: [null],
            GeneralAdministration: [null],
            CashManagement: [null],
            AuditReports: [null],
            OutstandingParas: [null],
            Settlement: [null],
            LoanCasesInRecoverySchedule: [null],
            ProgressiveFarmersContacted: [null],
            NoOfFarmsVisited: [null],
            AnyOtherWorkDone:[null],
            Remarks:[null],
            Name: [null],
            Designation: [null],
            Dated: [null],
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

