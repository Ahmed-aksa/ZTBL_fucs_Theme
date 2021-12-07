import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-tour-dairy-mco',
    templateUrl: './tour-dairy-mco.component.html',
    styleUrls: ['./tour-dairy-mco.component.scss']
})
export class TourDairyMcoComponent implements OnInit {
    gridForm: FormGroup;

    constructor(
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.createForm()
    }

    createForm() {
        this.gridForm = this.fb.group({
            McoName: [''],
            PPNO: [''],
            Month: ['']
        })
    }

}
