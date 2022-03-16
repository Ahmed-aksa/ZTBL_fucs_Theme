import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ReportsService} from "../services/reports.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";

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

    constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private reportsService: ReportsService, private layoutUtilsService: LayoutUtilsService) {
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
            CNIC: [null, Validators.required],
            MobileNo: [null, Validators.required],
            RequestName: [null, Validators.required],
            IsLandOwner: ['N', Validators.required],
            PassbookNo: [null, Validators.required],
            TotalArea: [null, Validators.required],
            TotalAmount: [null, Validators.required],
            IsTractor: ['N', Validators.required],
            IsLiveSock: ['N', Validators.required],
            IsCropProd: ['N', Validators.required],
            IsTubeWell: ['N', Validators.required],
            IsOther: ['N', Validators.required],
            Message: ['', Validators.required],
            OtherReason: ['', Validators.required],

        });
    }

    changeCheckbox(field, field_name) {
        if (field_name == 'crop_farming') {
            if (!field) {
                this.business_leads_form.value.IsCropProd = 'N';
            } else {
                this.business_leads_form.value.IsCropProd = 'Y';
            }
        } else if (field_name == 'cattle') {
            if (!field) {
                this.business_leads_form.value.IsLiveSock = 'N';
            } else {
                this.business_leads_form.value.IsLiveSock = 'Y';
            }
        } else if (field_name == 'tubewell') {
            if (!field) {
                this.business_leads_form.value.IsTubeWell = 'N';
            } else {
                this.business_leads_form.value.IsTubeWell = 'Y';
            }
        } else if (field_name == 'tractor') {
            if (!field) {
                this.business_leads_form.value.IsTractor = 'N';
            } else {
                this.business_leads_form.value.IsTractor = 'Y';
            }
        } else if (field_name == 'other') {
            if (!field) {
                this.business_leads_form.value.IsOther = 'N';
            } else {
                this.business_leads_form.value.IsOther = 'Y';
            }
        }
    }

    submitData() {
        debugger;
        this.spinner.show();
        this.reportsService.submitBusinessLead(this.business_leads_form.value, this.branch.BranchId).subscribe((baseResponse) => {
            this.spinner.hide();
            if (baseResponse.Success) {
                this.layoutUtilsService.alertElementSuccess("Success", baseResponse.Message);
                this.business_leads_form.reset();
            } else {
                this.layoutUtilsService.alertElement("Error", baseResponse.Message);
            }
        })
    }
}
