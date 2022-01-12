import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserUtilsService} from "../../../shared/services/users_utils.service";

@Component({
    selector: 'app-tour-dairy-mco',
    templateUrl: './tour-dairy-mco.component.html',
    styleUrls: ['./tour-dairy-mco.component.scss']
})
export class TourDairyMcoComponent implements OnInit {
    gridForm: FormGroup;
    loggedInUser: any;

    constructor(
        private fb: FormBuilder,
        private userService: UserUtilsService
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

    submit(){}

}
