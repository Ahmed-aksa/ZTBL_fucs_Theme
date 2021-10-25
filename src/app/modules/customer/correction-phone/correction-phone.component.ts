import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { finalize } from "rxjs/operators";
import { FormBuilder, FormGroup } from '@angular/forms';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'app/shared/services/customer.service';
import { BaseResponseModel } from 'app/shared/models/base_response.model';


@Component({
  selector: 'kt-correction-phone',
  templateUrl: './correction-phone.component.html',
  styleUrls: ['./correction-phone.component.scss']
})
export class CorrectionPhoneComponent implements OnInit {

  loggedInUser: any;
  cpForm : FormGroup;
  customerRec: any;

  phoneCellTab : boolean = false;
  
  constructor(private fb: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,  
    private spinner: NgxSpinnerService,
    private userUtilsService: UserUtilsService,
    public dialog: MatDialog,
    private _customerService: CustomerService,
    private router: Router,
    
    ) {
      this.loggedInUser = userUtilsService.getUserDetails();
      console.log(this.loggedInUser)
     }

  ngOnInit() {
    this.createForm()
    this.cpForm.controls['Zone'].setValue(this.loggedInUser.Zone.ZoneName);
    this.cpForm.controls['Branch'].setValue(this.loggedInUser.Branch.Name);
  }

  createForm(){
    this.cpForm = this.fb.group({
      Zone:[''],
      Branch:[''],
      Cnic:[''],
      CustomerName:[''],
      FatherName:[''],
      ExistingCnic:[''],
      PhoneCell:[''],
    })
  }

  find(){
    debugger
    var cnic = this.cpForm.controls.Cnic.value;
    this.spinner.show();
    this._customerService.getCustomerByCnic(cnic)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      debugger
      if(baseResponse.Success === true){
        this.customerRec = baseResponse.Customer
        this.phoneCellTab = true;

        if(this.customerRec.PhoneNumber != undefined){
          var phone = this.customerRec.PhoneNumber, number;
          number = phone.slice(5);
          this.cpForm.controls['PhoneCell'].setValue(number)
        }
        else{
          this.cpForm.controls['PhoneCell'].setValue(this.customerRec.PhoneNumber)
        }

        
        //console.log(phone.slice(4))
        this.cpForm.controls['CustomerName'].setValue(this.customerRec.CustomerName)
        this.cpForm.controls['FatherName'].setValue(this.customerRec.FatherName)
        this.cpForm.controls['ExistingCnic'].setValue(this.customerRec.Cnic)
        console.log(baseResponse)
        
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
  }

  onUpdate(){
    debugger
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
    .subscribe((baseResponse: BaseResponseModel) =>{
      debugger
      if(baseResponse.Success === true){
        this.customerRec = baseResponse.Customer
        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message)
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
  }

  onCancel(){
    this.phoneCellTab = false;
    this.cpForm.controls['CustomerName'].reset()
    this.cpForm.controls['FatherName'].reset()
    this.cpForm.controls['ExistingCnic'].reset()
    this.cpForm.controls['PhoneCell'].reset()
  }

}
