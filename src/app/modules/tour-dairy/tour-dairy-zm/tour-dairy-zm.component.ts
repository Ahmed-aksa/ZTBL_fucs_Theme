import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe, Location} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,} from '@angular/material/core';
import {DateFormats} from '../../../shared/classes/lov.class';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LayoutUtilsService} from '../../../shared/services/layout_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserUtilsService} from '../../../shared/services/users_utils.service';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {finalize} from "rxjs/operators";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {TourDiary} from "../set-target/Models/tour-diary.model";
import {ToastrService} from "ngx-toastr";
import {CommonService} from "../../../shared/services/common.service";
import {Activity} from "../../../shared/models/activity.model";

@Component({
    selector: 'app-tour-diary-approval-zm',
    templateUrl: './tour-dairy-zm.component.html',
    styleUrls: ['./tour-dairy-zm.component.scss'],
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
export class TourDiaryZmComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;
    sign;
    SelectedBranches = [];
    preSelect: any;
    zone: any;
    branch: any;
    circle: any;
    TourPlan: any;
    TourDiary = new TourDiary();
    TourDiaryList = [];
    maxDate = new Date();
    Format24: boolean = true;
    isUpdate: boolean = false;
    date: any;
    btnText = 'Save';
    data;
    systemGenerated: any;
    currentActivity: Activity;
    edit_mode: boolean = true;
    has_previous: boolean = false;
    checkDisable: boolean = true;
    @ViewChild("timepicker") timepicker: any;

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
        private _common: CommonService,
        private location: Location
    ) {
        this.loggedInUser = userUtilsService.getUserDetails();
    }

    ngOnInit(): void {
        this.currentActivity = this.userUtilsService.getActivity('Tour Diary For ZM')
        this.createForm();
    }

    ngAfterViewInit() {
        this.data = JSON.parse(localStorage.getItem('TourDiary'))
        if (this.data) {
            this.has_previous = true;
            localStorage.removeItem('TourDiary');
            if (localStorage.getItem('visibility') == 'false') {
                this.edit_mode = true;
            } else {
                this.edit_mode = false;
            }
            localStorage.removeItem('visibility');
            localStorage.removeItem('TourDiary');
        }
        setTimeout(() => {

            if (this.data) {
                if (!this.zone) {
                    if (this.data && this.data.hasOwnProperty('TourDiaries')) {
                        this.zone = {
                            ZoneId: this.data.TourDiaries[0].ZoneId
                        };
                    } else {
                        this.zone = {
                            ZoneId: this.data.ZoneId
                        };
                    }

                }

                if (this.data && this.data.hasOwnProperty('TourDiaries'))
                    this.edit(this.data.TourDiaries[0])
                else {
                    this.edit(this.data)
                }
            }
        }, 1000);
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
        if (this.data && this.data.hasOwnProperty('TourDiaries')) {
            this.TourDiaryList = [];
            this.TourPlan = this.data?.TourPlan?.TourPlans;
            this.TourDiaryList = this.data?.TourDiary?.TourDiaries;
            this.systemGenerated = this.data?.TourDiary?.SystemGeneratedData;
        } else {
            this.spinner.show();
            this.tourDiaryService
                .GetScheduleBaseTourPlan(this.zone, this.branch, this.date, 'ZM')
                .pipe(finalize(() => {
                    this.spinner.hide();
                }))
                .subscribe((baseResponse) => {
                    if (baseResponse.Success) {

                        this.TourPlan = baseResponse?.TourPlan?.TourPlans;
                        this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                        this.systemGenerated = baseResponse.TourDiary.SystemGeneratedData;
                    } else {
                        this.layoutUtilsService.alertElement(
                            '',
                            baseResponse.Message,
                            baseResponse.Code
                        );
                    }
                });
        }

    }

    setValue() {
        this.gridForm.controls['Name'].setValue(this.loggedInUser.User.DisplayName);
        this.gridForm.controls['Ppno'].setValue(this.loggedInUser.User.UserName);
    }

    changeStatus(data, status) {

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
            });
        }


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
        let departure_datetime = this.tourDiaryService.combineDateAndTime(this.gridForm.value.TourDate, this.gridForm.value.DepartureFromTime)
        let arrival_datetime = this.tourDiaryService.combineDateAndTime(this.gridForm.value.TourDate, this.gridForm.value.ArrivalAtTime)
        if (arrival_datetime < departure_datetime) {
            var Message = 'Arrival Time should be greater than departure time';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }
        this.spinner.show();
        this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status, 'ZM')
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {
                this.TourDiaryList = [];
                this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.onClearForm();
                this.TourDiary = null;
            } else {
                this.TourDiary = null;
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }

        });
    }

    getBranches(changedValue) {
        let changedZone = null;
        if (changedValue?.value) {
            changedZone = {Zone: {ZoneId: changedValue.value}}
        } else {
            changedZone = {Zone: {ZoneId: changedValue}}
        }
        this.spinner.show();
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.spinner.hide();
            this.SelectedBranches = data.Branches;
        });
    }

    createForm() {
        this.gridForm = this.fb.group({
            Name: [null, [Validators.required]],
            Ppno: [null, [Validators.required]],
            TourDate: [null, [Validators.required]],
            DiaryId: [null],
            TourPlanId: [null, [Validators.required]],
            DepartureFromPlace: [null, [Validators.required]],
            DepartureFromTime: [null, [Validators.required]],
            ArrivalAtPlace: [null, [Validators.required]],
            ArrivalAtTime: [null, [Validators.required]],
            LCNotIssuedToBorrowers: [null],
            McoNBmTourDiaryAPPlan: [null],
            AnyShortComingInDiaries: [null],
            RecNoOfDefaulterContacted: [null],
            Remarks: [null],
            Status: [null],
        });
        this.setValue()
    }

    saveTourDiary() {


        if (this.gridForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.gridForm.markAllAsTouched()
            return;
        }

        let departure_datetime = this.tourDiaryService.combineDateAndTime(this.gridForm.value.TourDate, this.gridForm.value.DepartureFromTime)
        let arrival_datetime = this.tourDiaryService.combineDateAndTime(this.gridForm.value.TourDate, this.gridForm.value.ArrivalAtTime)
        if (arrival_datetime < departure_datetime) {
            var Message = 'Arrival Time should be greater than departure time';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }
        this.TourDiary = Object.assign(this.gridForm.getRawValue());
        this.TourDiary.TourDate = this.datePipe.transform(this.gridForm.controls.TourDate.value, 'ddMMyyyy')
        this.TourDiary.Status = 'P';
        this.spinner.show();
        this.tourDiaryService.saveDiary(this.zone, this.branch, this.circle, this.TourDiary, 'ZM')
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {

                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.TourDiaryList = baseResponse.TourDiary.TourDiaries;
                this.systemGenerated = baseResponse.TourDiary.SystemGeneratedData;
                this.onClearForm();
                this.btnText = 'Save';
            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }

        });

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

    onClearForm() {

        Object.keys(this.gridForm.controls).forEach((key) => {
            if (key != 'BranchCode' && key != 'ZoneId' && key != 'WorkingDate' && key != 'CircleId')
                this.gridForm.get(key).reset();
        });
        this.isUpdate = false;
        this.btnText = 'Save';
        this.gridForm.markAsUntouched();
        this.setValue();


    }

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

    edit(zmDiary) {
        if (zmDiary?.DiaryId) {
            this.checkDisable = false;
        }
        this.btnText = 'Update';
        this.gridForm.patchValue(zmDiary);
        this.date = zmDiary.TourDate;
        this.isUpdate = true;
        this.GetTourPlan()
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
                this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status, 'ZM')
                    .pipe(
                        finalize(() => {
                            this.spinner.hide();
                        })
                    ).subscribe(baseResponse => {
                    if (baseResponse.Success) {
                        this.TourDiaryList = [];
                        this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
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


    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle;

        var zoneId = this.zone?.ZoneId;
        this.getBranches(zoneId);

    }

    previous() {
        localStorage.setItem('back_to_list', 'true');
        this.location.back();
    }
}
