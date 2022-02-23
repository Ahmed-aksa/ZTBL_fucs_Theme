import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {finalize} from "rxjs/operators";
import {CommonService} from "../../../shared/services/common.service";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {Activity} from "../../../shared/models/activity.model";

@Component({
    selector: 'app-tour-diary-approval-bm',
    templateUrl: './tour-diary-bm.component.html',
    styleUrls: ['./tour-diary-bm.component.scss'],
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
export class TourDiaryBmComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;
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
    data;
    systemGenerated: any;
    maxDate = new Date();
    checkDisable = true;
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
    ) {
        this.loggedInUser = userService.getSearchResultsDataOfZonesBranchCircle();
    }

    ngOnInit(): void {
        this.currentActivity = this.userService.getActivity('Tour Diary For BM')
        this.createForm();
    }

    ngAfterViewInit() {
        this.data = JSON.parse(localStorage.getItem('TourDiary'))
        if (this.data) {
            localStorage.removeItem('TourDiary');

        }

        /**
         * Hit Edit data request after second
         */
        setTimeout(() => {
            if (this.zone) {
                this.editData(this.data)
            } else {
                this.zone = {
                    ZoneId: this.data.ZoneId
                };
                this.editData(this.data);
            }
        }, 1000);
    }

    setValue() {
        this.gridForm.controls['PPNO'].setValue(this.loggedInUser.User.UserName);
        this.gridForm.controls['NameOfOfficer'].setValue(this.loggedInUser.User.DisplayName);
    }

    createForm() {

        //ArrivalAtPlace
        //ArrivalAtTime
        //Remarks
        //Status
        //CreatedBy

        this.gridForm = this.fb.group({
            DisbNoOfNewBorrowerContacted: [null],
            DisbBorrowerRollOverCasesContacted: [null],
            RecAmountRecoveredWithLCNo: [null],
            RecNoOfDefaulterContacted: [null],
            NoOfUtilizationChecked: [null],
            TOTFarmersContacted: [null],
            TOTNoOfFarmersVisisted: [null],
            AnyOtherWorkDone: [null],
            TourDate: [null, [Validators.required]],
            DiaryId: [null],
            TourPlanId: [null, [Validators.required]],
            BranchId: [null],
            ZoneId: [null],
            CircleId: [null],
            PPNO: [null, [Validators.required]],
            DepartureFromPlace: [null, [Validators.required]],
            DepartureFromTime: [null, [Validators.required]],
            ArrivalAtTime: [null, [Validators.required]],
            ArrivalAtPlace: [null, [Validators.required]],
            Status: [null],
            Remarks: [null],
            Dated: [null],
            NameOfOfficer: [null, [Validators.required]],

        });
        this.setValue();
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

    onClearForm() {

        Object.keys(this.gridForm.controls).forEach((key) => {
            if (key != 'BranchCode' && key != 'ZoneId' && key != 'WorkingDate' && key != 'CircleId')
                this.gridForm.get(key).reset();
        });
        this.isUpdate = false;
        this.checkDisable = true;
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

    setTourDate() {
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

    setDate() {

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

        this.spinner.show();
        this.tourDiaryService
            .GetScheduleBaseTourPlan(this.zone, this.branch, this.date, 'BM')
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.TourDiaryList = [];
                    this.TourPlan = baseResponse?.TourPlan?.TourPlans;
                    this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                    this.systemGenerated = baseResponse.TourDiary.SystemGeneratedData;
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

    assignValues() {
        this.gridForm.controls['DiaryId'].setValue(null);
        this.gridForm.controls["ZoneId"].setValue(this.zone.ZoneId);
        this.gridForm.controls["BranchId"].setValue(this.branch.BranchId);
        this.gridForm.controls['TourDate'].setValue(null);
        this.gridForm.controls['DepartureFromPlace'].setValue("rawalpindi");
        this.gridForm.controls['DepartureFromTime'].setValue("21:00");
        this.gridForm.controls['ArrivalAtPlace'].setValue("rawalpindi");
        this.gridForm.controls['ArrivalAtTime'].setValue("23:00");
        this.gridForm.controls['DisbNoOfNewBorrowerContacted'].setValue("2");
        this.gridForm.controls['RecNoOfDefaulterContacted'].setValue("2");
        this.gridForm.controls['Remarks'].setValue("by behlole");
        this.gridForm.controls['DisbBorrowerRollOverCasesContacted'].setValue("2");
        this.gridForm.controls['RecAmountRecoveredWithLCNo'].setValue("2");
        this.gridForm.controls['NoOfUtilizationChecked'].setValue("2");
        this.gridForm.controls['TOTFarmersContacted'].setValue("2");
        this.gridForm.controls['TOTNoOfFarmersVisisted'].setValue("2");
        this.gridForm.controls['AnyOtherWorkDone'].setValue("Yes");
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
        this.tourDiaryService.saveDiary(this.zone, this.branch, this.circle, this.TourDiary, 'BM')
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {

            if (baseResponse.Success) {
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.TourPlan = baseResponse?.TourPlan?.TourPlans;
                this.systemGenerated = baseResponse.TourDiary.SystemGeneratedData;
                this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                this.isUpdate = false;
                this.onClearForm();
            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });
    }

    changeStatus(data, status) {
        this.TourDiary = Object.assign(this.gridForm.getRawValue());
        if (status == "S") {
            this.TourDiary.TourDate = this.datePipe.transform(this.gridForm.controls.TourDate.value, 'ddMMyyyy')
            this.TourDiary.DiaryId = this.gridForm.controls["DiaryId"]?.value;
            this.TourDiary.TourPlanId = this.gridForm.controls["TourPlanId"]?.value;
            this.TourDiary.Ppno = this.gridForm.controls["Ppno"]?.value;
        } else {
            this.TourDiary.TourDate = data["TourDate"]
            this.TourDiary.DiaryId = data["DiaryId"];
            this.TourDiary.TourPlanId = data["TourPlanId"];
            this.TourDiary.Ppno = data["Ppno"];
        }
        this.spinner.show();
        this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status, 'BM')
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.isUpdate = false;
                this.onClearForm();
                this.TourDiary = null;

                this.TourPlan = baseResponse?.TourPlan?.TourPlans;

                this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
            } else {
                this.TourDiary = null;
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });
    }

    getTourDiary(event) {

    }

    editData(tour_list) {
        if (tour_list.DiaryId) {
            this.checkDisable = false;
        }
        this.isUpdate = true;
        this.gridForm.patchValue(tour_list);
        this.gridForm.get('TourDate').patchValue(this._common.stringToDate(tour_list.TourDate));
        this.date = tour_list.TourDate;
        this.GetTourPlan()
    }

    deleteData(data, status = 'C') {

        const _title = 'Confirmation';
        const _description = 'Do you really want to continue?';
        const _waitDesciption = '';
        const _deleteMessage = ``;

        const dialogRef = this.layoutUtilsService.AlertElementConfirmation(_title, _description, _waitDesciption);


        dialogRef.afterClosed().subscribe(res => {

            if (!res) {
                return;
            }
            if (!this.TourDiary) {
                this.TourDiary = {}
            }
            if (status == 'S') {
                this.TourDiary.TourDate = this.datePipe.transform(this.gridForm.controls.TourDate.value, 'ddMMyyyy')
                this.TourDiary.DiaryId = this.gridForm.controls["DiaryId"]?.value;
                this.TourDiary.TourPlanId = this.gridForm.controls["TourPlanId"]?.value;
                this.TourDiary.Ppno = this.gridForm.controls["PPNO"]?.value;

            } else {
                this.TourDiary.TourDate = data["TourDate"]
                this.TourDiary.DiaryId = data["DiaryId"];
                this.TourDiary.TourPlanId = data["TourPlanId"];
                this.TourDiary.Ppno = data["Ppno"];
            }

            this.spinner.show();
            this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status, 'BM')
                .pipe(
                    finalize(() => {
                        this.spinner.hide();
                    })
                ).subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                    this.isUpdate = false;
                    this.TourPlan = baseResponse?.TourPlan?.TourPlans;
                    this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                    this.onClearForm();
                    this.TourDiary = null;
                } else {
                    this.TourDiary = null;
                    this.layoutUtilsService.alertElement('', baseResponse.Message);
                }

            });
        });
    }

}
