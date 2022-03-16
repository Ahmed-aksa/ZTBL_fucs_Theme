import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-business-leads',
    templateUrl: './business-leads.component.html',
    styleUrls: ['./business-leads.component.scss']
})
export class BusinessLeadsComponent implements OnInit {
    business_leads_form: FormGroup;
    zone: any;
    branch: any;
    circle: any;


    /**
     * Reasons
     */

    crop_farming:Boolean;
    cattle:Boolean;
    tubewell:Boolean;
    tractor:Boolean;
    other:Boolean;


    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.createForm();
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    private createForm() {
        this.business_leads_form = this.formBuilder.group({
            cnic: [null, Validators.required],
            name: [null, Validators.required],
            mobile_number: [null, Validators.required],
            own_land: [null, Validators.required],
            passbook_number: [null, Validators.required],
            area_of_land: [null, Validators.required],
            loan_type: [null, Validators.required],
            total_amount: [null, Validators.required],
        });
    }
}
