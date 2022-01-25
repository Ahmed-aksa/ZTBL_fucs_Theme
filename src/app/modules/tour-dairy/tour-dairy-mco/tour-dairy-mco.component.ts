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
import {DiaryMCO} from "../set-target/Models/tour-diary.model";

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
    MCOModel = new DiaryMCO;
    gridForm: FormGroup;
    loggedInUser: any;
    Today = this._common.workingDate();
    // minDate: Date;
    date: string;
    branch: any;
    zone: any;
    circle: any;
    TourDiary;
    TourPlan;
    Format24:boolean=true;


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
    DateFormat(){
        if(this.Format24===true){
            return 24
        }
        else{
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
        debugger
        this.loggedInUser = this.userService.getUserDetails();
        this.createForm();

        // this.gridForm.controls['ArrivalAtTime'].setValue("1:13 AM");
    }

    setValue(){
        this.gridForm.controls['Name'].setValue(this.loggedInUser.User.DisplayName);
        this.gridForm.controls['Ppno'].setValue(this.loggedInUser.User.UserName);
    }

    createForm() {
        this.gridForm = this.fb.group({
            Name: [""],
            Ppno: [""],
            Date: [""],
            DiaryId:[""],
            TourPlanId:["", [Validators.required]],
            BranchId:["", [Validators.required]],
            ZoneId:[ "",[Validators.required]],
            CircleId:["", [Validators.required]],
            TourDate:["", [Validators.required]],
            DepartureFromPlace:["", [Validators.required]],
            DepartureFromTime:["", [Validators.required]],
            ArrivalAtPlace:["", [Validators.required]],
            ArrivalAtTime:["", [Validators.required]],
            DisbNoOfCasesReceived:["", [Validators.required]],
            DisbNoOfCasesAppraised:["", [Validators.required]],
            DisbNoOfRecordVerified:["", [Validators.required]],
            DisbNoOfSanctionedAuthorized:["", [Validators.required]],
            DisbSanctionLetterDelivered:["", [Validators.required]],
            DisbSupplyOrderDelivered:["", [Validators.required]],
            NoOfSanctnMutationVerified:["", [Validators.required]],
            NoOfUtilizationChecked:["", [Validators.required]],
            RecNoOfNoticeDelivered:["", [Validators.required]],
            RecNoOfLegalNoticeDelivered:["", [Validators.required]],
            RecNoOfDefaulterContacted:["", [Validators.required]],
            // TotFarmersContacted:["", [Validators.required]],
            // TotNoOfFarmersVisisted:["", [Validators.required]],
            AnyOtherWorkDone:["", [Validators.required]],
            Remarks:["", [Validators.required]],

        })
        this.setValue();
    }



    saveTourDiary() {
debugger

        console.log(this.zone)
        console.log(this.branch)
        this.TourDiary = Object.assign(this.gridForm.getRawValue());
        if (this.gridForm.invalid) {
            const controls = this.gridForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );


            return;
        }

        this.TourDiary = Object.assign(this.gridForm.getRawValue());
debugger
        // this.spinner.show();
        // this.tourDiaryService.saveDiary(this.zone,this.branch,this.TourDiary)
        //     .pipe(
        //         finalize(() => {
        //             this.spinner.hide();
        //         })
        //     ).subscribe(baseResponse => {
        //     if (baseResponse.Success) {
        //         this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        //     } else {
        //
        //         this.layoutUtilsService.alertElement('', baseResponse.Message);
        //     }
        //
        // });
    }

    submit(){}
    edit(){
    }
    delete(){
    }
    onClearForm() {
        // Name: [null],
        //     Ppno: [null],
        //     Month: [null],
        //     Date:[],
        //     DiaryId:[],
        //     TourPlanId:[""],
        //     // BranchId:[],
        //     // ZoneId:[],
        //     // CircleId:[],
        //     TourDate:[],
        //     DepartureFromPlace:[],
        //     DepartureFromTime:[],
        //     ArrivalAtPlace:[],
        //     ArrivalAtTime:[],
        //     DisbNoOfCasesReceived:[],
        //     DisbNoOfCasesAppraised:[],
        //     DisbNoOfRecordVerified:[],
        //     DisbNoOfSanctionedAuthorized:[],
        //     DisbSanctionLetterDelivered:[],
        //     DisbSupplyOrderDelivered:[],
        //     NoOfSanctnMutationVerified:[],
        //     NoOfUtilizationChecked:[],
        //     RecNoOfNoticeDelivered:[],
        //     RecNoOfLegalNoticeDelivered:[],
        //     RecNoOfDefaulterContacted:[],
        //     TotFarmersContacted:[],
        //     TotNoOfFarmersVisisted:[],
        //     AnyOtherWorkDone:[],
        //     Remarks:[],
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

        this.gridForm.controls["BranchId"].setValue(this.branch.BranchId);
        this.gridForm.controls["ZoneId"].setValue(this.zone.ZoneId);
    }
    getToday() {
        // Today
        this.Today = this._common.workingDate();
        return this.Today;
    }
    setDate() {

        // this.gridForm.controls.Date.value this.datePipe.transform(this.gridForm.controls.Date.value, 'ddMMyyyy')
        // this.minDate = this.gridForm.controls.Date.value;
        var varDate = this.gridForm.controls.Date.value;
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
    assignvalues(){
        console.log(this.MCOModel)
        // this.gridForm.controls['Name'].setValue(null);
        // this.gridForm.controls['Ppno'].setValue(null);
        // this.gridForm.controls['DiaryId'].setValue(null);
        this.gridForm.controls['TourPlanId'].setValue(null);
        this.gridForm.controls["ZoneId"].setValue(this.zone.ZoneId);
        this.gridForm.controls["BranchId"].setValue(this.branch.BranchId);
        this.gridForm.controls['CircleId'].setValue(null);

        this.gridForm.controls['TourDate'].setValue(null);
        this.gridForm.controls['DepartureFromPlace'].setValue(null);
        this.gridForm.controls['DepartureFromTime'].setValue(null);
        this.gridForm.controls['ArrivalAtPlace'].setValue(null);
        this.gridForm.controls['ArrivalAtTime'].setValue(null);
        this.gridForm.controls['DisbNoOfCasesReceived'].setValue(null);
        this.gridForm.controls['DisbNoOfRecordVerified'].setValue(null);
        this.gridForm.controls['DisbNoOfSanctionedAuthorized'].setValue(null);
        this.gridForm.controls['DisbSanctionLetterDelivered'].setValue(null);
        this.gridForm.controls['DisbSupplyOrderDelivered'].setValue(null);
        this.gridForm.controls['NoOfSanctnMutationVerified'].setValue(null);
        this.gridForm.controls['NoOfUtilizationChecked'].setValue(null);
        this.gridForm.controls['RecNoOfNoticeDelivered'].setValue(null);
        this.gridForm.controls['RecNoOfLegalNoticeDelivered'].setValue(null);
        this.gridForm.controls['RecNoOfDefaulterContacted'].setValue(null);
        // this.gridForm.controls['TotFarmersContacted'].setValue(null);
        // this.gridForm.controls['TotNoOfFarmersVisisted'].setValue(null);
        this.gridForm.controls['AnyOtherWorkDone'].setValue(null);
        this.gridForm.controls['Remarks'].setValue(null);

        // this._cdf.detectChanges();
        // this.createForm()
    }
}
