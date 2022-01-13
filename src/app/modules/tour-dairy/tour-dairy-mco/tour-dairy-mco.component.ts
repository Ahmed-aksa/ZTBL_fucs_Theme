import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {CommonService} from "../../../shared/services/common.service";

@Component({
    selector: 'app-tour-dairy-mco',
    templateUrl: './tour-dairy-mco.component.html',
    styleUrls: ['./tour-dairy-mco.component.scss']
})
export class TourDairyMcoComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;
    Today = this._common.workingDate();
    minDate: Date;
    date: string;

    constructor(
        private fb: FormBuilder,
        private userService: UserUtilsService,
        private _common: CommonService,
    ) {

    }

    ngOnInit(): void {
        debugger
        this.loggedInUser = this.userService.getUserDetails();
        this.createForm()
        this.gridForm.controls['Name'].setValue(this.loggedInUser.User.DisplayName);
        this.gridForm.controls['Ppno'].setValue(this.loggedInUser.User.UserName);
        console.log(this.gridForm)
    }

    createForm() {
        this.gridForm = this.fb.group({
            Name: [null],
            Ppno: [null],
            Month: [null]
        })
    }

    getToday() {
        // Today

        if (this.gridForm.controls.ToDate.value) {
            this.Today = this.gridForm.controls.ToDate.value
            return this.Today;
        } else {
            // this.Today = new Date();
            this.Today = this._common.workingDate();
            return this.Today;
        }
    }
    submit(){}
    setFromDate() {

        // this.gridForm.controls.FromDate.value this.datePipe.transform(this.gridForm.controls.FromDate.value, 'ddMMyyyy')
        this.minDate = this.gridForm.controls.FromDate.value;
        var FromDate = this.gridForm.controls.FromDate.value;
        if (FromDate._isAMomentObject == undefined) {
            try {
                var day = this.gridForm.controls.FromDate.value.getDate();
                var month = this.gridForm.controls.FromDate.value.getMonth() + 1;
                var year = this.gridForm.controls.FromDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                FromDate = day + "" + month + "" + year;
                this.date = FromDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                // )
                // let newdate = this.datePipe.transform(branchWorkingDate, 'ddmmyyyy')
                //  )
                this.gridForm.controls.FromDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        } else {
            try {
                var day = this.gridForm.controls.FromDate.value.toDate().getDate();
                var month = this.gridForm.controls.FromDate.value.toDate().getMonth() + 1;
                var year = this.gridForm.controls.FromDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                FromDate = day + "" + month + "" + year;

                this.date = FromDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.gridForm.controls.FromDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }
}
