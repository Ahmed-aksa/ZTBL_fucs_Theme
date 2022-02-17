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
import {CommonService} from "../../../shared/services/common.service";

@Component({
    selector: 'app-tour-diary-approval-ro',
    templateUrl: './tour-diary-ro.component.html',
    styleUrls: ['./tour-diary-ro.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})

export class TourDiaryRoComponent implements OnInit {
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

    constructor(
        private fb: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private tourDiaryService: TourDiaryService,
        private userUtilsService: UserUtilsService,
        public dialog: MatDialog,
        private router: Router,
        private datePipe: DatePipe,
        private _common: CommonService,
    ) {
        this.loggedInUser = userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    }

    ngOnInit(): void {
        this.createForm();
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
        this.setValue()
    }

    @ViewChild("timepicker") timepicker: any;

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

        // if (!this.branch) {
        //     var Message = 'Please select Branch';
        //     this.layoutUtilsService.alertElement(
        //         '',
        //         Message,
        //         null
        //     );
        //     return;
        // }

        // if (!this.circle) {
        //     var Message = 'Please select Circle';
        //     this.layoutUtilsService.alertElement(
        //         '',
        //         Message,
        //         null
        //     );
        //     return;
        // }

        // if (this.gridForm.invalid) {
        //     const controls = this.gridForm.controls;
        //     Object.keys(controls).forEach(controlName =>
        //         controls[controlName].markAsTouched()
        //     );
        //     return;
        // }

        this.TourDiary = Object.assign(this.gridForm.getRawValue());
        this.TourDiary.TourDate = this.datePipe.transform(this.gridForm.controls.TourDate.value, 'ddMMyyyy')
        this.TourDiary.Status = 'P';
        this.spinner.show();
        this.tourDiaryService.saveDiary(this.zone, this.branch, this.circle, this.TourDiary)
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

    onClearForm() {
        // this.gridForm.controls['Name'].setValue("");
        //this.gridForm.controls['Ppno'].setValue(null);
        this.gridForm.controls['DiaryId'].setValue(null);
        this.gridForm.controls['TourPlanId'].setValue(null);
        this.gridForm.controls["ZoneId"].setValue(this.zone.ZoneId);
        this.gridForm.controls["CircleId"].setValue(null);
        this.gridForm.controls['TourDate'].setValue(null);
        this.gridForm.controls['DepartureFromPlace'].setValue(null);
        this.gridForm.controls['DepartureFromTime'].setValue(null);
        this.gridForm.controls['ArrivalAtPlace'].setValue(null);
        this.gridForm.controls['ArrivalAtTime'].setValue(null);
        this.gridForm.controls['NoOfDefaulterContacted'].setValue(null);
        this.gridForm.controls['Remarks'].setValue(null);
        this.gridForm.controls['MeasureBoostUpRecord'].setValue(null);
        this.gridForm.controls['ResultContactMade'].setValue(null);

        this.gridForm.markAsUntouched();
        this.isUpdate = false;
        this.setValue();

    }

    setValue() {
        this.gridForm.controls['Name'].setValue(this.loggedInUser.User.DisplayName);
        this.gridForm.controls['Ppno'].setValue(this.loggedInUser.User.UserName);
    }

    checkZone() {
        if (!this.zone) {
            var Message = 'Please select Zone';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
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
                this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status, 'RO')
                    .pipe(
                        finalize(() => {
                            this.spinner.hide();
                        })
                    ).subscribe(baseResponse => {
                    if (baseResponse.Success) {

                        this.TourDiaryList = [];
                        this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                        this.isUpdate = false;
                        this.onClearForm();
                        this.TourDiary = null;
                    } else {
                        this.TourDiaryList = [];
                        this.TourDiary = null;
                        this.layoutUtilsService.alertElement('', baseResponse.Message);
                    }

                });
            });
        }
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
        if (action == 'submit') {
            if (item.Status == 'P' || item.Status == 'R') {
                return true;
            } else {
                return false;
            }
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
        this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status, 'RO')
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {


                this.TourDiaryList = [];
                this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.isUpdate = false;
                this.onClearForm();
                this.TourDiary = null;

            } else {
                this.TourDiaryList = [];
                this.TourDiary = null;
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }

        });
    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle;

    }

    edit(mcoDiary) {

        this.gridForm.patchValue(mcoDiary);
        this.gridForm.get('CircleId').patchValue(mcoDiary.CircleId?.toString());
        this.gridForm.get('TourDate').patchValue(this._common.stringToDate(mcoDiary.TourDate));

        this.isUpdate = true;
        this.date = mcoDiary.TourDate;
        this.GetTourPlan()
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

    GetTourPlan() {

        if (!this.zone) {
            var Message = 'Please select Zone';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        // if (!this.branch) {
        //     var Message = 'Please select Branch';
        //     this.layoutUtilsService.alertElement(
        //         '',
        //         Message,
        //         null
        //     );
        //     return;
        // }

        this.spinner.show();
        this.tourDiaryService
            .GetScheduleBaseTourPlan(this.zone, this.branch, this.date)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {

                    this.TourDiaryList = []
                    this.TourPlan = baseResponse?.TourPlan?.TourPlans;
                    this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                    this.systemGenerated = baseResponse.TourDiary.SystemGeneratedData;
                    // this.TargetDuration = baseResponse.Target.TargetDuration;
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });

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
}
