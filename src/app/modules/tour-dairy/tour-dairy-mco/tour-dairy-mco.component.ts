import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
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

@Component({
    selector: 'app-tour-dairy-mco',
    templateUrl: './tour-dairy-mco.component.html',
    styleUrls: ['./tour-dairy-mco.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class TourDairyMcoComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;
    Today = this._common.workingDate();
    minDate: Date;
    date: string;
    branch: any;
    zone: any;
    circle: any;
    TourDiary;
    TourPlan;

    constructor(
        private fb: FormBuilder,
        private userService: UserUtilsService,
        private _common: CommonService,
        private datePipe: DatePipe,
        private tourDiaryService: TourDiaryService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
    ) {

    }

    ngOnInit(): void {
        debugger
        this.loggedInUser = this.userService.getUserDetails();
        this.createForm()
        this.gridForm.controls['Name'].setValue(this.loggedInUser.User.DisplayName);
        this.gridForm.controls['Ppno'].setValue(this.loggedInUser.User.UserName);
    }

    createForm() {
        this.gridForm = this.fb.group({
            Name: [null],
            Ppno: [null],
            Month: [null],
            Date:[],
            DiaryId:[],
            TourPlanId:[""],
            // BranchId:[],
            // ZoneId:[],
            // CircleId:[],
            TourDate:[],
            DepartureFromPlace:[],
            DepartureFromTime:[],
            ArrivalAtPlace:[],
            ArrivalAtTime:[],
            DisbNoOfCasesReceived:[],
            DisbNoOfCasesAppraised:[],
            DisbNoOfRecordVerified:[],
            DisbNoOfSanctionedAuthorized:[],
            DisbSanctionLetterDelivered:[],
            DisbSupplyOrderDelivered:[],
            NoOfSanctnMutationVerified:[],
            NoOfUtilizationChecked:[],
            RecNoOfNoticeDelivered:[],
            RecNoOfLegalNoticeDelivered:[],
            RecNoOfDefaulterContacted:[],
            TotFarmersContacted:[],
            TotNoOfFarmersVisisted:[],
            AnyOtherWorkDone:[],
            Remarks:[],

        })
    }



    saveTourDiary() {


        if (this.gridForm.invalid) {
            const controls = this.gridForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );


            return;
        }

        this.TourDiary = Object.assign(this.gridForm.getRawValue());
debugger
        this.spinner.show();
        this.tourDiaryService.saveDiary(this.zone,this.branch,this.TourDiary)
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

    submit(){}
    edit(){
    }
    delete(){
    }
    onClearForm() {

        this.gridForm.controls["DevProdFlag"].setValue("");
        this.gridForm.controls["DevAmount"].setValue("");
        this.gridForm.controls["ProdAmount"].setValue("");
        this.gridForm.controls["AppNumberManual"].setValue("");
        this.gridForm.controls["CategoryID"].setValue("");
        this.gridForm.controls["CircleID"].setValue("");
        this.gridForm.controls["RefDepositAcc"].setValue("");
        this.gridForm.controls["ApplicantionTitle"].setValue("");
    }
    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }
    getToday() {
        // Today
        this.Today = this._common.workingDate();
        return this.Today;
    }
    setDate() {

        // this.gridForm.controls.Date.value this.datePipe.transform(this.gridForm.controls.Date.value, 'ddMMyyyy')
        this.minDate = this.gridForm.controls.Date.value;
        var varDate = this.gridForm.controls.Date.value;
        if (varDate._isAMomentObject == undefined) {
            try {
                var day = this.gridForm.controls.Date.value.getDate();
                var month = this.gridForm.controls.Date.value.getMonth() + 1;
                var year = this.gridForm.controls.Date.value.getFullYear();
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
                this.gridForm.controls.Date.setValue(branchWorkingDate);

            } catch (e) {
            }
        } else {
            try {
                var day = this.gridForm.controls.Date.value.toDate().getDate();
                var month = this.gridForm.controls.Date.value.toDate().getMonth() + 1;
                var year = this.gridForm.controls.Date.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                varDate = day + "" + month + "" + year;

                this.date = varDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.gridForm.controls.Date.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
        this.GetTourPlan()
    }
    getTourDiary(val){
        // debugger
        // this.spinner.show();
        // this.tourDiary
        //     .SearchTourDiary(this.zone,this.branch,val?.value)
        //     .pipe(finalize(() => {
        //         this.spinner.hide();
        //     }))
        //     .subscribe((baseResponse) => {
        //         if (baseResponse.Success) {
        //             debugger
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

    GetTourPlan(){
        this.spinner.show();
            this.tourDiaryService
                .SearchTourPlan(this.zone,this.branch,this.date)
                .pipe(finalize(() => {
                    this.spinner.hide();
                }))
                .subscribe((baseResponse) => {
                    if (baseResponse.Success) {
                        debugger
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
}
