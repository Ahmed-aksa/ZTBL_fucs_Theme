/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no- */
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
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { Branch } from 'app/shared/models/branch.model';
import { Zone } from 'app/shared/models/zone.model';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { CircleService } from 'app/shared/services/circle.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LovService } from 'app/shared/services/lov.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { VendorDetail } from '../class/vendor-detail';
import { KhaadSeedVendorService } from '../service/khaad-seed-vendor.service';
import { UserInfoDialogComponent } from './user-info-dialog/user-info-dialog.component';

@Component({
  selector: 'app-vendor-radius',
  templateUrl: './vendor-radius.component.html',
  styleUrls: ['./vendor-radius.component.scss']
})

export class VendorRadiusComponent implements OnInit {

  loading: boolean;
  getRadius: any;
  radiusInfo: any;
  ///////////////////
  lat = 30.375321;
  lng = 69.345116;
  zoom: number = 2;
  selectedArea = 0;
  fenceMarkers: any = [];
  vendorLocationMarker : any;
  //fenceLoacations: any;
  googleMap: any;
  selectedMarker: any = null;
  previousInfoWindow: any;
  vendorLov : any;

  controlOptions = {
    mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"]
  }
  ///////////////////
  iconUrl;

  radiusInitial : string;
  typeInitial : string;
  showViewAllBtn: boolean;
  Radius: any;
  public LovCall = new Lov();
  public vendor = new VendorDetail();

  radiusForm : FormGroup;

  selected_b;
  selected_z;
  selected_c;
  loaded = false;
  disable_circle = true;
  disable_zone = true;
  disable_branch = true;
  single_branch = true;
  single_circle = true;
  single_zone = true;

  Zones: any = [];
  SelectedZones: any = [];
  public Zone = new Zone();

  //Branch inventory
  Branches: any = [];
  SelectedBranches: any = [];
  public Branch = new Branch();

  user: any = {}
  //Circle inventory
  Circles: any = [];
  SelectedCircles: any = [];
  LoggedInUserInfo:BaseResponseModel;

  constructor(
    private _circleService: CircleService,
    private _khaadSeedVendor: KhaadSeedVendorService,
    private layoutUtilsService: LayoutUtilsService,
    private _cdf: ChangeDetectorRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private _lovService: LovService
  ) {}

  countryRestriction = {
    latLngBounds: {
      north: 37.084107,
      east: 77.823171,
      south: 23.6345,
      west: 60.872972
    },
    strictBounds: true
  };



  ngOnInit() {

    this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle()
    this.zoom = 0;

    this.createForm();
    this.GetRadius();
    //this.VendorName.setValue("Binod")


    if (this.LoggedInUserInfo.Zone != null) {

      this.Zone = this.LoggedInUserInfo.Zone;
      this.SelectedZones = this.Zone;
      this.selected_z = this.SelectedZones.ZoneId
      this.radiusForm.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
    }

    if (this.LoggedInUserInfo.Branch != null) {
      this.Branches = this.LoggedInUserInfo.Branch;
      this.SelectedBranches = this.Branches;
      this.selected_b = this.SelectedBranches.BranchCode
      this.radiusForm.controls["BranchCode"].setValue(this.SelectedBranches.Name);
    }

    if (this.LoggedInUserInfo.UserCircleMappings != null) {
      this.disable_circle = false
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;
    }
    else if(!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.UserCircleMappings){
      
      this.Zone = this.LoggedInUserInfo.Zone;
      this.SelectedZones = this.Zone;
      this.disable_zone=true;
      this.radiusForm.controls["ZoneId"].setValue(this.SelectedZones?.Id);

      

      this.selected_z = this.SelectedZones?.ZoneId
      this.changeZone(this.selected_z);
    }
    else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
        this.spinner.show();

        this.userUtilsService.getZone().subscribe((data: any) => {
            this.Zone = data.Zones;
            this.SelectedZones = this.Zone;
            this.single_zone = false;
            this.disable_zone = false;
            this.spinner.hide();

        });}


  }

  // ngAfterViewInit() {
  //
  //   }
  createForm(){
    this.radiusForm = this.fb.group({
      ZoneId:[null],
      BranchCode: [null],
      CircleId: [null],
      Radius: [null],
      Type: [null],
      Name: [null]
    })
  }


  async GetRadius(){

    this.Radius = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.FindVendorRadius });
    this.Radius = this.Radius.LOVs;

    this.radiusForm.controls["Radius"].setValue(this.Radius ? this.Radius[0].Value : "")
    this.getRadius = this.radiusForm.controls.Radius.value;

    this.vendorLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.VendorTypes });

    var fi : any = []
    fi.Value = "null";
    fi.Name = "All";
    fi.LovId = "0"
    fi.TagName="0";
    this.vendorLov.LOVs.splice(0, 0, fi)
    this.vendorLov = this.vendorLov.LOVs;
    this.radiusForm.controls["Type"].setValue(this.vendorLov ? this.vendorLov[0].Value : "")
    this.typeInitial = this.vendorLov ? this.vendorLov[0].Value : "";

    console.log(this.Radius)
    console.log(this.vendorLov)
      this.onSelect();
  }

  selectRadius(radius){
    this.getRadius = radius.value;
  }

  selectType(type){
    this.radiusForm.controls["Type"].setValue(type.value);
  }

  onSelect(){
    this.spinner.show();

    this.user.ZoneId = this.radiusForm.controls.ZoneId.value;
    this.user.CircleId = this.radiusForm.controls.CircleId.value;
    if(this.user.CircleId == ""){
      this.user.CircleId = null
    }
    this.user.BranchCode = this.radiusForm.controls.BranchCode.value;

    this.vendor.Name = this.radiusForm.controls.Name.value;
    this.vendor.Radius = this.getRadius;
    this.vendor.Type = this.radiusForm.controls.Type.value;

    this._khaadSeedVendor.searchRadius(this.vendor,this.user)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{

      //var lat,lng,name;
      if(baseResponse.Success === true){
        console.log(baseResponse)
        this.radiusInfo = baseResponse.SeedKhadVendor.VendorDetails;
        console.log(this.radiusInfo)
        for(let i=0; i<this.radiusInfo.length; i++){
          if(this.radiusInfo[i].Type == '1'){
            this.iconUrl = '../../../assets/icons/seed.png';
            this.radiusInfo[i].iconUrl = this.iconUrl;
          }
          else if(this.radiusInfo[i].Type == '2'){
            this.iconUrl = '../../../assets/icons/fertilizer_icon.png';
            this.radiusInfo[i].iconUrl = this.iconUrl;
          }
          else if(this.radiusInfo[i].Type == '3'){
            this.iconUrl = '../../../assets/icons/seed and fertilizer_icon.png';
            this.radiusInfo[i].iconUrl = this.iconUrl;
          }
        }
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
  }

  // addMarker(lat, lng, name){
  //
  //   var myLatLng = { lat: Number(lat), lng: Number(lng) };
  //   this.vendorLocationMarker = new google.maps.Marker({
  //     position: myLatLng,
  //     title: name,
  //   });
  //   this.vendorLocationMarker.setMap(this.googleMap)
  // }

  getTitle(): string {
    return 'View Circle Fense';
  }


  ///////////////////Os Change Set Map
  onMapReady(map) {
    this.googleMap = map;
    //this.setCurrentLocation()
  }


  clickedMarker(event ,index , infowindow) {

    console.log(index)
    const dialogRef = this.dialog.open(UserInfoDialogComponent, {
      width: '600px',
      height: '600px',
      data: { id: this.radiusInfo[index].Id, circleId: this.radiusInfo[index].CircleId, zoneId: this.radiusInfo[index].ZoneId, branchCode: this.radiusInfo[index].BranchCode},
      disableClose: true
    });

    this.previousInfoWindow = infowindow;
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
        fi.CircleCode = "All";
        fi.LovId = "0";
        fi.TagName="0";
        this.SelectedCircles.splice(0, 0, fi)
        this.disable_circle = false;
    });
}

    changeZone(changedValue) {
      let changedZone=null;
      if(changedValue?.value)
      {
       changedZone = {Zone: {ZoneId: changedValue.value}}
      }
      else
      {
         changedZone = {Zone: {ZoneId: changedValue}}
  
      }
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }



}
