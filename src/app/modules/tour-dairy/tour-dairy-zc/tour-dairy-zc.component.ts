import {Component, OnInit, ViewChild} from '@angular/core';
import {SignatureDailogDairyComponent} from "../signature-dailog-dairy/signature-dailog-dairy.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";
import {finalize} from "rxjs/operators";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {TourDiaryZC} from "../model/tour-diary-model";

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
    TourDiary = new TourDiaryZC();
    sign;
    zone: any;
    branch: any;
    circle: any;
    Format24:boolean=true;
    date: any;
    btnText = 'Save';
    tourDiaryList;

    constructor(
        private fb: FormBuilder,
        private userService: UserUtilsService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private tourDiaryService: TourDiaryService,
        private userUtilsService: UserUtilsService,
        public dialog: MatDialog,
        private router: Router
    ) {
        this.loggedInUser = userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    }

    ngOnInit(): void {
        this.createForm();
        this.loggedInUser = this.userService.getUserDetails();
    }

    setValue(){
        this.gridForm.controls['Name'].setValue(this.loggedInUser.User.DisplayName);
        this.gridForm.controls['Ppno'].setValue(this.loggedInUser.User.UserName);
    }

    saveTourDiary(){

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
        this.gridForm.controls['TourDate'].setValue("");
        this.gridForm.controls['DepartureFromPlace'].setValue("");
        this.gridForm.controls['DepartureFromTime'].setValue("");
        this.gridForm.controls['ArrivalAtPlace'].setValue("");
        this.gridForm.controls['ArrivalAtTime'].setValue("");
        this.gridForm.controls['GeneralAdmissionComplaints'].setValue("");
        this.gridForm.controls['CashManagementCompliance'].setValue("");
        this.gridForm.controls['LoanCasesInRecoverySchedule'].setValue("");
        this.gridForm.controls['AuditReports'].setValue("");
        this.gridForm.controls['OutstandingParas'].setValue("");
        this.gridForm.controls['Settlements'].setValue("");
        this.gridForm.controls['TotFarmersContacted'].setValue("");
        this.gridForm.controls['TotNoOfFarmersVisisted'].setValue("");
        this.gridForm.controls['AnyOtherWorkDone'].setValue("");
        this.gridForm.controls['Remarks'].setValue("");
        this.gridForm.controls['Status'].setValue("");
        this.btnText = 'Save';
    }


    createForm() {
        this.gridForm = this.fb.group({
            Name: [null, [Validators.required]],
            Ppno: [null, [Validators.required]],
            Month: [null, [Validators.required]],
            DiaryId:[null],
            NameOfOfficer:[null],
            TourPlanId:[null, [Validators.required]],
            TourDate:[null, [Validators.required]],
            DepartureFromPlace:[null, [Validators.required]],
            DepartureFromTime:[null, [Validators.required]],
            ArrivalAtPlace:[null, [Validators.required]],
            ArrivalAtTime:[null, [Validators.required]],
            GeneralAdmissionComplaints:[null, [Validators.required]],
            CashManagementCompliance:[null, [Validators.required]],
            // LoanCasesInRecoverySchedule:[null],
            AuditReports:[null, [Validators.required]],
            OutstandingParas:[null, [Validators.required]],
            Settlements:[null, [Validators.required]],
            TotFarmersContacted:[null, [Validators.required]],
            TotNoOfFarmersVisisted:[null, [Validators.required]],
            AnyOtherWorkDone:[null, [Validators.required]],
            Remarks:[null, [Validators.required]],
            Status: [null]
        });
        this.setValue();
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

    edit(){
        this.btnText = 'Update';
    }

    delete(){}

    GetTourPlan(){
        this.spinner.show();
        this.tourDiaryService
            .SearchTourPlan(this.zone,this.branch,this.date)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
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
        // const signatureDialogRef = this.dialog.open(
        //     SignatureDailogDairyComponent,
        //     {width: '500px', disableClose: true}
        // );
        this.spinner.show();
        this.tourDiaryService.ChangeStatusDiary(this.zone,this.branch, this.circle,this.TourDiary, status)
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

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle;

    }
}

