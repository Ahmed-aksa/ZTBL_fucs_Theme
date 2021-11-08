/* eslint-disable no-debugger */
/* eslint-disable prefer-const */
/* eslint-disable eol-last */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { Branch } from 'app/shared/models/branch.model';
import { Zone } from 'app/shared/models/zone.model';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LovService } from 'app/shared/services/lov.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { KhaadSeedVendorService } from '../service/khaad-seed-vendor.service';
import { VendorDetail } from '../class/vendor-detail';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {
  displayedColumns = ['Name', 'bDescription', 'Address', 'Type', 'Phone', 'Actions'];
  itemsPerPage = 10;
  pageIndex = 1;
  offSet = 0;

  matTableLenght: boolean = false;
  loading: boolean;

  public vendorObj = new VendorDetail();

  totalItems: number | any;
  dv: number | any; //use later

  vendor: any = {};
  vendorLov: any;

  dataSource: MatTableDataSource<VendorList>
  listForm: FormGroup;

  //Zone inventory
  Zones: any = [];
  SelectedZones: any = [];
  public Zone = new Zone();

  //Branch inventory
  Branches: any = [];
  SelectedBranches: any = [];
  public Branch = new Branch();

  //Circle inventory
  Circles: any = [];
  SelectedCircles: any = [];
  public Circle = new Branch();

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

  LoggedInUserInfo:BaseResponseModel;
  user: any = {};

  public LovCall = new Lov();


  constructor(
    private _khaadSeedVendor: KhaadSeedVendorService,
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
    private fb: FormBuilder,
    private _lovService: LovService,
    private activatedRoute: ActivatedRoute,
    private userUtilsService: UserUtilsService,
    private spinner: NgxSpinnerService
  ) { }


  ngOnInit(): void{

    this.createForm();

    this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();

    this.typeLov();


    if (this.LoggedInUserInfo.Branch != null) {
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;
      this.disable_circle = false;

      this.Branches = this.LoggedInUserInfo.Branch;
      this.SelectedBranches = this.Branches;

      this.Zone = this.LoggedInUserInfo.Zone;
      this.SelectedZones = this.Zone;

      this.selected_z = this.SelectedZones.ZoneId
      this.selected_b = this.SelectedBranches.BranchCode
      this.selected_c = this.SelectedCircles.Id
      console.log(this.SelectedZones)
      this.listForm.controls["ZoneId"].setValue(this.SelectedZones?.Id);
      this.listForm.controls["BranchCode"].setValue(this.SelectedBranches?.Name);
      var fi : any = []
      fi.Id = "null";
      fi.CircleCode = "All";
      fi.LovId = "0";
      fi.TagName="0";
      this.SelectedCircles.splice(0, 0, fi)
      console.log(this.SelectedCircles)
      this.listForm.controls["CircleId"].setValue(this.SelectedCircles ? this.SelectedCircles[0].Id : "")
    }else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
      this.spinner.show();

      this.userUtilsService.getZone().subscribe((data: any) => {
          this.Zone = data.Zones;
          this.SelectedZones = this.Zone;
          this.single_zone = false;
          this.disable_zone = false;
          this.spinner.hide();

      });}

      if(this.LoggedInUserInfo.Branch != null){
        this.initValues();
      }
  }

  initValues() {
    if (this.LoggedInUserInfo.Zone != undefined && this.LoggedInUserInfo.Branch != undefined) {
      this.user.ZoneId = this.LoggedInUserInfo.Zone.ZoneId;
      this.user.BranchCode = this.LoggedInUserInfo.Branch.BranchCode;
    }
    this.searchVendor()
  }

  createForm(){
    this.listForm = this.fb.group({
      ZoneId:[null],
      BranchCode:[null],
      CircleId: [null],
      Type: [null],
      VendorName:[null],
      PhoneNumber:[null]
    })
  }

  find(){
    this.searchVendor()
  }

  async typeLov() {

    this.vendorLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.VendorTypes });
    var fi : any = []
    fi.Value = "null";
    fi.Name = "All";
    fi.LovId = "0"
    fi.TagName="0";
    this.vendorLov.LOVs.splice(0, 0, fi)
    this.vendorLov = this.vendorLov.LOVs;
    console.log(this.vendorLov)
  }

  searchVendor() {
    this.loaded = false;
    this.loading = true;
    var phone, name, type;

    if (this.listForm.controls.ZoneId.value != null && this.listForm.controls.BranchCode.value != null) {
      this.user.ZoneId = this.listForm.controls.ZoneId.value;
      this.user.CircleId = this.listForm.controls.CircleId.value;
      this.user.BranchCode = this.listForm.controls.BranchCode.value;
    }

    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

    name = this.listForm.controls.VendorName.value;
    phone = this.listForm.controls.PhoneNumber.value;
    type = this.listForm.controls.Type.value;



    if (name != null || phone != null){
      this.offSet = 0;
      this.itemsPerPage = 10;
    }

    this.vendorObj.Name = name;
    this.vendorObj.PhoneNumber = phone;
    this.vendorObj.Type = type;


    this.spinner.show();
    this._khaadSeedVendor.searchVendors(this.itemsPerPage, this.offSet, this.vendorObj, this.user)
    .pipe(
      finalize(() => {
      this.loaded = true;
      this.loading = false;
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      if (baseResponse.Success === true) {
        this.loading = true;

        this.dataSource= baseResponse.SeedKhadVendor.VendorDetails
        this.dv = this.dataSource;
        this.matTableLenght = true

        this.totalItems = baseResponse.SeedKhadVendor.VendorDetails[0].TotalRecords
      }
      else{
        this.loading = false;
        this.matTableLenght = false;
        this.dataSource = this.dv.slice(1, 0);
        this.offSet = 0;
        this.pageIndex = 1;
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })

  }

  editDeleteStatus(vendor : any) {
    if (vendor.CreatedBy == this.LoggedInUserInfo.User.UserId) {
      return true
    }
    else {
      return false
    }
  }

  viewStatus(vendor: any) {
    if ((vendor.CreatedBy != this.LoggedInUserInfo.User.UserId) || (vendor.CreatedBy == this.LoggedInUserInfo.User.UserId)) {
      return true
    }
    else {
      return false
    }
  }

  paginate(pageIndex : any, pageSize: any = this.itemsPerPage){

    this.itemsPerPage = pageSize;
      this.offSet = (pageIndex -1) * this.itemsPerPage;
    this.pageIndex = pageIndex;
    this.searchVendor();
    this.dataSource.data = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
  }

  editVendor(vendor: any){
    ;
    localStorage.setItem('SearchVendorData', JSON.stringify(vendor));
    localStorage.setItem('EditVendorData', '1');
    this.router.navigate(['../add-vendor', { upFlag : "1"}], { relativeTo: this.activatedRoute });
  }

  viewVendor(vendor: any){
    ;

    if (vendor.CreatedBy != this.LoggedInUserInfo.User.UserId) {
      vendor.obj = "o"
    } else {
      vendor.obj = "v"
    }


    localStorage.setItem('SearchVendorData', JSON.stringify(vendor));
    localStorage.setItem('EditVendorData', '1');
    this.router.navigate(['../add-vendor', { upFlag : "1"}], { relativeTo: this.activatedRoute });
  }

  deleteVendor(ind_vendor: any){
    this.vendorObj.Id = ind_vendor.Id;

    this.user.ZoneId = ind_vendor.ZoneId
    this.user.BranchCode = ind_vendor.BranchCode
    this.user.CricleId = ind_vendor.CircleId


    this._khaadSeedVendor.deleteVendor(this.vendorObj, this.user)
    .pipe(
      finalize(() => {
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      if(baseResponse.Success === true){
        //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
        //window.location.reload();
        this.vendorObj.Id = null;
        this.searchVendor()
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
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
    if (changedValue) {
        changedBranch = {Branch: {BranchCode: changedValue.value}}
    } else {
        changedBranch = {Branch: {BranchCode: changedValue}}

    }
    this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {
        console.log(data);
        this.Circles = data.Circles;
        this.SelectedCircles = this.Circles;
        var fi : any = []
        fi.Id = "null";
        fi.Name = "All";
        fi.LovId = "0";
        fi.TagName="0";
        this.SelectedCircles.splice(0, 0, fi)
        this.listForm.controls["CircleId"].setValue(this.SelectedCircles ? this.SelectedCircles[0].Id : "")
        this.disable_circle = false;
    });
}

}

interface VendorList{
  Name: string;
  Description: string;
  Address: string;
  Type: string;
  PhoneNumber: string;
}
