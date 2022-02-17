import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
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
    maxDate: Date;
    sign;
    SelectedBranches = [];
    preSelect: any;
    zone: any;
    branch: any;
    circle: any;
    TourPlan: any;
    TourDiary = new TourDiary();
    TourDiaryList = [];

    Format24:boolean=true;
    isUpdate:boolean=false;
    date: any;
    btnText = 'Save';
    data;
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
    ) {
        this.loggedInUser = userUtilsService.getUserDetails();
        console.log(this.loggedInUser)
    }

    ngOnInit(): void {
        this.createForm();
    }

    ngAfterViewInit()
    {
        this.data = JSON.parse(localStorage.getItem('TourDiary'))
        if (this.data) {
            localStorage.removeItem('TourDiary');
            this.edit(this.data)
        }
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

    GetTourPlan(){
        this.spinner.show();
        this.tourDiaryService
            .GetScheduleBaseTourPlan(this.zone,this.branch,this.date)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {

                    this.TourPlan = baseResponse?.TourPlan?.TourPlans;
                    this.TourDiaryList = baseResponse?.TourDiary?.TourDiaries;
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });

    }

    setValue(){
        this.gridForm.controls['Name'].setValue(this.loggedInUser.User.DisplayName);
        this.gridForm.controls['Ppno'].setValue(this.loggedInUser.User.UserName);
    }

    changeStatus(data,status){

        if(status=="C"){
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
        if(status=="S"){
            this.TourDiary.DiaryId = this.gridForm.controls["DiaryId"]?.value;
            this.TourDiary.TourPlanId = this.gridForm.controls["TourPlanId"]?.value;
            this.TourDiary.Ppno = this.gridForm.controls["Ppno"]?.value;

        }else{
            this.TourDiary.DiaryId = data["DiaryId"];
            this.TourDiary.TourPlanId = data["TourPlanId"];
            this.TourDiary.Ppno = data["Ppno"];
        }

        this.spinner.show();
        this.tourDiaryService.ChangeStatusDiary(this.zone,this.branch, this.circle,this.TourDiary, status,'ZM')
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {
                this.TourDiaryList=[];
                this.TourDiaryList= baseResponse?.TourDiary?.TourDiaries;
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.onClearForm();
                this.TourDiary=null;
            } else {
                this.TourDiary=null;
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }

        });
    }

    getBranches(changedValue){
        let changedZone = null;
        if (changedValue.value) {
            changedZone = {Zone: {ZoneId: changedValue.value}}
        } else {
            changedZone = {Zone: {ZoneId: changedValue}}
        }
        this.spinner.show();
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.spinner.hide();
            this.SelectedBranches = data.Branches;
            console.log(this.SelectedBranches)
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
            Remarks:[null],
            Status:[null],
        });
        this.setValue()
    }

    saveTourDiary(){

        if (this.gridForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.gridForm.markAllAsTouched()
            return;
        }

        this.TourDiary = Object.assign(this.gridForm.getRawValue());
        this.TourDiary.TourDate = this.datePipe.transform(this.gridForm.controls.TourDate.value, 'ddMMyyyy')
        this.TourDiary.Status = 'P';
        this.spinner.show();
        this.tourDiaryService.saveDiary(this.zone,this.branch, this.circle,this.TourDiary)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {

                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.TourDiaryList = baseResponse.TourDiary.TourDiaries;
                this.onClearForm();
            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }

        });

    }

    checkZone(){
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
        this.gridForm.controls['DiaryId'].setValue(null);
        this.gridForm.controls['TourPlanId'].setValue(null);
        this.gridForm.controls['TourDate'].setValue(null);
        this.gridForm.controls['DepartureFromPlace'].setValue(null);
        this.gridForm.controls['DepartureFromTime'].setValue(null);
        this.gridForm.controls['ArrivalAtPlace'].setValue(null);
        this.gridForm.controls['ArrivalAtTime'].setValue(null);
        this.gridForm.controls['LCNotIssuedToBorrowers'].setValue(null);
        this.gridForm.controls['McoNBmTourDiaryAPPlan'].setValue(null);
        this.gridForm.controls['AnyShortComingInDiaries'].setValue(null);
        this.gridForm.controls['RecNoOfDefaulterContacted'].setValue(null);
        this.gridForm.controls['Remarks'].setValue(null);
        this.gridForm.controls['Status'].setValue(null);
        this.btnText = 'Save'
        //this.setValue();

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

    edit(zmDiary){

        this.btnText = 'Update';
        this.gridForm.controls['DiaryId'].setValue(zmDiary.DiaryId);
        this.gridForm.controls['TourPlanId'].setValue(zmDiary.TourPlanId);
        this.gridForm.controls['TourDate'].setValue(this._common.stringToDate(zmDiary.TourDate));
        this.gridForm.controls['DepartureFromPlace'].setValue(zmDiary.DepartureFromPlace);
        this.gridForm.controls['DepartureFromTime'].setValue(zmDiary.DepartureFromTime);
        this.gridForm.controls['ArrivalAtPlace'].setValue(zmDiary.ArrivalAtPlace);
        this.gridForm.controls['ArrivalAtTime'].setValue(zmDiary.ArrivalAtTime);
        this.gridForm.controls['LCNotIssuedToBorrowers'].setValue(zmDiary.LCNotIssuedToBorrowers);
        this.gridForm.controls['McoNBmTourDiaryAPPlan'].setValue(zmDiary.McoNBmTourDiaryAPPlan);
        this.gridForm.controls['AnyShortComingInDiaries'].setValue(zmDiary.AnyShortComingInDiaries);
        this.gridForm.controls['RecNoOfDefaulterContacted'].setValue(zmDiary.LCNotIssuedToBorrowers);
        this.gridForm.controls['Remarks'].setValue(zmDiary.Remarks);
        this.gridForm.controls['Status'].setValue(zmDiary.Status);

        this.date=zmDiary.TourDate;
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
                this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status,'ZM')
                    .pipe(
                        finalize(() => {
                            this.spinner.hide();
                        })
                    ).subscribe(baseResponse => {
                    if (baseResponse.Success) {
                        this.TourDiaryList=[];
                        this.TourDiaryList= baseResponse?.TourDiary?.TourDiaries;
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

        var zoneId = this.zone.ZoneId;
        console.log(zoneId)
        this.getBranches(zoneId);

    }
}
