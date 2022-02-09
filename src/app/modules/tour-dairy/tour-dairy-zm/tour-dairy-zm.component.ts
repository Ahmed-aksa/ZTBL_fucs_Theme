import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import {DateFormats} from '../../../shared/classes/lov.class';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LayoutUtilsService} from '../../../shared/services/layout_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserUtilsService} from '../../../shared/services/users_utils.service';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {finalize} from "rxjs/operators";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {TourDiaryZM} from "../model/tour-diary-model";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-tour-dairy-zm',
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
    TourDiary = new TourDiaryZM();
    Format24:boolean=true;
    isUpdate:boolean=false;
    date: any;
    btnText = 'Save';

    constructor(
        private fb: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private userUtilsService: UserUtilsService,
        private tourDiaryService: TourDiaryService,
        public dialog: MatDialog,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.loggedInUser = userUtilsService.getUserDetails();
        console.log(this.loggedInUser)
    }

    ngOnInit(): void {
        this.createForm();
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
            .SearchTourPlan(this.zone,this.branch,this.date)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    
                    // this.TargetDuration = baseResponse.Target.TargetDuration;
                    this.TourPlan=baseResponse?.TourPlan?.TourPlansByDate[0]?.TourPlans;
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
        this.tourDiaryService.ChangeStatusDiary(this.zone,this.branch, this.circle,this.TourDiary, status)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {
                
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
            Name: [null],
            Ppno: [null],
            TourDate: [null],
            //Date: [null],
            TourPlanId: [null],
            DepartureFromPlace: [null],
            DepartureFromTime: [null],
            ArrivalAtPlace: [null],
            ArrivalAtTime: [null],
            LCNotIssuedToBorrowers: [null],
            McoNBmTourDiaryAPPlan: [null],
            AnyShortComingInDiaries: [null],
            NoOfDefaultersContactedByZM: [null],
            Remarks:[null],
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
        this.tourDiaryService.saveDiary(this.zone,this.branch,this.TourDiary)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {

                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                console.log(baseResponse);
                this.onClearForm();
            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }

        });

    }

    onClearForm() {
        this.gridForm.controls['DiaryId'].setValue("");
        this.gridForm.controls['TourPlanId'].setValue("");
        // this.gridForm.controls["ZoneId"].setValue(this.zone.ZoneId);
        // this.gridForm.controls["BranchId"].setValue(this.branch.BranchId);
        // this.gridForm.controls['CircleId'].setValue("");
        this.gridForm.controls['TourDate'].setValue("");
        this.gridForm.controls['DepartureFromPlace'].setValue("");
        this.gridForm.controls['DepartureFromTime'].setValue("");
        this.gridForm.controls['ArrivalAtPlace'].setValue("");
        this.gridForm.controls['ArrivalAtTime'].setValue("");
        this.gridForm.controls['LCNotIssuedToBorrowers'].setValue("");
        this.gridForm.controls['McoNBmTourDiaryAPPlan'].setValue("");
        this.gridForm.controls['AnyShortComingInDiaries'].setValue("");
        this.gridForm.controls['NoOfDefaultersContactedByZM'].setValue("");
        this.gridForm.controls['Remarks'].setValue("");
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

    edit(){
        this.btnText = 'Update'
    }
    delete(){}


    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle;

        var zoneId = this.zone.ZoneId;
        console.log(zoneId)
        this.getBranches(zoneId);

    }
}
