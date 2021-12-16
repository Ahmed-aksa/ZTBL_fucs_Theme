import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from '@angular/router';
import {finalize} from "rxjs/operators";
import {FormBuilder, FormGroup} from '@angular/forms';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {MatDialog} from '@angular/material/dialog';
import {CustomerService} from 'app/shared/services/customer.service';
import {BaseResponseModel} from 'app/shared/models/base_response.model';


@Component({
    selector: 'kt-correction-phone',
    templateUrl: './correction-phone.component.html',
    styleUrls: ['./correction-phone.component.scss']
})
export class CorrectionPhoneComponent implements OnInit {

    loggedInUser: any;
    cpForm: FormGroup;
    customerRec: any;

    phoneCellTab: boolean = false;
    zone: any;
    branch: any;

    constructor(private fb: FormBuilder,
                private layoutUtilsService: LayoutUtilsService,
                private spinner: NgxSpinnerService,
                private userUtilsService: UserUtilsService,
                public dialog: MatDialog,
                private _customerService: CustomerService,
                private router: Router,
    ) {
        this.loggedInUser = userUtilsService.getSearchResultsDataOfZonesBranchCircle();

    }

    ngOnInit() {
        this.createForm()
    }

    createForm() {
        this.cpForm = this.fb.group({
            Cnic: [''],
            CustomerName: [''],
            FatherName: [''],
            ExistingCnic: [''],
            PhoneCell: [''],
        })
    }

    find() {

        var cnic = this.cpForm.controls['Cnic'].value;
        
        this.spinner.show();
        this._customerService.getCustomerByCnic(cnic, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    this.customerRec = baseResponse.Customer
                    this.phoneCellTab = true;

                    if (this.customerRec.PhoneNumber != undefined) {
                        var phone = this.customerRec.PhoneNumber, number;
                        number = phone.slice(5);
                        this.cpForm.controls['PhoneCell'].setValue(number)
                    } else {
                        this.cpForm.controls['PhoneCell'].setValue(this.customerRec.PhoneNumber)
                    }


                    //)
                    this.cpForm.controls['CustomerName'].setValue(this.customerRec.CustomerName)
                    this.cpForm.controls['FatherName'].setValue(this.customerRec.FatherName)
                    this.cpForm.controls['ExistingCnic'].setValue(this.customerRec.Cnic)


                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }

    onUpdate() {

        var cnic = this.cpForm.controls.Cnic.value;
        var number = this.cpForm.controls.PhoneCell.value;
        var customerNumber = this.customerRec.CustomerNumber;
        this.spinner.show();
        this._customerService.updateCustomerPhoneCell(cnic, number, customerNumber)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    this.customerRec = baseResponse.Customer
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message)
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }

    onCancel() {
        this.phoneCellTab = false;
        this.cpForm.controls['CustomerName'].reset()
        this.cpForm.controls['FatherName'].reset()
        this.cpForm.controls['ExistingCnic'].reset()
        this.cpForm.controls['PhoneCell'].reset()
    }

    getAllData(event: { final_zone: any; final_branch: any; final_circle: any }) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
    }
}
