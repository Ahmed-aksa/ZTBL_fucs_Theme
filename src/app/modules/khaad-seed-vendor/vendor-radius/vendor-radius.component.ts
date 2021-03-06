import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {MapsAPILoader} from '@agm/core';
import {CircleService} from 'app/shared/services/circle.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {VendorDetail} from '../class/vendor-detail';
import {KhaadSeedVendorService} from '../service/khaad-seed-vendor.service';
import {UserInfoDialogComponent} from './user-info-dialog/user-info-dialog.component';

@Component({
    selector: 'app-vendor-radius',
    templateUrl: './vendor-radius.component.html',
    styleUrls: ['./vendor-radius.component.scss']
})

export class VendorRadiusComponent implements OnInit {
    zone: any;
    branch: any;
    circle: any;
    loading: boolean;
    getRadius: any;
    radiusInfo: any;
    ///////////////////
    lat = 30.375321;
    lng = 69.345116;
    zoom: number = 2;
    googleMap: any;
    selectedMarker: any = null;
    previousInfoWindow: any;
    vendorLov: any;

    controlOptions = {
        mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"]
    }
    iconUrl;

    radiusInitial: string;
    typeInitial: string;
    showViewAllBtn: boolean;
    Radius: any;
    public LovCall = new Lov();
    public vendor = new VendorDetail();

    radiusForm: FormGroup;

    LoggedInUserInfo: BaseResponseModel;
    countryRestriction = {
        latLngBounds: {
            north: 37.084107,
            east: 77.823171,
            south: 23.6345,
            west: 60.872972
        },
        strictBounds: true
    };

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
    ) {
    }

    ngOnInit() {

        this.zoom = 0;

        this.createForm();
        this.GetRadius();
        //this.VendorName.setValue("Binod")


    }

    // ngAfterViewInit() {
    //
    //   }
    createForm() {
        this.radiusForm = this.fb.group({
            Radius: [null],
            Type: [null],
            Name: [null]
        })
    }


    async GetRadius() {

        this.Radius = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.FindVendorRadius});
        this.Radius = this.Radius.LOVs;

        this.radiusForm.controls["Radius"].setValue(this.Radius ? this.Radius[0].Value : "")
        this.getRadius = this.radiusForm.controls.Radius.value;

        this.vendorLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.VendorTypes});

        var fi: any = []
        fi.Value = "null";
        fi.Name = "All";
        fi.LovId = "0"
        fi.TagName = "0";
        this.vendorLov.LOVs.splice(0, 0, fi)
        this.vendorLov = this.vendorLov.LOVs;
        this.radiusForm.controls["Type"].setValue(this.vendorLov ? this.vendorLov[0].Value : "")
        this.typeInitial = this.vendorLov ? this.vendorLov[0].Value : "";
    }

    selectRadius(radius) {
        this.getRadius = radius.value;
    }

    selectType(type) {
        this.radiusForm.controls["Type"].setValue(type.value);
    }

    onSelect() {
        this.spinner.show();

        this.vendor.Name = this.radiusForm.controls.Name.value;
        this.vendor.Radius = this.getRadius;
        this.vendor.Type = this.radiusForm.controls.Type.value;

        if (this.vendor.Type == "null" || this.vendor.Type == undefined) {
            this.vendor.Type = null;
        }

        this._khaadSeedVendor.searchRadius(this.vendor, this.zone, this.branch, this.circle)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                //var lat,lng,name;
                if (baseResponse.Success === true) {

                    this.radiusInfo = baseResponse.SeedKhadVendor.VendorDetails;

                    for (let i = 0; i < this.radiusInfo.length; i++) {
                        if (this.radiusInfo[i].Type == '1') {
                            this.iconUrl = '../../../assets/icons/seed.png';
                            this.radiusInfo[i].iconUrl = this.iconUrl;
                        } else if (this.radiusInfo[i].Type == '2') {
                            this.iconUrl = '../../../assets/icons/fertilizer_icon.png';
                            this.radiusInfo[i].iconUrl = this.iconUrl;
                        } else if (this.radiusInfo[i].Type == '3') {
                            this.iconUrl = '../../../assets/icons/seed and fertilizer_icon.png';
                            this.radiusInfo[i].iconUrl = this.iconUrl;
                        }
                    }
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }

    getTitle(): string {
        return 'View Circle Fence';
    }


    ///////////////////Os Change Set Map
    onMapReady(map) {
        this.googleMap = map;
        //this.setCurrentLocation()
    }


    clickedMarker(event, index, infowindow) {
        const dialogRef = this.dialog.open(UserInfoDialogComponent, {
            width: '600px',
            height: '600px',
            data: {
                id: this.radiusInfo[index].Id,
                circleId: this.radiusInfo[index].CircleId,
                zoneId: this.radiusInfo[index].ZoneId,
                branchCode: this.radiusInfo[index].BranchCode
            },
            disableClose: true
        });

        this.previousInfoWindow = infowindow;
    }


    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;

    }
}
