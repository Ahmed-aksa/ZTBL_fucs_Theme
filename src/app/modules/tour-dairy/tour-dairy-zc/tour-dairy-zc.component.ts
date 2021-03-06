import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DatePipe, Location} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";
import {finalize} from "rxjs/operators";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {ToastrService} from "ngx-toastr";
import {TourDiary} from "../set-target/Models/tour-diary.model";
import {CommonService} from "../../../shared/services/common.service";
import {Activity} from "../../../shared/models/activity.model";
import {EncryptDecryptService} from "../../../shared/services/encrypt_decrypt.service";

@Component({
    selector: 'app-tour-diary-approval-zc',
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
export class TourDiaryZcComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;
    maxDate = new Date();
    TourPlan;
    TourDiary = new TourDiary();
    sign;
    zone: any;
    branch: any;
    circle: any;
    Format24: boolean = true;
    date: any;
    btnText = 'Save';
    TourDiaryList;
    isUpdate: boolean = false;
    data;
    checkDisable = true;
    systemGenerated: any;
    currentActivity: Activity;
    has_previous: boolean = false;
    edit_mode: boolean = true;
    @ViewChild("timepicker") timepicker: any;
    SelectedBranches: any = [];
    ArrivalAtId = null;
    DepartureFromId = null;

    constructor(
        private fb: FormBuilder,
        private userService: UserUtilsService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private tourDiaryService: TourDiaryService,
        private userUtilsService: UserUtilsService,
        public dialog: MatDialog,
        private router: Router,
        private toastr: ToastrService,
        private _common: CommonService,
        private location: Location,
        private enc: EncryptDecryptService
    ) {
        this.loggedInUser = userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    }

    ngOnInit(): void {
        this.currentActivity = this.userUtilsService.getActivity('Tour Diary For ZC')
        this.createForm();
        this.loggedInUser = this.userService.getUserDetails();
    }

    ngAfterViewInit() {
        this.data = JSON.parse(this.enc.decryptStorageData(localStorage.getItem('TourDiary')))
        if (this.data) {
            this.has_previous = true;
            localStorage.removeItem('TourDiary');
            if (this.enc.decryptStorageData(localStorage.getItem('visibility')) == 'false') {
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
                    this.zone = {
                        ZoneId: this.data.ZoneId
                    };
                }
                if (!this.branch) {
                    this.branch = {
                        BranchId: this.data?.BranchId,
                    }
                }

                if (this.data.hasOwnProperty('TourDiaries'))
                    this.edit(this.data.TourDiaries[0])
                else {
                    this.edit(this.data)
                }
            }
        }, 1000);
    }

    setValue() {
        this.gridForm.controls['Name'].setValue(this.loggedInUser.User.DisplayName);
        this.gridForm.controls['Ppno'].setValue(this.loggedInUser.User.UserName);
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
        if (this.gridForm.invalid) {
            const controls = this.gridForm.controls;
            Object.keys(controls).forEach(controlName => {
                    if (controls[controlName].invalid) {
                        this.toastr.error("Please add " + controlName);
                        controls[controlName].markAsTouched()
                        return;
                    }
                }
            );
            return;
        }
        this.TourDiary = Object.assign(this.gridForm.getRawValue());
        this.TourDiary.TourDate = this.datePipe.transform(this.gridForm.controls.TourDate.value, 'ddMMyyyy')
        this.TourDiary.DepartureFromId = this.SelectedBranches.filter(x => x.Name == this.TourDiary.DepartureFromPlace)[0].BranchId.toString();
        this.TourDiary.ArrivalAtId = this.SelectedBranches.filter(x => x.Name == this.TourDiary.ArrivalAtPlace)[0].BranchId.toString();
        this.TourDiary.Status = 'P';
        this.spinner.show();
        this.tourDiaryService.saveDiary(this.zone, this.circle, this.branch, this.TourDiary, 'ZC')
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {

            if (baseResponse.Success) {
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                this.TourDiaryList = baseResponse.TourDiary["TourDiaries"];
                this.systemGenerated = baseResponse.TourDiary?.SystemGeneratedData;
                this.isUpdate = false;
                this.onClearForm();
            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }

        });
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

    createForm() {
        this.gridForm = this.fb.group({
            Name: [null, [Validators.required]],
            Ppno: [null, [Validators.required]],
            DiaryId: [null],
            NameOfOfficer: [null],
            TourPlanId: [null, [Validators.required]],
            TourDate: [null, [Validators.required]],
            DepartureFromPlace: [null, [Validators.required]],
            DepartureFromTime: [null, [Validators.required]],
            ArrivalAtPlace: [null, [Validators.required]],
            ArrivalAtTime: [null, [Validators.required]],
            GeneralAdmissionComplaints: [null],
            CashManagementCompliance: [null],
            NoOfUtilizationChecked: [null],
            AuditReports: [null],
            OutstandingParas: [null],
            Settlements: [null],
            TOTFarmersContacted: [null],
            TOTNoOfFarmersVisisted: [null],
            AnyOtherWorkDone: [null],
            Remarks: [null],
            Status: [null]
        });
        this.setValue();
    }

    setDate() {
        if (this.gridForm.value.ArrivalAtPlace && this.gridForm.value.DepartureFromPlace) {
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
        this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status, 'ZC')
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

    edit(zcDiary) {
        if (zcDiary.DiaryId) {
            this.checkDisable = false;
        }
        this.gridForm.patchValue(zcDiary);
        this.gridForm.get('TourDate').patchValue(this._common.stringToDate(zcDiary.TourDate));
        this.ArrivalAtId = zcDiary?.ArrivalAtId;
        this.DepartureFromId = zcDiary?.DepartureFromId;
        this.isUpdate = true;

        this.date = zcDiary.TourDate;
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
                this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status, 'ZC')
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

    GetTourPlan() {
        if (this.data?.hasOwnProperty('TourDiaries')) {
            this.TourDiaryList = [];
            this.TourPlan = this.data?.TourPlan?.TourPlans;
            this.setValidators(this.data?.TourPlanId);
            this.TourDiaryList = this.data?.TourDiary?.TourDiaries;
            this.systemGenerated = this.data?.TourDiary?.SystemGeneratedData;
        } else {
            this.spinner.show();
            this.tourDiaryService
                .GetScheduleBaseTourPlan(this.zone, this.branch, this.date, 'ZC', this.gridForm.value.ArrivalAtId?.toString(), this.gridForm.value.DepartureFromId?.toString())
                .pipe(finalize(() => {
                    this.spinner.hide();
                }))
                .subscribe((baseResponse) => {
                    if (baseResponse.Success) {

                        this.TourDiaryList = []
                        this.TourPlan = baseResponse?.TourPlan?.TourPlans;
                        this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                        this.systemGenerated = baseResponse.TourDiary?.SystemGeneratedData;

                    } else {
                        this.TourDiaryList = []
                        this.TourPlan = null;
                        this.layoutUtilsService.alertElement(
                            '',
                            baseResponse.Message,
                            baseResponse.Code
                        );
                    }
                });
        }

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

    getAllData(data) {
        if (Array.isArray(data.final_zone)) {
            this.zone = data.final_zone[0];
        } else {
            this.zone = data.final_zone;
        }
        this.branch = data.final_branch;
        this.circle = data.final_circle;

        var zoneId = this.zone?.ZoneId;
        this.getBranches(zoneId);
    }

    getBranches(changedValue) {
        let changedZone = null;
        if (changedValue?.value) {
            changedZone = {Zone: {ZoneId: changedValue.value}}
        } else {
            changedZone = {Zone: {ZoneId: changedValue}}
        }
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.gridForm.value.ArrivalAtPlace = this.data?.ArrivalAtPlace;
            this.gridForm.value.DepartureFromPlace = this.data?.DepartureFromPlace;
            this.SelectedBranches = data.Branches;
        });
    }

    previous() {
        localStorage.setItem('back_to_list',this.enc.encryptStorageData( 'true'));
        this.location.back();
    }


    setValidators(value) {
        this.tourDiaryService.changeValidators(this.gridForm, this.TourPlan, value);
    }
}

