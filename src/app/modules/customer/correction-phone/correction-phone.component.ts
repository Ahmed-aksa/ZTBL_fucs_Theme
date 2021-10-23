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
import { Branch } from 'app/shared/models/branch.model';
import { Circle } from 'app/shared/models/circle.model';


@Component({
  selector: 'kt-correction-phone',
  templateUrl: './correction-phone.component.html',
  styleUrls: ['./correction-phone.component.scss']
})
export class CorrectionPhoneComponent implements OnInit {


  disable_circle = true;
  disable_zone = true;
  disable_branch = true;

  loggedInUser: any;
  cpForm: FormGroup;
  customerRec: any;
  single_branch = true;
  single_circle = true;
  single_zone = true;
  phoneCellTab: boolean = false;
  LoggedInUserInfo: BaseResponseModel;
  //Zone inventory
  Zones: any = [];
  SelectedZones: any = [];
  Zone: any;

  //Branch inventory
  Branches: any = [];
  SelectedBranches: any = [];
  public Branch = new Branch();

  //Circle inventory
  Circles: any = [];
  SelectedCircles: any = [];
  public Circle = new Circle();

  selected_b;
  selected_z;
  selected_c;


  final_branch: any;
  final_zone: any;
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

    this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();

    if (this.LoggedInUserInfo.Branch && this.LoggedInUserInfo.Branch.BranchCode != "All") {
      this.SelectedCircles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedBranches = this.LoggedInUserInfo.Branch;
      this.SelectedZones = this.LoggedInUserInfo.Zone;

      this.selected_z = this.SelectedZones?.ZoneId
      this.selected_b = this.SelectedBranches?.BranchCode
      this.selected_c = this.SelectedCircles?.Id
      this.cpForm.controls['Zone'].setValue(this.SelectedZones.ZoneName);
      this.cpForm.controls['Branch'].setValue(this.SelectedBranches.BranchCode);

      if (this.cpForm.value.BranchCode) {
        this.changeBranch(this.cpForm.value.BranchCode)
      }

    } else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
      this.spinner.show();

      this.userUtilsService.getZone().subscribe((data: any) => {
        this.Zone = data.Zones;
        this.SelectedZones = this.Zone;
        this.single_zone = false;
        this.disable_zone = false;
        this.spinner.hide();

      });
    }
  }
  changeZone(changedValue) {
    let changedZone = {Zone: {ZoneId: changedValue.value}}
    this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
        this.Branches = data.Branches;
        this.SelectedBranches = this.Branches;
        this.single_branch = false;
        this.disable_branch = false;
    });
}
  changeBranch(changedValue) {
    let changedBranch = null;
    if (changedValue.value)
        changedBranch = {Branch: {BranchCode: changedValue.value}}
    else
        changedBranch = {Branch: {BranchCode: changedValue}}
    this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {
        this.SelectedCircles = data.Circles;
        this.selected_c = this.SelectedCircles[0].Id;
        this.disable_circle = false;
    });
}
  createForm() {
    this.cpForm = this.fb.group({
      Zone: [''],
      Branch: [''],
      Cnic: [''],
      CustomerName: [''],
      FatherName: [''],
      ExistingCnic: [''],
      PhoneCell: [''],
    })
  }
  private assignBranchAndZone() {
    if (this.SelectedBranches.length)
        this.final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0]
    else
        this.final_branch = this.SelectedBranches;
    let zone = null;
    if (this.SelectedZones.length)
        this.final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
    else
        this.final_zone = this.SelectedZones;
}
  find() {
    var cnic = this.cpForm.controls.Cnic.value;
    this.assignBranchAndZone();
    this.spinner.show();
    this._customerService.getCustomerByCnic(cnic, this.final_branch, this.final_zone)
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
          }
          else {
            this.cpForm.controls['PhoneCell'].setValue(this.customerRec.PhoneNumber)
          }


          //console.log(phone.slice(4))
          this.cpForm.controls['CustomerName'].setValue(this.customerRec.CustomerName)
          this.cpForm.controls['FatherName'].setValue(this.customerRec.FatherName)
          this.cpForm.controls['ExistingCnic'].setValue(this.customerRec.Cnic)
          console.log(baseResponse)

        }
        else {
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
        }
        else {
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

}
