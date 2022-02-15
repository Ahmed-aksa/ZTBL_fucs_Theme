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
import {TourDiary} from "../set-target/Models/tour-diary.model";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-tour-diary-approval-mco',
    templateUrl: './tour-diary-approval-mco.component.html',
    styleUrls: ['./tour-diary-approval-mco.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class TourDiaryApprovalMcoComponent implements OnInit {
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
    DateFormat() {
        if (this.Format24 === true) {
            return 24
        } else {
            return 12
        }

    }

    dateChange(date: string) {
        var day = date.slice(0, 2),
            month = date.slice(2, 4),
            year = date.slice(4, 8);
        return day + "-" + month + "-" + year;
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
        private router: Router,
        private toastr: ToastrService
    ) {

    }

    ngOnInit(): void {
        this.data = JSON.parse(localStorage.getItem('TourDiary'))
        if (this.data) {
            localStorage.removeItem('TourDiary');
        } else {
            this.toastr.error("No Tour Diary For Approval Found");
            this.router.navigate(['/tour-diary/tour-diary-approval']);
        }
        this.loggedInUser = this.userService.getUserDetails();
        this.getTourDiaryDetail();
    }

    setValue() {
        this.gridForm.controls['Name'].setValue(this.loggedInUser.User.DisplayName);
        this.gridForm.controls['Ppno'].setValue(this.loggedInUser.User.UserName);
    }

    getTourDiaryDetail() {
        // if(!this.data){
        //
        // }
        this.TourDiary = Object.assign(this.data);
        this.spinner.show();
        console.log(JSON.stringify(this.TourDiary))
        this.tourDiaryService.getTourDiaryDetail(this.zone, this.branch, this.TourDiary)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            debugger
            if (baseResponse.Success) {

                // this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                this.TourDiaryList = baseResponse.TourDiary;
                this.gridForm.patchValue(this.TourDiaryList);
                this.gridForm.controls['TourDate'].setValue(new Date(this.TourDiaryList["TourDate"]));
                this.isUpdate = false;
            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }
        });
    }


    getAllData(event) {

        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;

        this.gridForm.controls["BranchId"].setValue(this.branch.BranchId);
        this.gridForm.controls["ZoneId"].setValue(this.zone.ZoneId);
    }

    changeStatus(status) {
        let dialogRef = null;
        if (status == 'A') {
            dialogRef = this.layoutUtilsService.AlertElementConfirmation("", "Are You Suer you want to confirm the approval?");

        } else if(status == 'R'){
            dialogRef = this.layoutUtilsService.AlertElementConfirmation("", "Are You Suer you want to confirm the Referback?");

        }


        dialogRef.afterClosed().subscribe(res => {

            if (!res) {
                return;
            }
            this.TourDiary = Object.assign(this.data);
            this.spinner.show();
            this.tourDiaryService.ChangeStatusDiary(this.zone, this.branch, this.circle, this.TourDiary, status)
                .pipe(
                    finalize(() => {
                        this.spinner.hide();
                    })
                ).subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                    if(status=='A'){
                        this.toastr.success("Approved");
                    }
                    else if(status == 'R'){
                        this.toastr.success("ReferBack");
                    }

                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message);
                }

            });

        })

    }
}
