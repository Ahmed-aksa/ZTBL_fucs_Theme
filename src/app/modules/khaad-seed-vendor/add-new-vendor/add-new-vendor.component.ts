/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
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
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {ViewFileComponent} from 'app/shared/component/view-file/view-file.component';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {Branch} from 'app/shared/models/branch.model';
import {Circle} from 'app/shared/models/circle.model';
import {Zone} from 'app/shared/models/zone.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {KhaadSeedVendor} from '../class/khaad-seed-vendor';
import {VendorDetail} from '../class/vendor-detail';
import {KhaadSeedVendorService} from '../service/khaad-seed-vendor.service';
import {AddressLocationComponent} from './address-location/address-location.component';

@Component({
    selector: 'app-add-new-vendor',
    templateUrl: './add-new-vendor.component.html',
    styleUrls: ['./add-new-vendor.component.scss']
})
export class AddNewVendorComponent implements OnInit, OnDestroy {
    //Objects
    vendorForm: FormGroup;
    VendorAttachedFile = [];
    vendorLov: any;
    images = [];
    ProfileImageSrc: string = "";
    file: File = null;
    rawData: any = {};
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
    LoggedInUserInfo: BaseResponseModel;

    navigationSubscription: any;

    fileExist = false;

    prev_map;

    up;
    lat;
    lng;
    type;
    iconUrl;

    user: any = {};

    hasFormErrors = false;
    errorShow = false;

    branch: any
    circle: any
    zone: any

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
    onChange(val) {
        this.khaadSeedVendor.CircleId = val;
    }

    ngOnInit() {


        this.images.push(this.ProfileImageSrc);
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();


        var upFlag = this.activatedRoute.snapshot.params['upFlag'];

        this.isEditMode = localStorage.getItem("EditVendorData");

        if (this.isEditMode != null && this.isEditMode != "0") {
            this.vendorEditView = JSON.parse(localStorage.getItem("SearchVendorData"));

            if (this.vendorEditView != null) {
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
            } else {
                this.viewOnly = false;
                this.isEdit = true;
            }

        }


        this.createForm();
        this.typeLov();

        //For Edit Mode
        this.up = upFlag
        if (upFlag == "1" && this.isEditMode == "1") {

            localStorage.setItem('EditVendorData', '0');
            this.spinner.show();
            setTimeout(() => this.getVendorInfo(), 2000);
            // this.getVendorInfo();
        }

    }

    //Getting Lov's

    async typeLov() {
        this.vendorLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.VendorTypes});
        this.vendorLov = this.vendorLov.LOVs;
    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle;
    }

    getVendorInfo() {
        this.spinner.show();
        this.user.ZoneId = this.zone?.ZoneId;
        this.user.BranchCode = this.branch?.BranchCode;
        this.user.CircleId = this.circle?.Id;
        this.vendor.Id = this.vendorEditView.Id;

        var limit = 1, offset = 0;

        this._khaadSeedVendor.searchVendors(limit, offset, this.vendor, this.user, this.zone, this.branch, this.circle)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {


                    this.fileExist = true;
                    this.vendorInfo = baseResponse.SeedKhadVendor.VendorDetail;

                    this.vendorForm.controls["BranchCode"].setValue(this.vendorInfo.BranchCode);
                    this.vendorForm.controls["ZoneId"].setValue(this.vendorInfo.ZoneId);
                    this.vendorForm.controls["Name"].setValue(this.vendorInfo.Name);
                    this.vendorForm.controls["Type"].setValue(this.vendorInfo.Type);
                    this.vendorForm.controls["Description"].setValue(this.vendorInfo.Description);
                    this.vendorForm.controls["CircleCode"].setValue(this.vendorInfo.CircleCode);
                    this.khaadSeedVendor.CircleId = this.vendorInfo?.CircleId;

                    this.vendorForm.controls["Location"].setValue(this.vendorInfo.Lat + " , " + this.vendorInfo.Lng);
                    this.lat = this.vendorInfo.Lat;
                    this.lng = this.vendorInfo.Lng;
                    this.vendorForm.controls["PhoneNumber"].setValue(this.vendorInfo.PhoneNumber);
                    this.vendorForm.controls["Address"].setValue(this.vendorInfo.Address);
                    this.vendorForm.controls["File"].setValue(this.vendorInfo.FilePath);
                    //this.onFileChange(this.vendorInfo.FilePath);

                    if (this.vendorForm.controls.Location != undefined || this.vendorForm.controls.Location != null) {
                        this.loc_text = "Update Location"
                    }

                    this.images = [];
                    this.images.push(this.vendorInfo.FilePath);
                    this.khaadSeedVendor.Id = this.vendorInfo.Id;
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }

    hasError(controlName: string, errorName: string): boolean {
        //;
        return this.vendorForm.controls[controlName].hasError(errorName);
    }

    //Form Function
    createForm() {
        this.vendorForm = this.fb.group({
            ZoneId: [null],
            BranchCode: [null],
            CircleCode: [null, Validators.required],
            Type: [null, Validators.required],
            Name: [null, Validators.required],
            Description: [null, Validators.required],
            File: [null],
            PhoneNumber: [null, Validators.required],
            Location: [null, Validators.required],
            Address: [null, Validators.required]
        })
    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }


    Add() {
        this.type = this.vendorForm.controls.Type.value;

        const dialogRef = this.dialog.open(AddressLocationComponent, {

            data: {lat: this.lat, lng: this.lng, type: this.type, iconUrl: this.iconUrl},
            disableClose: true, panelClass: ['h-screen','max-w-full','max-h-full','w-full','h-full']
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            }
            this.lat = res.lat
            this.lng = res.lng
            this.iconUrl = res.iconUrl
            var loc = this.lat + " , " + this.lng;
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
                } else {
                    this.layoutUtilsService.alertElement("Only jpeg, png, jpg files are allowed", "Only jpeg, png, jpg files are allowed", "99");

                    event.srcElement.value = null;

                    return;
                }
            }

        }
    }


    //Save & Submit Method
    saveSubmit() {

        //console.log(this.vendorForm)
        this.vendorForm.controls["CircleCode"].setValue(this.circle?.CircleCode)
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
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                    this.vendorDetail = baseResponse.SeedKhadVendor.VendorDetail;
                    this.router.navigateByUrl('khaad-seed-vendor/view-list')
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }

    deleteVendor() {
        this.vendor.Id = this.khaadSeedVendor.Id;


        this.spinner.show();
        this._khaadSeedVendor.deleteVendor(this.vendor, this.user)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                    this.router.navigateByUrl('khaad-seed-vendor/view-list')
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }

    preview() {

        if (this.file != null || this.vendorInfo != null) {
            const dialogRef = this.dialog.open(ViewFileComponent, {
                width: '90%',
                height: '90%',
                data: {url: this.images}
            });
        }
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }


}
