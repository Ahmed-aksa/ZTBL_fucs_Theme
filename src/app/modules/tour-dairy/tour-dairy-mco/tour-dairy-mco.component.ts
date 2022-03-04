import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {CommonService} from "../../../shared/services/common.service";
import {DatePipe, Location, ViewportScroller} from "@angular/common";
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
import {Activity} from "../../../shared/models/activity.model";

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
    data;
    maxDate = new Date();
    currentActivity: Activity;
    has_previous: Boolean = false;

    checkDisable = true;

    systemGenerated: any;
    TotalNoOfCasesReceived = 0;
    TotalDisbNoOfCasesAppraised = 0;
    TotalDisbNoOfRecordVerified = 0;
    TotalDisbNoOfSanctionedAuthorized = 0;
    TotalDisbSanctionLetterDelivered = 0;
    TotalDisbSupplyOrderDelivered = 0;
    TotalRecNoOfDefaulterContacted = 0;
    TotalRecNoOfLegalNoticeDelivered = 0;
    TotalRecNoOfNoticeDelivered = 0;
    TotalNoOfUtilizationChecked = 0;
    TotalNoOfSanctnMutationVerified = 0;
    TotalTOTNoOfFarmersVisisted = 0;
    TotalTOTFarmersContacted = 0;


    //**************** Time ****************************
    @ViewChild("timepicker") timepicker: any;
    edit_mode: boolean = true;

    constructor(
        private fb: FormBuilder,
        private userService: UserUtilsService,
        private _common: CommonService,
        private datePipe: DatePipe,
        private tourDiaryService: TourDiaryService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private _cdf: ChangeDetectorRef,
        private scroll: ViewportScroller,
        private router: Router,
        private toastr: ToastrService,
        private location: Location
    ) {

    }

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

    ngOnInit(): void {
        this.currentActivity = this.userService.getActivity('Tour Diary For MCO');
        this.loggedInUser = this.userService.getUserDetails();
        this.loggedInUser = this.userService.getUserDetails();
        this.createForm();


        // this.gridForm.controls['ArrivalAtTime']?.setValue("1:13 AM");
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
                    this.zone = {
                        ZoneId: this.data.TourDiaries[0].ZoneId
                    };
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
        this.gridForm.controls['Name']?.setValue(this.loggedInUser.User.DisplayName);
        this.gridForm.controls['Ppno']?.setValue(this.loggedInUser.User.UserName);
    }

    createForm() {
        this.gridForm = this.fb.group({
            Name: [null],
            Ppno: [null],
            DiaryId: [null],
            NameOfOfficer: [null],
            TourPlanId: [null, [Validators.required]],
            TourDate: [null, [Validators.required]],
            DepartureFromPlace: [null, [Validators.required]],
            DepartureFromTime: [null, [Validators.required]],
            ArrivalAtPlace: [null, [Validators.required]],
            ArrivalAtTime: [null, [Validators.required]],
            DisbNoOfCasesReceived: [null],
            DisbNoOfCasesAppraised: [null],
            DisbNoOfRecordVerified: [null],
            DisbNoOfSanctionedAuthorized: [null],
            DisbSanctionLetterDelivered: [null],
            DisbSupplyOrderDelivered: [null],
            NoOfSanctnMutationVerified: [null],
            NoOfUtilizationChecked: [null],
            RecNoOfNoticeDelivered: [null],
            RecNoOfLegalNoticeDelivered: [null],
            RecNoOfDefaulterContacted: [null],
            TOTFarmersContacted: [null],
            TOTNoOfFarmersVisisted: [null],
            AnyOtherWorkDone: [null],
            Remarks: [null],
            Status: [null]
        })
        this.setValue();
    }


    saveTourDiary() {


        if (!this.zone) {

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


        this.circle = null
        this.tourDiaryService.saveDiary(this.zone, this.branch, this.circle, this.TourDiary, 'MCO')
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {

                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.TourDiaryList = baseResponse.TourDiary["TourDiaries"];
                this.systemGenerated = baseResponse.TourDiary.SystemGeneratedData;
                this.Calculations();
                this.isUpdate = false;
                this.onClearForm();
            } else {

                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });
    }

    Calculations() {
        this.TotalNoOfCasesReceived = 0;
        this.TotalDisbNoOfCasesAppraised = 0;
        this.TotalDisbNoOfRecordVerified = 0;
        this.TotalDisbNoOfSanctionedAuthorized = 0;
        this.TotalDisbSanctionLetterDelivered = 0;
        this.TotalDisbSupplyOrderDelivered = 0;
        this.TotalRecNoOfDefaulterContacted = 0;
        this.TotalRecNoOfLegalNoticeDelivered = 0;
        this.TotalRecNoOfNoticeDelivered = 0;
        this.TotalNoOfUtilizationChecked = 0;
        this.TotalNoOfSanctnMutationVerified = 0;
        this.TotalTOTNoOfFarmersVisisted = 0;
        this.TotalTOTFarmersContacted = 0;

        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.DisbNoOfCasesReceived))
                this.TotalNoOfCasesReceived = this.TotalNoOfCasesReceived + Number(element?.DisbNoOfCasesReceived)
        });

        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.DisbNoOfCasesAppraised))
                this.TotalDisbNoOfCasesAppraised = this.TotalDisbNoOfCasesAppraised + Number(element?.DisbNoOfCasesAppraised)
        });
        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.DisbNoOfRecordVerified))
                this.TotalDisbNoOfRecordVerified = this.TotalDisbNoOfRecordVerified + Number(element?.DisbNoOfRecordVerified)
        });
        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.DisbNoOfSanctionedAuthorized))
                this.TotalDisbNoOfSanctionedAuthorized = this.TotalDisbNoOfSanctionedAuthorized + Number(element?.DisbNoOfSanctionedAuthorized)
        });
        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.DisbSanctionLetterDelivered))
                this.TotalDisbSanctionLetterDelivered = this.TotalDisbSanctionLetterDelivered + Number(element?.DisbSanctionLetterDelivered)
        });
        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.DisbSupplyOrderDelivered))
                this.TotalDisbSupplyOrderDelivered = this.TotalDisbSupplyOrderDelivered + Number(element?.DisbSupplyOrderDelivered)
        });
        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.RecNoOfDefaulterContacted))
                this.TotalRecNoOfDefaulterContacted = this.TotalRecNoOfDefaulterContacted + Number(element?.RecNoOfDefaulterContacted)
        });
        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.RecNoOfLegalNoticeDelivered))
                this.TotalRecNoOfLegalNoticeDelivered = this.TotalRecNoOfLegalNoticeDelivered + Number(element?.RecNoOfLegalNoticeDelivered)
        });
        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.RecNoOfNoticeDelivered))
                this.TotalRecNoOfNoticeDelivered = this.TotalRecNoOfNoticeDelivered + Number(element?.RecNoOfNoticeDelivered)
        });
        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.NoOfUtilizationChecked))
                this.TotalNoOfUtilizationChecked = this.TotalNoOfUtilizationChecked + Number(element?.NoOfUtilizationChecked)
        });
        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.NoOfSanctnMutationVerified))
                this.TotalNoOfSanctnMutationVerified = this.TotalNoOfSanctnMutationVerified + Number(element?.NoOfSanctnMutationVerified)
        });
        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.TOTNoOfFarmersVisisted))
                this.TotalTOTNoOfFarmersVisisted = this.TotalTOTNoOfFarmersVisisted + Number(element?.TOTNoOfFarmersVisisted)
        });

        this.TourDiaryList.forEach(element => {
            if (!isNaN(element?.TOTFarmersContacted))
                this.TotalTOTFarmersContacted = this.TotalTOTFarmersContacted + Number(element?.TOTFarmersContacted)
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
                this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status, 'MCO')
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


    changeStatus(data, status) {
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
        this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status, 'MCO')
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

    edit(mcoDiary) {
        // this.gridForm.controls['Name']?.setValue(mcoDiary.Name);
        // this.gridForm.controls['Ppno']?.setValue(mcoDiary.Ppno);
        if (mcoDiary?.DiaryId) {
            this.checkDisable = false;
        }
        this.gridForm.controls['ZoneId']?.setValue(mcoDiary?.ZoneId?.toString());
        this.gridForm.controls['BranchCode']?.setValue(mcoDiary?.BranchCode?.toString());
        this.gridForm.controls['CircleId']?.setValue(mcoDiary?.CircleId?.toString());
        this.gridForm.controls['DiaryId']?.setValue(mcoDiary?.DiaryId);
        this.gridForm.controls['TourPlanId']?.setValue(mcoDiary?.TourPlanId);
        this.gridForm.controls['TourDate']?.setValue(this._common.stringToDate(mcoDiary?.TourDate));
        this.gridForm.controls['DepartureFromPlace']?.setValue(mcoDiary?.DepartureFromPlace);
        this.gridForm.controls['DepartureFromTime']?.setValue(mcoDiary?.DepartureFromTime);
        this.gridForm.controls['ArrivalAtPlace']?.setValue(mcoDiary?.ArrivalAtPlace);
        this.gridForm.controls['ArrivalAtTime']?.setValue(mcoDiary?.ArrivalAtTime);
        this.gridForm.controls['DisbNoOfCasesReceived']?.setValue(mcoDiary?.DisbNoOfCasesReceived);
        this.gridForm.controls['DisbNoOfCasesAppraised']?.setValue(mcoDiary?.DisbNoOfCasesAppraised);
        this.gridForm.controls['DisbNoOfRecordVerified']?.setValue(mcoDiary?.DisbNoOfRecordVerified);
        this.gridForm.controls['DisbNoOfSanctionedAuthorized']?.setValue(mcoDiary?.DisbNoOfSanctionedAuthorized);
        this.gridForm.controls['DisbSanctionLetterDelivered']?.setValue(mcoDiary?.DisbSanctionLetterDelivered);
        this.gridForm.controls['DisbSupplyOrderDelivered']?.setValue(mcoDiary?.DisbSupplyOrderDelivered);
        this.gridForm.controls['NoOfSanctnMutationVerified']?.setValue(mcoDiary?.NoOfSanctnMutationVerified);
        this.gridForm.controls['NoOfUtilizationChecked']?.setValue(mcoDiary?.NoOfUtilizationChecked);
        this.gridForm.controls['RecNoOfNoticeDelivered']?.setValue(mcoDiary?.RecNoOfNoticeDelivered);
        this.gridForm.controls['RecNoOfLegalNoticeDelivered']?.setValue(mcoDiary?.RecNoOfLegalNoticeDelivered);
        this.gridForm.controls['RecNoOfDefaulterContacted']?.setValue(mcoDiary?.RecNoOfDefaulterContacted);
        this.gridForm.controls['TOTFarmersContacted']?.setValue(mcoDiary?.TOTFarmersContacted);
        this.gridForm.controls['TOTNoOfFarmersVisisted']?.setValue(mcoDiary?.TOTNoOfFarmersVisisted);
        this.gridForm.controls['AnyOtherWorkDone']?.setValue(mcoDiary?.AnyOtherWorkDone);
        this.gridForm.controls['Remarks']?.setValue(mcoDiary?.Remarks);

        // this._cdf.detectChanges();
        // this.createForm()
        this.isUpdate = true;
        this.date = mcoDiary?.TourDate;
        if (this.date) {
            this.GetTourPlan()
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
        if (this.data.hasOwnProperty('TourDiaries')) {
            this.TourDiaryList = [];
            this.TourPlan = this.data?.TourPlan?.TourPlans;
            this.TourDiaryList = this.data?.TourDiary?.TourDiaries;
            this.systemGenerated = this.data?.TourDiary?.SystemGeneratedData;
        } else {
            this.spinner.show();
            this.tourDiaryService
                .GetScheduleBaseTourPlan(this.zone, this.branch, this.date, 'MCO')
                .pipe(finalize(() => {
                    this.spinner.hide();
                }))
                .subscribe((baseResponse) => {
                    if (baseResponse.Success) {

                        this.TourDiaryList = [];
                        this.TourPlan = baseResponse?.TourPlan?.TourPlans;
                        this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                        this.systemGenerated = baseResponse.TourDiary.SystemGeneratedData;
                        this.Calculations();
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

    }

    dateChange(date: string) {
        var day = date.slice(0, 2),
            month = date.slice(2, 4),
            year = date.slice(4, 8);
        return day + "-" + month + "-" + year;
    }

    previousPage() {
        this.location.back();
    }
}
