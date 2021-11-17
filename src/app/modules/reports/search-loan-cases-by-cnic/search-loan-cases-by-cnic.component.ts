/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LovService } from 'app/shared/services/lov.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'search-loan-cases-by-cnic',
  templateUrl: './search-loan-cases-by-cnic.component.html',
  styleUrls: ['./search-loan-cases-by-cnic.component.scss']
})
export class SearchLoanCasesByCnicComponent implements OnInit {

  searchCnicForm: FormGroup;
  selected_b;
  selected_z;
  selected_c;
  loaded = true;
  disable_circle = true;
  disable_zone = true;
  disable_branch = true;
  single_branch = true;
  single_circle = true;
  single_zone = true;

  LoggedInUserInfo: BaseResponseModel;

  //Zone inventory
  Zones: any = [];
  SelectedZones: any = [];

  //Branch inventory
  Branches: any = [];
  SelectedBranches: any = [];

  //Circle inventory
  Circles: any = [];
  SelectedCircles: any = [];


  constructor(
    public dialogRef: MatDialogRef<SearchLoanCasesByCnicComponent>,
    private fb: FormBuilder,
    private userUtilsService: UserUtilsService,
    private spinner: NgxSpinnerService,
    private _lovService: LovService,
    private layoutUtilsService: LayoutUtilsService
  ) { }

  ngOnInit(): void {
    this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    this.createForm()

    if (this.LoggedInUserInfo.Branch != null) {
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;
      this.disable_circle = false;

      this.Branches = this.LoggedInUserInfo.Branch;
      this.SelectedBranches = this.Branches;

      this.Zones = this.LoggedInUserInfo.Zone;
      this.SelectedZones = this.Zones;

      this.selected_z = this.SelectedZones.ZoneId
      this.selected_b = this.SelectedBranches.BranchCode
      this.selected_c = this.SelectedCircles.Id
      console.log(this.SelectedZones)
      this.searchCnicForm.controls["ZoneId"].setValue(this.SelectedZones?.Id);
      this.searchCnicForm.controls["BranchCode"].setValue(this.SelectedBranches?.Name);
      // var fi : any = []
      // fi.Id = "null";
      // fi.CircleCode = "All";
      // fi.LovId = "0";
      // fi.TagName="0";
      // this.SelectedCircles.splice(0, 0, fi)
      // console.log(this.SelectedCircles)
      // this.listForm.controls["CircleId"].setValue(this.SelectedCircles ? this.SelectedCircles[0].Id : "")
    }else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
      this.spinner.show();

      this.userUtilsService.getZone().subscribe((data: any) => {
          this.Zones = data.Zones;
          this.SelectedZones = this.Zones;
          this.single_zone = false;
          this.disable_zone = false;
          this.spinner.hide();

      });}
    


  }
  
 createForm(){
   this.searchCnicForm = this.fb.group({
     ZoneId: ['', Validators.required],
     BranchCode: ['', Validators.required],
     Cnic: [''],
     CustomerName: [''],
     FatherName: ['']
   })
 } 

 find(){
   
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

close(res){
  this.dialogRef.close(res);
}


}
