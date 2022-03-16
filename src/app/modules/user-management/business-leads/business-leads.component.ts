import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ReportsService} from "../services/reports.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {ToastrService} from "ngx-toastr";

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

    constructor(
        private toaster: ToastrService,private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private reportsService: ReportsService, private layoutUtilsService: LayoutUtilsService) {
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
            MobileNo: [null, ],
            RequestName: [null,Validators.required ],
            IsLandOwner: ['N',Validators.required ],
            PassbookNo: [null, ],
            TotalArea: [null, ],
            TotalAmount: [null, ],
            IsTractor: ['N', ],
            IsLiveSock: ['N', ],
            IsCropProd: ['N', ],
            IsTubeWell: ['N', ],
            IsOther: ['N', ],
            Message: ['', ],
            OtherReason: ['', ],

        });
    }

    changeCheckbox(field, field_name) {
        debugger
        if (field_name == 'crop_farming') {
            if (!field) {
                this.business_leads_form.controls["IsCropProd"].setValue('N')
            } else {
                this.business_leads_form.controls["IsCropProd"].setValue('Y')
            }
        } else if (field_name == 'cattle') {
            if (!field) {

                this.business_leads_form.controls["IsLiveSock"].setValue('N')
            } else {
                this.business_leads_form.controls["IsLiveSock"].setValue('Y')
            }
        } else if (field_name == 'tubewell') {
            if (!field) {
                this.business_leads_form.controls["IsTubeWell"].setValue('N')
                this.business_leads_form.value.IsTubeWell = 'N';
            } else {
                this.business_leads_form.controls["IsTubeWell"].setValue('Y')
            }
        } else if (field_name == 'tractor') {
            if (!field) {

                this.business_leads_form.controls["IsTractor"].setValue('N')
            } else {

                this.business_leads_form.controls["IsTractor"].setValue('Y')
            }
        } else if (field_name == 'other') {
            if (!field) {
                this.business_leads_form.controls["IsOther"].setValue('N')
            } else {
                this.business_leads_form.controls["IsOther"].setValue('Y')

            }
        }
    }

    submitData() {
        debugger;
        const controls = this.business_leads_form.controls;
        if (this.business_leads_form.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            this.toaster.error("Please Enter All Required fields");
            return;
        }
        var obj = Object.assign(this.business_leads_form.value)
        this.spinner.show();
        this.reportsService.submitBusinessLead(obj, this.branch?.BranchId).subscribe((baseResponse) => {
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
