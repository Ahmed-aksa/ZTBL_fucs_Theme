import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LandChargeCreation} from '../models/land_charge_creation.model';
import {LovService} from "../../../shared/services/lov.service";
import {NgxSpinnerService} from "ngx-spinner";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Store} from "@ngrx/store";
import {CommonService} from "../../../shared/services/common.service";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {AppState} from "../../../shared/reducers";
import {finalize, takeUntil} from "rxjs/operators";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {ChildLov, DateFormats, Lov, LovConfigurationKey} from "../../../shared/classes/lov.class";
import {Subject} from "rxjs";
import {DatePipe} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LandService} from "../services/land.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreateCustomer} from "../../../shared/models/customer.model";
import {Activity} from "../../../shared/models/activity.model";
import {LandChargeCreationDetails} from "../models/land_charge_creation_detail";
import {LandInfo} from 'app/shared/models/land-info.model';
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";

@Component({
    selector: 'app-land-charge-creation',
    templateUrl: './land-charge-creation.component.html',
    styleUrls: ['./land-charge-creation.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class LandChargeCreationComponent implements OnInit {
    submitted = false;
    LandInformationForm: FormGroup;
    hasFormErrors = false;
    errorShow: boolean;
    TrainId: number;
    public landChargeCreation = new LandChargeCreation();

    public landChargeCreationDetail = new LandChargeCreationDetails();

    public landChargeCreationDetails: LandChargeCreationDetails[] = [];
    public landChargeCreationDetailsLis: any;

    public LandInfo = new LandInfo();

    public createCustomer = new CreateCustomer();
    public request = new BaseRequestModel();
    public activity = new Activity();

    public LovCall = new Lov();
    public ChildLovCall = new ChildLov();

    public DistrictLov: any;
    public DistrictLovFull: any;

    public ProvinceLov: any;
    public ProvinceLovFull: any;

    public TehsilLov: any;
    public TehsilLovFull: any;

    public errorMessage: any;
    public BranchLov: any;
    public ZoneLov: any;
    Unit: string;
    Area: number;
    ConvertUnit: string;
    Result: number;
    isFormReadonly: boolean;
    DistrictLovData: any;
    DistrictLovDataSelected: any;
    TehsilLovData: any;
    TehsilLovDataSelected: any;
    NamePattern = '[a-zA-Z0-9]*';

    loggedInUserInfo: any;

    private _onDestroy = new Subject<void>();

    UnitConverter = [{id: "1", name: "Kanal"}, {id: "2", name: "Acre"}, {id: "3", name: "Gunta"}]
    UnitConverterd = [{id: "1", name: "Marla"}]

    public searchFilterCtrlProvince: FormControl = new FormControl();
    public searchFilterCtrlDistrict: FormControl = new FormControl();
    public searchFilterCtrlTehsil: FormControl = new FormControl();

    constructor(
        public dialogRef: MatDialogRef<LandChargeCreationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private _snackBar: MatSnackBar,
        private _lovService: LovService,
        private _landService: LandService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userUtilsService: UserUtilsService,
        private cdRef: ChangeDetectorRef,
        private datePipe: DatePipe,
        private spinner: NgxSpinnerService,
        private _common: CommonService) {
    }

    dynamicArray: Array<DynamicGrid> = [];
    newDynamic: any = {};


    ngOnInit() {


        this.spinner.show();

        this.loggedInUserInfo = this.userUtilsService.getUserDetails();
        this.ConvertUnit = "1";
        this.isFormReadonly = false;
        ;
        this.LandInfo = this.data.landInfo;
        this.TrainId = this.data.TrainId;
        if (this.data.landChargCreation != null && this.data.landChargCreation != undefined) {
            this.landChargeCreation = this.data.landChargCreation;
        }


        if (this.LandInfo.Status != undefined && this.LandInfo.Status != '') {

            if (this.loggedInUserInfo.User.UserId == this.LandInfo.EnteredBy) {
                if (this.LandInfo.Status == '3' || this.LandInfo.Status == '2') {
                    this.isFormReadonly = true;
                }
            } else {
                this.isFormReadonly = true;
            }


        }

        this.landChargeCreationDetailsLis = this.data.landChargeCreationDetails;

        this.landChargeCreationDetails = this.landChargeCreationDetailsLis;

        if (this.landChargeCreationDetailsLis != null && this.landChargeCreationDetailsLis != undefined) {
            if (this.landChargeCreationDetailsLis.length > 0) {

                for (var i = 0; i < this.landChargeCreationDetailsLis.length; i++) {

                    this.newDynamic = {
                        khata: this.landChargeCreationDetailsLis[i].KhewatNumber,
                        Khatooni: this.landChargeCreationDetailsLis[i].KhatooniNumber,
                        Khasra: this.landChargeCreationDetailsLis[i].KhasraNumber,
                        TotalAreaOfKhewat: this.landChargeCreationDetailsLis[i].TotalArea,
                        LegalShare: this.landChargeCreationDetailsLis[i].LegalShare,
                        Share1: this.landChargeCreationDetailsLis[i].LegalDivisor,
                        Share2: this.landChargeCreationDetailsLis[i].LegalDivider,
                        AreaAccordingToShare: this.landChargeCreationDetailsLis[i].AreaAsperShare,
                        CCDetailsID: this.landChargeCreationDetailsLis[i].CCDetailId
                    };
                    this.dynamicArray.push(this.newDynamic);
                }

            } else {
                this.newDynamic = {
                    khata: "",
                    Khatooni: "",
                    Khasra: "",
                    TotalAreaOfKhewat: "",
                    LegalShare: "",
                    Share1: "",
                    Share2: "",
                    AreaAccordingToShare: 0,
                    CCDetailsID: 0
                };
                this.dynamicArray.push(this.newDynamic);
            }
        } else {

            this.newDynamic = {
                khata: "",
                Khatooni: "",
                Khasra: "",
                TotalAreaOfKhewat: "",
                LegalShare: "",
                Share1: "",
                Share2: "",
                AreaAccordingToShare: 0,
                CCDetailsID: 0
            };
            this.dynamicArray.push(this.newDynamic);
        }

        this.LoadLovs();
        this.createForm();

        this.landChargeCreation.TotalArea = this.LandInfo.TotalArea;
        //this.landChargeCreation.LegalDocNo = this.LandInfo.PassbookNO;


        this.LandInformationForm.controls['TotalArea'].setValue(this.LandInfo.TotalOwnedAreaForChargeCreation);
        this.LandInformationForm.controls['PassbookNO'].setValue(this.LandInfo.PassbookNO);
        //this.LandInformationForm.controls['ReferenceNo'].setValue(this.landChargeCreation.LegalDocNo);
        this.LandInformationForm.controls['LegalDocNo'].setValue(this.landChargeCreation.LegalDocNo);
        this.LandInformationForm.controls['Province'].setValue(this.landChargeCreation.Province);
        if (this.landChargeCreation.Province != null) {
            this.GetDistrictsEdit(this.landChargeCreation.Province)
        }
        this.LandInformationForm.controls['District'].setValue(this.landChargeCreation.District);

        if (this.landChargeCreation.District != null) {
            this.GetTehsilsEdit(this.landChargeCreation.District)
        }

        this.LandInformationForm.controls['Tehsil'].setValue(this.landChargeCreation.Tehsil);
        this.LandInformationForm.controls['Village'].setValue(this.landChargeCreation.Village);
        this.LandInformationForm.controls['Remarks'].setValue(this.landChargeCreation.Remarks);


        this.searchFilterCtrlProvince.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterProvince();
            });

        this.searchFilterCtrlDistrict.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {

                this.filterDistrict();
            });

        this.searchFilterCtrlTehsil.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterTehsil();
            });

        this.spinner.hide();
    }


    private filterProvince() {


        // get the search keyword
        let search = this.searchFilterCtrlProvince.value;

        this.ProvinceLov.LOVs = this.ProvinceLovFull.LOVs;

        if (!search) {
            //this.DistrictLov.LOVs.next(this.DistrictLov.LOVs.slice());

            this.ProvinceLov.LOVs = this.ProvinceLovFull.LOVs;

        } else {
            search = search.toLowerCase();
            this.ProvinceLov.LOVs = this.ProvinceLov.LOVs.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
        }

    }

    private filterDistrict() {

        // get the search keyword
        let search = this.searchFilterCtrlDistrict.value;
        this.DistrictLov.LOVs = this.DistrictLovFull.LOVs;

        if (!search) {
            //this.DistrictLov.LOVs.next(this.DistrictLov.LOVs.slice());

            this.DistrictLov.LOVs = this.DistrictLovFull.LOVs;

        } else {
            search = search.toLowerCase();
            this.DistrictLov.LOVs = this.DistrictLov.LOVs.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
        }

    }

    private filterTehsil() {

        // get the search keyword
        let search = this.searchFilterCtrlTehsil.value;
        this.TehsilLov.LOVs = this.TehsilLovFull.LOVs;

        if (!search) {
            //this.DistrictLov.LOVs.next(this.DistrictLov.LOVs.slice());

            this.TehsilLov.LOVs = this.TehsilLovFull.LOVs;

        } else {
            search = search.toLowerCase();
            this.TehsilLov.LOVs = this.TehsilLov.LOVs.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
        }

    }

    searchDist(circleId) {
        circleId = circleId.toLowerCase();
        if (circleId != null && circleId != undefined && circleId != "")
            this.DistrictLovDataSelected = this.DistrictLovData.filter(x => x.Name.toLowerCase().indexOf(circleId) > -1);
        else
            this.DistrictLovDataSelected = this.DistrictLovData;
    }

    validateDistOnFocusOut() {
        if (this.DistrictLovDataSelected?.length == 0)
            this.DistrictLovDataSelected = this.DistrictLovData;
    }

    searchTehsil(circleId) {
        debugger
        circleId = circleId.toLowerCase();
        if (circleId != null && circleId != undefined && circleId != "")
            this.TehsilLovDataSelected = this.TehsilLovData.filter(x => x.Name.toLowerCase().indexOf(circleId) > -1);
        else
            this.TehsilLovDataSelected = this.TehsilLovData;
    }

    validateTehsilOnFocusOut() {
        if (this.TehsilLovDataSelected?.length == 0)
            this.TehsilLovDataSelected = this.TehsilLovData;
    }

    keyUpValidate(event: any) {

        var term = "sample1";
        var re = new RegExp("^([a-z0-9]{5,})$");
        if (re.test(term)) {

        } else {

        }
    }


    AreaConverter() {

        if (this.Area != undefined) {
            if (this.Unit == "1" && this.ConvertUnit == "1") {
                this.Result = this.Area * 20;
            }

            if (this.Unit == "2" && this.ConvertUnit == "1") {
                this.Result = this.Area * 160;
            }
            if (this.Unit == "3" && this.ConvertUnit == "1") {
                this.Result = this.Area * 4;
            }

        }
        this.cdRef.detectChanges();
    }

    createForm() {

        var userInfo = this.userUtilsService.getUserDetails();
        this.BranchLov = userInfo.Branch;
        this.ZoneLov = userInfo.Zone;

        this.LandInformationForm = this.formBuilder.group({
            TotalArea: [this.landChargeCreation.TotalArea],
            PassbookNO: [this.landChargeCreation.PassbookNO, [Validators.required]],
            LegalDocNo: [this.landChargeCreation.LegalDocNo],
            District: [this.landChargeCreation.District, [Validators.required]],
            Tehsil: [this.landChargeCreation.Tehsil, [Validators.required]],
            Province: [this.landChargeCreation.Province, [Validators.required]],
            Village: [this.landChargeCreation.Village, [Validators.required]],
            Remarks: [this.landChargeCreation.Remarks],

        });


    }


    getTitle(): string {

        return "Land Charge Creation Information"
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.LandInformationForm.controls[controlName].hasError(errorName);
    }

    async GetDistricts(Id) {


        this.DistrictLov = await this._lovService.CallChildLovAPI(this.ChildLovCall = {
            TagName: LovConfigurationKey.DistrictProvince,
            ParentId: Id.value
        })


        this.DistrictLov.LOVs = this._lovService.SortLovs(this.DistrictLov.LOVs);
        this.DistrictLovData = this.DistrictLov.LOVs;
        this.DistrictLovDataSelected = this.DistrictLovData;
        this.TehsilLov = [];
    }

    async GetDistrictsEdit(Id) {


        this.DistrictLov = await this._lovService.CallChildLovAPI(this.ChildLovCall = {
            TagName: LovConfigurationKey.DistrictProvince,
            ParentId: Id
        })


        this.DistrictLov.LOVs = this._lovService.SortLovs(this.DistrictLov.LOVs);
        this.DistrictLovData = this.DistrictLov.LOVs;
        this.DistrictLovDataSelected = this.DistrictLovData;
        this.TehsilLov = [];
    }


    async GetTehsils(Id) {


        this.TehsilLov = await this._lovService.CallChildLovAPI(this.ChildLovCall = {
            TagName: LovConfigurationKey.Tehsil,
            ParentId: Id.value
        })


        this.TehsilLov.LOVs = this._lovService.SortLovs(this.TehsilLov.LOVs);
        this.TehsilLovData = this.TehsilLov.LOVs;
        this.TehsilLovDataSelected = this.TehsilLovData;
    }

    async GetTehsilsEdit(Id) {


        this.TehsilLov = await this._lovService.CallChildLovAPI(this.ChildLovCall = {
            TagName: LovConfigurationKey.Tehsil,
            ParentId: Id
        })


        this.TehsilLov.LOVs = this._lovService.SortLovs(this.TehsilLov.LOVs);
        this.TehsilLovData = this.TehsilLov.LOVs;
        this.TehsilLovDataSelected = this.TehsilLovData;
    }

    async LoadLovs() {

        //this.ngxService.start();


        //this.DistrictLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.District })
        //this.DistrictLovFull = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.District })

        this.ProvinceLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Province})

        this.ProvinceLovFull = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Province})

        //this.TehsilLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Tehsil })
        //this.TehsilLovFull = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Tehsil })


        //this.DistrictLov.LOVs = this._lovService.SortLovs(this.DistrictLov.LOVs);
        //this.DistrictLovFull.LOVs = this._lovService.SortLovs(this.DistrictLovFull.LOVs);

        this.ProvinceLov.LOVs = this._lovService.SortLovs(this.ProvinceLov.LOVs);

        this.ProvinceLovFull.LOVs = this._lovService.SortLovs(this.ProvinceLovFull.LOVs);

        //this.TehsilLov.LOVs = this._lovService.SortLovs(this.TehsilLov.LOVs);
        //this.TehsilLovFull.LOVs = this._lovService.SortLovs(this.TehsilLovFull.LOVs);


        var userInfo = this.userUtilsService.getUserDetails();
        this.BranchLov = userInfo.Branch;
        this.ZoneLov = userInfo.Zone;

    }


    addRow() {
        this.newDynamic = {
            khata: "",
            Khatooni: "",
            Khasra: "",
            TotalAreaOfKhewat: "",
            LegalShare: "",
            Share1: "",
            Share2: "",
            AreaAccordingToShare: "",
            CCDetailsID: 0
        };
        this.dynamicArray.push(this.newDynamic);
        //this.toastr.success('New row added successfully', 'New Row');

        return true;
    }

    deleteRow(index) {


        if (this.dynamicArray[index].CCDetailsID != 0 && this.dynamicArray[index].CCDetailsID != undefined) {

            //this.landChargeCreation.ChargeCreationID = this.dynamicArray[index].CCDetailsID;
            //this.deleteLandChargeCreationDetails(this.dynamicArray[index].CCDetailsID);
            this.dynamicArray.splice(index, 1);
        } else {

            this.dynamicArray.splice(index, 1);
        }
        //this.toastr.warning('Row deleted successfully', 'Delete row');
        return true;
    }

    onKeyInputCalculateValue(event: any, index) {

        var value1 = this.dynamicArray[index].Share1;
        var value2 = this.dynamicArray[index].Share2;
        this.dynamicArray[index].LegalShare = value1 / value2;

        this.dynamicArray[index].LegalShare = Math.round(this.dynamicArray[index].LegalShare * 100) / 100;

        var totalAreaOfKhwat = this.dynamicArray[index].TotalAreaOfKhewat;

        var legalShare = this.dynamicArray[index].LegalShare;

        //var legalShare = Math.round(this.dynamicArray[index].LegalShare * 100) / 100;
        this.dynamicArray[index].AreaAccordingToShare = totalAreaOfKhwat * legalShare;

        this.dynamicArray[index].AreaAccordingToShare = Math.round(this.dynamicArray[index].AreaAccordingToShare * 100) / 100;

    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }


    saveLandChargeCreationDetails() {


        this.errorMessage = "";

        this.landChargeCreationDetails = [];
        this.errorShow = false;
        this.hasFormErrors = false;
        if (this.LandInformationForm.invalid) {
            const controls = this.LandInformationForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }

        this.landChargeCreation = Object.assign(this.landChargeCreation, this.LandInformationForm.getRawValue());


        if (this.landChargeCreation.Remarks == null) {

            this.landChargeCreation.Remarks = "";
        }
        this.landChargeCreation.LandInfoID = this.LandInfo.Id.toString();
        this.landChargeCreation.BranchId = this.BranchLov.BranchId;
        this.landChargeCreation.IsActive = 'Y';
        this.landChargeCreation.UserID = this.LandInfo.UserId;


        for (var i = 0; i < this.dynamicArray.length; i++) {

            if (this.dynamicArray[i].AreaAccordingToShare.toString() == "" || this.dynamicArray[i].khata == "" || this.dynamicArray[i].Khatooni == "" || this.dynamicArray[i].Share1.toString() == "" || this.dynamicArray[i].Share2.toString() == "") {


                this.layoutUtilsService.alertElement("", "Required fields cannot save null values", "99");
                return
            }

        }


        for (var i = 0; i < this.dynamicArray.length; i++) {
            var res = this.validateNumber(this.dynamicArray[i].khata);

            if (!res) {
                this.layoutUtilsService.alertElement("", "Khata field data is not proper format", "99");
                return
            }

            var res1 = this.validateNumber(this.dynamicArray[i].Khatooni);

            if (!res1) {
                this.layoutUtilsService.alertElement("", "Khatooni field data is not proper format ", "99");
                return
            }

        }


        for (var i = 0; i < this.dynamicArray.length; i++) {

            this.landChargeCreationDetail = new LandChargeCreationDetails();

            this.landChargeCreationDetail.AreaAsperShare = this.dynamicArray[i].AreaAccordingToShare.toString();
            this.landChargeCreationDetail.BranchId = this.BranchLov.BranchId;
            this.landChargeCreationDetail.KhasraNumber = this.dynamicArray[i].Khasra;
            this.landChargeCreationDetail.KhatooniNumber = this.dynamicArray[i].Khatooni;
            this.landChargeCreationDetail.KhewatNumber = this.dynamicArray[i].khata;
            this.landChargeCreationDetail.LegalDivisor = this.dynamicArray[i].Share1.toString();
            this.landChargeCreationDetail.LegalDivider = this.dynamicArray[i].Share2.toString();
            this.landChargeCreationDetail.LegalShare = this.dynamicArray[i].LegalShare.toString();
            this.landChargeCreationDetail.Remarks = "";
            this.landChargeCreationDetail.IsActive = "Y";
            this.landChargeCreationDetail.UserID = this.LandInfo.UserId;
            this.landChargeCreationDetail.TotalArea = this.dynamicArray[i].TotalAreaOfKhewat.toString();
            this.landChargeCreationDetail.CCDetailId = this.dynamicArray[i].CCDetailsID;

            this.landChargeCreationDetails.push(this.landChargeCreationDetail);
        }


        for (var i = 0; i < this.landChargeCreationDetails.length; i++) {
            if (this.landChargeCreationDetails[i].KhasraNumber == undefined) {
                this.landChargeCreationDetails[i].KhasraNumber = "";
            }
        }


        var totalArea = 0;
        var enteredArea = parseFloat(this.landChargeCreation.TotalArea);


        for (var i = 0; i < this.landChargeCreationDetails.length; i++) {

            totalArea += parseFloat(this.landChargeCreationDetails[i].AreaAsperShare);
        }


        if (totalArea == 0) {

            //this.errorMessage = "Please enter the land details";
            this.layoutUtilsService.alertMessage("", "Please enter the land details");

            return;
        }

        if (totalArea != enteredArea) {
            //this.errorMessage = "Area of all the Lands must be equal to the entered Area Owned";
            this.layoutUtilsService.alertMessage("", "Area according to share must be equal to total area Owned");
            return
        }

        var userInfo = this.userUtilsService.getUserDetails();
        this.activity.ActivityID = 1;
        this.request = new BaseRequestModel();
        this.request.Branch = this.BranchLov;
        this.request.Zone = this.ZoneLov;
        this.request.Activity = this.activity;
        this.request.User = userInfo.User;
        this.request.TranId = this.TrainId;
        this.request.ChargeCreation = this.landChargeCreation;
        this.request.ChargeCreationDetail = this.landChargeCreationDetails;

        this.spinner.show();
        this._landService
            .SaveChargeCreation(this.request)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {


                if (baseResponse.Success === true) {

                    this.landChargeCreationDetails = baseResponse.ChargeCreationDetailList;
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                    this.onCloseClick();
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });
    }


    validateNumber(value: string): boolean {

        if (value.indexOf("-") == -1 && value.indexOf("/") == -1 && value.indexOf("-/") == -1 && value.indexOf("/-") == -1)
            return true;

        var data = value.split('-');
        if (data.length == 2) {
            if (data[1].length > 0)
                return true;
        }

        var data1 = value.split('/');

        if (data1.length == 2) {
            if (data1[1].length > 0)
                return true;
        }
        var data2 = value.split('-/');

        if (data2.length == 2) {
            if (data2[1].length > 0)
                return true;
        }

        var data3 = value.split('/-');

        if (data3.length == 2) {
            if (data3[1].length > 0)
                return true;
        } else {
            return false;
        }
    }


    deleteLandChargeCreationDetails(ccDetailId) {

        var landChargeCreationObj = new LandChargeCreation();
        landChargeCreationObj.ChargeCreationID = ccDetailId;
        this.spinner.show();
        this._landService.DeleteChargeCreationDetail(landChargeCreationObj)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {


                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });
    }

    onCloseClick(): void {

        this.dialogRef.close({
            data: {
                ChargeCreation: this.landChargeCreation,
                ChargeCreationDetails: this.landChargeCreationDetails
            }
        }); // Keep only this row
    }

}

export class DynamicGrid {

    khata: string;
    Khatooni: string;
    Khasra: string;
    TotalAreaOfKhewat: any;
    LegalShare: any;
    Share1: any;
    Share2: any;
    AreaAccordingToShare: number;
    CCDetailsID: number;
}
