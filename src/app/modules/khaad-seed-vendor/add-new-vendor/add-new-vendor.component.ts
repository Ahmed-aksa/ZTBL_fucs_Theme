/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
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
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';
import { ViewFileComponent } from 'app/shared/component/view-file/view-file.component';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { Branch } from 'app/shared/models/branch.model';
import { Circle } from 'app/shared/models/circle.model';
import { Zone } from 'app/shared/models/zone.model';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LovService } from 'app/shared/services/lov.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { KhaadSeedVendor } from '../class/khaad-seed-vendor';
import { VendorDetail } from '../class/vendor-detail';
import { KhaadSeedVendorService } from '../service/khaad-seed-vendor.service';
import { AddressLocationComponent } from './address-location/address-location.component';

@Component({
  selector: 'app-add-new-vendor',
  templateUrl: './add-new-vendor.component.html',
  styleUrls: ['./add-new-vendor.component.scss']
})
export class AddNewVendorComponent implements OnInit, OnDestroy{
  //Objects
  vendorForm : FormGroup;
  VendorAttachedFile = [];
  vendorLov : any;
  images = [];
  ProfileImageSrc: string = "";
  file:File = null;
  rawData : any = {};
  visible: any;
  vendorDetail: any;
  viewOnly = false;
  isEdit = false;
  isEditMode: any = null;
  addedVendor: any;
  vendorEditView: any;
  vendorInfo: any = null;
  vendorObj: any;
  viewOther = false;
  selected_b;
  selected_z;
  LoggedInUserInfo:BaseResponseModel;

  navigationSubscription: any;

  fileExist = false;

  prev_map;


  lat;
  lng;
  type;
  iconUrl;

  user: any = {};

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
  public Circle = new Circle();

  hasFormErrors = false;
  errorShow = false;

  disable_circle = true;
  disable_zone = true;
  disable_branch = true;
  single_branch = true;
  single_circle = true;
  single_zone = true;

  loc_text = "Choose Location"

  public LovCall = new Lov();
  public khaadSeedVendor = new KhaadSeedVendor();
  public vendor = new VendorDetail();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _khaadSeedVendor: KhaadSeedVendorService,
    private _lovService: LovService,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService,
    private userUtilsService: UserUtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                //this.initialiseInvites();
            }
        });

        var CheckEdit = localStorage.getItem("EditJvData");
        if (CheckEdit == '0') {
            localStorage.setItem("SearchJvData", "");
        }
  }

  //Init Func

  ngOnInit() {


    this.images.push(this.ProfileImageSrc);
    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();


    var upFlag = this.activatedRoute.snapshot.params['upFlag'];

    this.isEditMode = localStorage.getItem("EditVendorData");

    if(this.isEditMode != null && this.isEditMode != "0"){
      this.vendorEditView = JSON.parse(localStorage.getItem("SearchVendorData"));

      if(this.vendorEditView != null){
        this.vendorObj = this.vendorEditView.obj;
        this.isEdit = true;
      }

      if (this.vendorObj != undefined && this.vendorObj != null) {
        if (this.vendorObj == "o") {
          this.viewOther = true
        } else {
          this.viewOther = false
        }
        this.viewOnly = true;
        this.isEdit = false;
      }else{
        this.viewOnly = false;
        this.isEdit = true;
      }

    }


    this.createForm();
    this.typeLov();

    if (this.LoggedInUserInfo.Branch != null) {
      this.disable_circle = false
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;

      this.Branches = this.LoggedInUserInfo.Branch;
      this.SelectedBranches = this.Branches;

      this.Zone = this.LoggedInUserInfo.Zone;
      this.SelectedZones = this.Zone;

      this.selected_z = this.SelectedZones.ZoneId
      this.selected_b = this.SelectedBranches.BranchCode
      console.log(this.SelectedZones)
      this.vendorForm.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
      this.vendorForm.controls["BranchCode"].setValue(this.SelectedBranches.Name);
    }else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
      this.spinner.show();

      this.userUtilsService.getZone().subscribe((data: any) => {
          this.Zone = data.Zones;
          this.SelectedZones = this.Zone;
          this.single_zone = false;
          this.disable_zone = false;
          this.spinner.hide();

      });}
    //For Edit Mode
    if(upFlag == "1" && this.isEditMode == "1"){

      localStorage.setItem('EditVendorData', '0');
      this.getVendorInfo();
    }

  }

  //Getting Lov's

  async typeLov(){

    this.vendorLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.VendorTypes });
    this.vendorLov = this.vendorLov.LOVs;
    console.log(this.vendorLov)
  }

  getVendorInfo(){

    this.user.ZoneId = this.vendorEditView.ZoneId;
    this.user.BranchCode = this.vendorEditView.BranchCode;
    this.user.CircleId = this.vendorEditView.CircleId;
    this.vendor.Id = this.vendorEditView.Id;

    var limit = 1, offset = 0;


    this.spinner.show();
    this._khaadSeedVendor.searchVendors(limit, offset, this.vendor, this.user)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      if (baseResponse.Success === true) {

        this.fileExist = true;
        this.vendorInfo = baseResponse.SeedKhadVendor.VendorDetail;

        this.vendorForm.controls["Name"].setValue(this.vendorInfo.Name);
        this.vendorForm.controls["Type"].setValue(this.vendorInfo.Type);
        this.vendorForm.controls["Description"].setValue(this.vendorInfo.Description);
        this.vendorForm.controls["CircleId"].setValue(this.vendorInfo.CircleId);
        this.vendorForm.controls["Location"].setValue(this.vendorInfo.Lat+" , "+ this.vendorInfo.Lng);
        this.lat = this.vendorInfo.Lat;
        this.lng = this.vendorInfo.Lng;
        this.vendorForm.controls["PhoneNumber"].setValue(this.vendorInfo.PhoneNumber);
        this.vendorForm.controls["Address"].setValue(this.vendorInfo.Address);
        this.vendorForm.controls["File"].setValue(this.vendorInfo.FilePath);
        //this.onFileChange(this.vendorInfo.FilePath);

        if(this.vendorForm.controls.Location != undefined || this.vendorForm.controls.Location != null){
          this.loc_text = "Update Location"
        }

        this.images = [];
        this.images.push(this.vendorInfo.FilePath);
        this.khaadSeedVendor.Id = this.vendorInfo.Id;
        console.log(this.vendorInfo)
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
  }

  hasError(controlName: string, errorName: string): boolean {
    //;
    return this.vendorForm.controls[controlName].hasError(errorName);
  }

  //Form Function
  createForm(){
    this.vendorForm = this.fb.group({
      ZoneId:[null],
      BranchCode:[null],
      CircleId: [null, Validators.required],
      Type: [null, Validators.required],
      Name: [null, Validators.required],
      Description: [null, Validators.required],
      File: [null],
      PhoneNumber : [null, Validators.required],
      Location:[null, Validators.required],
      Address: [null, Validators.required]
    })
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }


  Add(){
    this.type = this.vendorForm.controls.Type.value;

    const dialogRef = this.dialog.open(AddressLocationComponent, { width: "1200px", height: "700px",data: { lat: this.lat, lng: this.lng, type:this.type, iconUrl: this.iconUrl}, disableClose: true });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      console.log(res)
      this.lat = res.lat
      this.lng = res.lng
      this.iconUrl = res.iconUrl
      var loc = this.lat+" , "+this.lng;
      this.loc_text = "Update Location"
      this.vendorForm.controls["Location"].setValue(loc);
    });
  }

  //File Event

  onFileChange(event) {

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      var file = event.target.files[0];

      var Name = file.name.split('.').pop();
      if (Name != undefined) {
        if (Name.toLowerCase() == "jpg" || Name.toLowerCase() == "png" || Name.toLowerCase() == "jpeg") {

          for (let i = 0; i < filesAmount; i++) {

            this.images = [];
            var reader = new FileReader();

            reader.onload = (event: any) => {
              ;
              this.images = [];
              this.fileExist = true;
              this.images.push(event.target.result);

              this.file = file;
              this.vendorForm.patchValue({
                fileSource: this.images
              });
            }
            reader.readAsDataURL(event.target.files[i]);
          }
          this.cdRef.detectChanges();
        }
        else {
          this.layoutUtilsService.alertElement("Only jpeg, png, jpg files are allowed", "Only jpeg, png, jpg files are allowed", "99");

          event.srcElement.value = null;

          return;
        }
      }

    }
  }


  //Save & Submit Method
  saveSubmit() {

    console.log(this.vendorForm.controls)
    this.errorShow = false;
    this.hasFormErrors = false;
    if (this.vendorForm.invalid) {
      const controls = this.vendorForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hasFormErrors = true;
      return;
    }

    // if(this.file == null){
    //   this.layoutUtilsService.alertElement("", "Please attach an Image in Png, Jpg or Jpeg format");
    //   return
    // }


    this.khaadSeedVendor = Object.assign(this.khaadSeedVendor, this.vendorForm.value);
    this.khaadSeedVendor.Lat = this.lat;
    this.khaadSeedVendor.Lng = this.lng

    this.spinner.show();
    this._khaadSeedVendor.addNewVendor(this.khaadSeedVendor, this.file)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      if(baseResponse.Success === true){
        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
        console.log(baseResponse)
        this.vendorDetail = baseResponse.SeedKhadVendor.VendorDetail;
        this.router.navigateByUrl('khaad-seed-vendor/view-list')
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })

  }

  deleteVendor(){
    this.vendor.Id = this.khaadSeedVendor.Id;


    this.spinner.show();
    this._khaadSeedVendor.deleteVendor(this.vendor, this.user)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      if(baseResponse.Success === true){
        //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
        this.router.navigateByUrl('khaad-seed-vendor/view-list')
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
  }

  preview(){

    if(this.file != null || this.vendorInfo != null){
      const dialogRef = this.dialog.open(ViewFileComponent, {
        width: '90%',
        height: '90%',
        data: { url: this.images }
      });
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
        this.navigationSubscription.unsubscribe();
    }
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
        this.disable_circle = false;
    });
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

}
