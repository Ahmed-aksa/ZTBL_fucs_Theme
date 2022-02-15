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

@Component({
    selector: 'app-tour-diary-approval-mco',
    templateUrl: './tour-dairy-mco.component.html',
    styleUrls: ['./tour-dairy-mco.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class TourDiaryMcoComponent implements OnInit {
    MCOModel = new TourDiary;
    gridForm: FormGroup;
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

    /**
     * Function to clear FormControl's value, called from the HTML template using the clear button
     *
     * @param $event - The Event's data object
     */
    onClear($event: Event) {
        this.gridForm.controls['Name'].setValue(null);

    }

    constructor(
        private fb: FormBuilder,
        private userService: UserUtilsService,
        private _common: CommonService,
        private datePipe: DatePipe,
        private tourDiaryService: TourDiaryService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private _cdf: ChangeDetectorRef,
    ) {

    }

    ngOnInit(): void {

        this.loggedInUser = this.userService.getUserDetails();
        this.createForm();

        // this.gridForm.controls['ArrivalAtTime'].setValue("1:13 AM");
    }

    setValue() {
        this.gridForm.controls['Name'].setValue(this.loggedInUser.User.DisplayName);
        this.gridForm.controls['Ppno'].setValue(this.loggedInUser.User.UserName);
    }

    createForm() {
        this.gridForm = this.fb.group({
            Name: [""],
            Ppno: [""],
            DiaryId: [null],
            NameOfOfficer: [null],
            TourPlanId: ["", [Validators.required]],
            BranchId: ["", [Validators.required]],
            ZoneId: ["", [Validators.required]],
            CircleId: ["", [Validators.required]],
            TourDate: ["", [Validators.required]],
            DepartureFromPlace: ["", [Validators.required]],
            DepartureFromTime: ["", [Validators.required]],
            ArrivalAtPlace: ["", [Validators.required]],
            ArrivalAtTime: ["", [Validators.required]],
            DisbNoOfCasesReceived: [""],
            DisbNoOfCasesAppraised: [""],
            DisbNoOfRecordVerified: [""],
            DisbNoOfSanctionedAuthorized: [""],
            DisbSanctionLetterDelivered: [""],
            DisbSupplyOrderDelivered: [""],
            NoOfSanctnMutationVerified: [""],
            NoOfUtilizationChecked: [""],
            RecNoOfNoticeDelivered: [""],
            RecNoOfLegalNoticeDelivered: [""],
            RecNoOfDefaulterContacted: [""],
            TotFarmersContacted: [""],
            TotNoOfFarmersVisisted: [""],
            AnyOtherWorkDone: [""],
            Remarks: [""],
            Status: [""]
        })
        this.setValue();
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
        this.TourDiary.TourDate = this.datePipe.transform(this.gridForm.controls.TourDate.value, 'ddMMyyyy')
        this.TourDiary.Status = 'P';
        this.spinner.show();
        console.log(JSON.stringify(this.TourDiary))
        this.tourDiaryService.saveDiary(this.zone, this.branch, this.TourDiary)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {

                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.TourDiaryList = baseResponse.TourDiary["TourDiaries"];
                this.isUpdate = false;
                this.onClearForm();
            } else {

                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });
    }

    checkStatus(item, action) {
        if (action == 'edit') {
            if (item.Status == 'P' || item.Status == 'R') {
                return true;
            } else {
                return false;
            }
        }
        if (action == 'delete') {
            if (item.Status == 'P' || item.Status == 'R') {
                return true;
            } else {
                return false;
            }
        }
    }

    delete(data, status) {

        if (status == "C") {
            const _title = 'Confirmation';
            const _description = 'Do you really want to continue?';
            const _waitDesciption = '';
            const _deleteMessage = ``;

            const dialogRef = this.layoutUtilsService.AlertElementConfirmation(_title, _description, _waitDesciption);


            dialogRef.afterClosed().subscribe(res => {

                if (!res) {
                    return;
                }

                this.TourDiary = Object.assign(data);
               this.spinner.show();
                this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status)
                    .pipe(
                        finalize(() => {
                            this.spinner.hide();
                        })
                    ).subscribe(baseResponse => {
                    if (baseResponse.Success) {

                        this.TourDiaryList=[];
                        this.TourDiaryList= baseResponse?.TourDiary?.TourDiaries;
                        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                        this.isUpdate = false;
                        this.onClearForm();
                        this.TourDiary = null;
                    } else {
                        this.TourDiaryList=[];
                        this.TourDiary = null;
                        this.layoutUtilsService.alertElement('', baseResponse.Message);
                    }

                });
            });
        }
    }

    changeStatus(data, status) {

        this.TourDiary = Object.assign(this.gridForm.getRawValue());
        if (status == "S") {
            this.TourDiary.DiaryId = this.gridForm.controls["DiaryId"]?.value;
            this.TourDiary.TourPlanId = this.gridForm.controls["TourPlanId"]?.value;
            this.TourDiary.Ppno = this.gridForm.controls["Ppno"]?.value;

        } else {
            this.TourDiary.DiaryId = data["DiaryId"];
            this.TourDiary.TourPlanId = data["TourPlanId"];
            this.TourDiary.Ppno = data["Ppno"];
        }

        this.spinner.show();
        this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {


                this.TourDiaryList=[];
                this.TourDiaryList= baseResponse?.TourDiary?.TourDiaries;
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.isUpdate = false;
                this.onClearForm();
                this.TourDiary = null;

            } else {
                this.TourDiaryList=[];
                this.TourDiary = null;
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }

        });
    }

    edit(mcoDiary) {

        // this.gridForm.controls['Name'].setValue(null);
        // this.gridForm.controls['Ppno4'].setValue(null);
        this.gridForm.controls['DiaryId'].setValue(mcoDiary.DiaryId);
        this.gridForm.controls['TourPlanId'].setValue(mcoDiary.TourPlanId);
        this.gridForm.controls["ZoneId"].setValue(this.zone.ZoneId);
        this.gridForm.controls["BranchId"].setValue(this.branch.BranchId);
        this.gridForm.controls['CircleId'].setValue(mcoDiary.CircleId);
        this.gridForm.controls['TourDate'].setValue(this._common.stringToDate(mcoDiary.TourDate));
        this.gridForm.controls['DepartureFromPlace'].setValue(mcoDiary.DepartureFromPlace);
        this.gridForm.controls['DepartureFromTime'].setValue(mcoDiary.DepartureFromTime);
        this.gridForm.controls['ArrivalAtPlace'].setValue(mcoDiary.ArrivalAtPlace);
        this.gridForm.controls['ArrivalAtTime'].setValue(mcoDiary.ArrivalAtTime);
        this.gridForm.controls['DisbNoOfCasesReceived'].setValue(mcoDiary.DisbNoOfCasesReceived);
        this.gridForm.controls['DisbNoOfCasesAppraised'].setValue(mcoDiary.DisbNoOfCasesAppraised);
        this.gridForm.controls['DisbNoOfRecordVerified'].setValue(mcoDiary.DisbNoOfRecordVerified);
        this.gridForm.controls['DisbNoOfSanctionedAuthorized'].setValue(mcoDiary.DisbNoOfSanctionedAuthorized);
        this.gridForm.controls['DisbSanctionLetterDelivered'].setValue(mcoDiary.DisbSanctionLetterDelivered);
        this.gridForm.controls['DisbSupplyOrderDelivered'].setValue(mcoDiary.DisbSupplyOrderDelivered);
        this.gridForm.controls['NoOfSanctnMutationVerified'].setValue(mcoDiary.NoOfSanctnMutationVerified);
        this.gridForm.controls['NoOfUtilizationChecked'].setValue(mcoDiary.NoOfUtilizationChecked);
        this.gridForm.controls['RecNoOfNoticeDelivered'].setValue(mcoDiary.RecNoOfNoticeDelivered);
        this.gridForm.controls['RecNoOfLegalNoticeDelivered'].setValue(mcoDiary.RecNoOfLegalNoticeDelivered);
        this.gridForm.controls['RecNoOfDefaulterContacted'].setValue(mcoDiary.RecNoOfDefaulterContacted);
        this.gridForm.controls['TotFarmersContacted'].setValue(mcoDiary.TotFarmersContacted);
        this.gridForm.controls['TotNoOfFarmersVisisted'].setValue(mcoDiary.TotNoOfFarmersVisisted);
        this.gridForm.controls['AnyOtherWorkDone'].setValue(mcoDiary.AnyOtherWorkDone);
        this.gridForm.controls['Remarks'].setValue(mcoDiary.Remarks);

        // this._cdf.detectChanges();
        // this.createForm()
        this.isUpdate = true;
        this.date=mcoDiary.TourDate;
        this.GetTourPlan()
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
        this.gridForm.controls['Status'].setValue("");

        this.isUpdate = false;
        this.gridForm.markAsUntouched();
        this.setValue();

    }

    getAllData(event) {

        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;

        this.gridForm.controls["BranchId"].setValue(this.branch.BranchId);
        this.gridForm.controls["ZoneId"].setValue(this.zone.ZoneId);
    }


    setDate() {

        // this.gridForm.controls.Date.value this.datePipe.transform(this.gridForm.controls.Date.value, 'ddMMyyyy')
        // this.minDate = this.gridForm.controls.Date.value;
        var varDate = this.gridForm.controls.TourDate.value;
        if (varDate._isAMomentObject == undefined) {
            try {
                var day = this.gridForm.controls.TourDate.value.getDate();
                var month = this.gridForm.controls.TourDate.value.getMonth() + 1;
                var year = this.gridForm.controls.TourDate.value.getFullYear();


                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                varDate = day + "" + month + "" + year;
                this.date = varDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                // )
                // let newdate = this.datePipe.transform(branchWorkingDate, 'ddmmyyyy')
                //  )
                this.gridForm.controls.TourDate.setValue(branchWorkingDate);

            } catch (e) {
            }
        } else {
            try {
                var day = this.gridForm.controls.TourDate.value.toDate().getDate();
                var month = this.gridForm.controls.TourDate.value.toDate().getMonth() + 1;
                var year = this.gridForm.controls.TourDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                varDate = day + "" + month + "" + year;

                this.date = varDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.gridForm.controls.TourDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
        this.GetTourPlan()
    }

    getTourDiary(val) {
        //
        // this.spinner.show();
        // this.tourDiary
        //     .SearchTourDiary(this.zone,this.branch,val?.value)
        //     .pipe(finalize(() => {
        //         this.spinner.hide();
        //     }))
        //     .subscribe((baseResponse) => {
        //         if (baseResponse.Success) {
        //
        //             // this.TargetDuration = baseResponse.Target.TargetDuration;
        //             // this.TourPlan=baseResponse?.TourPlan?.TourPlans;
        //         } else {
        //             this.layoutUtilsService.alertElement(
        //                 '',
        //                 baseResponse.Message,
        //                 baseResponse.Code
        //             );
        //         }
        //     });
    }

    GetTourPlan() {
        this.spinner.show();
        this.tourDiaryService
            .GetScheduleBaseTourPlan(this.zone, this.branch, this.date)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {

                    // this.TargetDuration = baseResponse.Target.TargetDuration;
                    this.TourPlan = baseResponse?.TourPlan?.TourPlans;
                    this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                    // this.TourDiaryList = baseResponse?.TourPlan?.TourPlansByDate[0]?.TourPlans;
                } else {
                    this.TourPlan = null;

                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });

    }

    dateChange(date: string) {
        var day = date.slice(0, 2),
            month = date.slice(2, 4),
            year = date.slice(4, 8);
        return day + "-" + month + "-" + year;
    }
}
