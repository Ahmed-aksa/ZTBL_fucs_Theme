import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {finalize, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {DatePipe} from '@angular/common';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {NgxSpinnerService} from 'ngx-spinner';
import * as moment from 'moment';
import {DateFormats, errorMessages, Lov, LovConfigurationKey, MaskEnum, regExps} from 'app/shared/classes/lov.class';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {Activity} from 'app/shared/models/activity.model';
import {CreateCustomer} from 'app/shared/models/customer.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {CustomerService} from 'app/shared/services/customer.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {CommonService} from 'app/shared/services/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {SubmitDocumentsComponent} from "../submit-documents/submit-documents.component";
import {ViewFileComponent} from "../../loan-utilization/view-file/view-file.component";
import {EncryptDecryptService} from "../../../shared/services/encrypt_decrypt.service";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'kt-customer-profile',
    templateUrl: './customer-profile.component.html',
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class CustomerProfileComponent implements OnInit {
    saving = false;
    submitted = false;
    roleForm: FormGroup;
    isGenderDisabled = false;
    hasFormErrors = false;
    viewLoading = false;
    loadingAfterSubmit = false;
    images = [];

    document_images = [];

    public createCustomer = new CreateCustomer();

    public LovCall = new Lov();
    public EducationLov: any = [];
    public CasteLov: any = [];
    public ReligionLov: any = [];
    public RiskCategoryLov: any = [];
    public PremisesFlagLov: any = [];
    public BankEmpNoLov: any = [];
    public MaritalStatusLov: any = [];
    public GenderLov: any = [];
    public OccupationLov: any = [];
    public DistrictLov: any = [];
    public DistrictLovFull: any = [];
    public CitizenshipLov: any = [];
    public BorrowerStatusLov: any = [];
    public PostCodeLov: any = [];

    public BranchLov: any = [];
    public ZoneLov: any = [];
    public HusbandNameShow: boolean = true;


    public maskEnums = MaskEnum;
    errors = errorMessages;
    public ObjSearchCustomer: any;
    public HideShowSaveButton = true;
    public ProfileImageSrc: string = './assets/media/logos/profilepicturelogo.png';
    public fileNameProfile: string;
    public ProfileImageData: any;
    public UrduFatherName: string = '';
    public UrduName: string = '';
    public UrduBirthPlace: string = '';
    public UrduCurrentAddress: string = '';
    public UrduPermanentAddress: string = '';
    public div_EmployeeShow: boolean = false;
    CurrentDate: any;
    public Namereadoly: boolean = false;
    public FatherNamereadoly: boolean = false;
    public Dobreadoly: boolean = false;
    public CnicExpiryreadoly: boolean = false;
    public CurrentAddressreadoly: boolean = false;
    public PresentAddressreadoly: boolean = false;
    public CNICCustomError: string = '';
    public IsLoadPreviousData: boolean = false;
    public PassportSterik: boolean = true;
    //Search filters
    public searchFilterCtrl: FormControl = new FormControl();


    //////////////
    public searchFilterCtrlCaste: FormControl = new FormControl();
    public searchFilterCtrlPostCode: FormControl = new FormControl();
    public searchFilterCtrlOccupation: FormControl = new FormControl();
    public CasteLovFull: any = [];
    public PostCodeLovFull: any = [];
    public OccupationLovFull: any = [];
    //todayMax = new Date(2021, 5, 29);
    todayMin = new Date(2021, 5, 1);
    todayMax = new Date();
    bit: any;
    //todayMin = new Date();
    //https://www.npmjs.com/package/ngx-mat-select-search
    disable_save_and_submit: boolean = false;


    ////
    //for search box
    zone: any;
    branch: any;
    editable_cnic: boolean = true;
    currentActivity: Activity;
    private _onDestroy = new Subject<void>();
    private tran_id: number;
    private document_details: any;

    constructor(
        // public dialogRef: MatDialogRef<RoleEditComponent>,
        private formBuilder: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private _customerService: CustomerService,
        private _lovService: LovService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userUtilsService: UserUtilsService,
        private cdRef: ChangeDetectorRef,
        private datePipe: DatePipe,
        private _common: CommonService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private dialogRef: MatDialog,
        private enc: EncryptDecryptService
    ) {

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;


    }

    get f(): any {
        if (typeof this.roleForm != 'undefined') {
            return this.roleForm.controls;

        } else {
            return false;
        }
    }

    ngOnInit() {
        this.currentActivity = this.userUtilsService.getActivity('Create Customer');
        this.images.push(this.ProfileImageSrc);
        this.bit = this.enc.decryptStorageData(localStorage.getItem('CreateCustomerBit'));

        if (this.bit == null || this.bit == undefined || this.bit == '' || this.bit == '10' || this.bit == '1') {
            localStorage.setItem('CreateCustomerBit',this.enc.encryptStorageData( '1'));
            this.router.navigate(['/customer/check-eligibility'], {relativeTo: this.activatedRoute});
            this.IsLoadPreviousData = false;
            return;
        } else if (this.bit == '2' || this.bit == '5') {
            this.IsLoadPreviousData = true;
            localStorage.removeItem('CreateCustomerBit');
        } else {
            this.IsLoadPreviousData = false;
            localStorage.removeItem('CreateCustomerBit');
        }
        let is_edit_mode = this.enc.decryptStorageData(localStorage.getItem('is_view'));
        if (is_edit_mode) {
            this.HideShowSaveButton = false;
            localStorage.removeItem('is_view');
        }

        this.CurrentDate = new Date();
        this.CurrentDate = this.datePipe.transform(this.CurrentDate, MaskEnum.DateFormat);
        this.LoadLovs();
        this.createCustomer = JSON.parse(this.enc.decryptStorageData(localStorage.getItem('SearchCustomerStatus')));
        this.UrduFatherName = this.createCustomer.UrduFatherName
        this.UrduName = this.createCustomer.UrduName;
        this.UrduBirthPlace = this.createCustomer.UrduBirthPlace;
        this.UrduCurrentAddress = this.createCustomer.UrduCurrentAddress;
        this.UrduPermanentAddress = this.createCustomer.UrduPermanentAddress;
        this.createForm();
        if (this.IsLoadPreviousData) {
            this.LoadPreviousData();
        }
        // listen for search field value changes
        this.searchFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterDistricts();
            });


        // Caste listen for search field value changes
        this.searchFilterCtrlCaste.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCaste();
            });

        // Caste listen for search field value changes


        // Caste listen for search field value changes
        this.searchFilterCtrlOccupation.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterOccupation();
            });

        let should_alert =this.enc.decryptStorageData( localStorage.getItem('ShouldAlert'));
        if (should_alert == 'true') {
            localStorage.removeItem('ShouldAlert');
        }
    }

    convertDateToString(dateToBeConverted: string) {
        return moment(dateToBeConverted, 'YYYY-MM-DD HH:mm:ss').format('DD-MMM-YYYY');
    }

    createForm() {


        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.roleForm = this.formBuilder.group({
            Cnic: [this.createCustomer.Cnic, [Validators.required, Validators.pattern(regExps.cnic)]],
            Dob: [this._common.stringToDate(this.createCustomer.Dob)],
            CnicIssueDate: [this._common.stringToDate(this.createCustomer.CnicIssueDate), [Validators.required]],
            CnicExpiry: [this._common.stringToDate(this.createCustomer.CnicExpiry)],
            //Dob: [this.createCustomer.Dob],
            //CnicIssueDate: [this.createCustomer.CnicIssueDate, [Validators.required]],
            //CnicExpiry: [this.createCustomer.CnicExpiry],
            Gender: [this.createCustomer.Gender, [Validators.required]],
            MaritalStatus: [this.createCustomer.MaritalStatus],
            CustomerName: [this.createCustomer.CustomerName, [Validators.required]],
            FatherName: [this.createCustomer.FatherName, [Validators.required]],
            HusbandName: [this.createCustomer.HusbandName],
            FatherOrHusbandCnic: [this.createCustomer.FatherOrHusbandCnic],
            MotherName: [this.createCustomer.MotherName, [Validators.required]],
            Occupation: [this.createCustomer.Occupation ? this.createCustomer.Occupation : null, [Validators.required]],
            BankEmp: [this.createCustomer.BankEmp],
            MarkOfIdentification: [this.createCustomer.MarkOfIdentification],
            Ntn: [this.createCustomer.Ntn, [Validators.pattern(regExps.ntn)]],
            District: [this.createCustomer.District, Validators.required],
            Citizenship: [this.createCustomer.CitizenShip, [Validators.required]],
            CellNumber: [this.ValidateMobileNumberSet(), [Validators.required, Validators.pattern(regExps.mobile)]],
            PhoneNumber: [this.createCustomer.PhoneNumber, [Validators.pattern(regExps.seventothirteen)]],
            OfficePhoneNumber: [this.createCustomer.OfficePhoneNumber, [Validators.pattern(regExps.seventothirteen)]],
            FaxNumber: [this.createCustomer.FaxNumber, [Validators.pattern(regExps.seventothirteen)]],
            Email: [this.createCustomer.Email, [Validators.pattern(regExps.email)]],
            BrowserStatus: [this.createCustomer.BrowserStatus, [Validators.required]],
            Education: [this.createCustomer.Education, Validators.required],
            Caste: [this.createCustomer.Caste ? this.createCustomer.Caste : null, [Validators.required]],
            Religion: [this.createCustomer.Religion, [Validators.required]],
            BirthPlace: [this.createCustomer.BirthPlace],
            RiskCategory: [this.createCustomer.RiskCategory && this.createCustomer.RiskCategory != '-' ? this.createCustomer.RiskCategory : '1', Validators.required],
            PremisesFlag: [this.createCustomer.PremisesFlag],
            BusinessProfPos: [this.createCustomer.BusinessProfPos],
            FamilyNumber: [this.createCustomer.FamilyNumber, [Validators.pattern(regExps.familyNumber)]],
            // BankEmpPPNo: [this.createCustomer.BankEmp, [Validators.required]],
            PostCode: [this.createCustomer.PostCode, [Validators.required]],
            CurrentAddress: [this.createCustomer.CurrentAddress, [Validators.required]],
            PassportNumber: [this.createCustomer.PassportNumber],
            PermanentAddress: [this.createCustomer.PermanentAddress, [Validators.required]],
            Remarks: [this.createCustomer.Remarks],
            OldCnic: [this.createCustomer.OldCnic],
            //FamilyNo: [this.createCustomer.FamilyNo],
            // PlaceOfBirth: [this.createCustomer.PlaceOfBirth],
            EmployeeNo: [this.createCustomer.EmployeeNo],
            //FatherSpouseCnic: [this.createCustomer.FatherSpouseCnic],
            //BusinessProfPosition: [this.createCustomer.BusinessProfPosition],
            NDCPDFLink: [this.createCustomer.NDCPDFLink],
            ECIBPDFLink: [this.createCustomer.ECIBPDFLink],
            file: [],

            // PhoneOff: [this.createCustomer.PhoneOff]
            //  ProfilePicture: ['', Validators.required]
        });

        // const branchWorkingDate = new Date(year, month - 1, day);
        // this.roleForm.controls.EffectiveDate.setValue(branchWorkingDate);

        if (this.roleForm.controls.Gender.value == undefined || this.roleForm.controls.Gender.value == null || this.roleForm.controls.Gender.value == '') {
            this.cnicfocusout();
        }


        //this.cnicfocusout();
        this.GenderChange(null);


        //this.roleForm.controls['Dob'].setValue(this.createCustomer.Dob);
        //this.roleForm.controls['CnicExpiry'].setValue(this.createCustomer.Dob);
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.roleForm.controls[controlName].hasError(errorName);
    }

    onSubmit(flag): void {

        this.hasFormErrors = false;
        const controls = this.roleForm.controls;

        if (this.roleForm.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            this.hasFormErrors = true;
            this.toastr.error("Please Enter Required values");
            return;
        }

        if (flag == true) {


            if (!this.createCustomer) {
                this.toastr.error("Please Save Customer First");
                return;
            }
        }
        let data: any = {};
        let customer_Status = null;
        let customer_number = null;
        let caste_code = null;
        if (this.createCustomer) {
            customer_Status = this.createCustomer.CustomerStatus;
            customer_number = this.createCustomer.CustomerNumber;
            caste_code = this.createCustomer.Caste;
        }
        this.createCustomer = Object.assign(data, this.roleForm.getRawValue());
        if (customer_Status) {
            this.createCustomer.CustomerStatus = customer_Status;
            this.createCustomer.CustomerNumber = customer_number;
            // if (this.createCustomer.Caste) {
            //     this.createCustomer.Caste = caste_code;
            // } Caste code should not be id

        }
        this.createCustomer = data;
        if (this.createCustomer.Email == null) {
            this.createCustomer.Email = '';
        }

        if (this.createCustomer.BirthPlace == null) {
            this.createCustomer.BirthPlace = '';
        }

        if (this.createCustomer.FaxNumber == null) {
            this.createCustomer.FaxNumber = '';
        }

        if (this.createCustomer.PremisesFlag == null) {
            this.createCustomer.PremisesFlag = '';
        }

        if (this.createCustomer.BusinessProfPos == null) {
            this.createCustomer.BusinessProfPos = '';
        }

        if (this.createCustomer.FamilyNumber == null) {
            this.createCustomer.FamilyNumber = '';
        }

        if (this.createCustomer.Remarks == null) {
            this.createCustomer.Remarks = '';
        }


        if (this.createCustomer.OfficePhoneNumber == null) {
            this.createCustomer.OfficePhoneNumber = '';
        }

        if (this.createCustomer.PhoneNumber == null) {
            this.createCustomer.PhoneNumber = '';
        }

        if (this.createCustomer.RiskCategory == null) {
            this.createCustomer.RiskCategory = '';
        }

        if (this.createCustomer.District == null) {
            this.createCustomer.District = 0;
        }

        if (this.createCustomer.Ntn == null) {
            this.createCustomer.Ntn = '';
        }

        if (this.createCustomer.MarkOfIdentification == null) {
            this.createCustomer.MarkOfIdentification = '';
        }

        if (this.createCustomer.FatherOrHusbandCnic == null) {
            this.createCustomer.FatherOrHusbandCnic = '';
        }

        if (this.createCustomer.MaritalStatus == null) {
            this.createCustomer.MaritalStatus = '';
        }

        if (this.createCustomer.OldCnic == null) {
            this.createCustomer.OldCnic = '';
        }

        if (this.createCustomer.BirthPlace == null) {
            this.createCustomer.BirthPlace = '';
        }

        if (this.createCustomer.EmployeeNo == null) {
            this.createCustomer.EmployeeNo = 0;
        }

        if (this.createCustomer.HusbandName == null) {
            this.createCustomer.HusbandName = '';
        }

        if (this.createCustomer.NDCPDFLink == null) {
            this.createCustomer.NDCPDFLink = '';
        }

        if (this.createCustomer.ECIBPDFLink == null) {
            this.createCustomer.ECIBPDFLink = '';
        }

        if (this.createCustomer.BankEmp == null) {
            this.createCustomer.BankEmp = 0;
        }

        if (this.createCustomer.PassportNumber == null) {
            this.createCustomer.PassportNumber = '';
        }


        this.createCustomer.CellNumber = this.ValidateMobileNumberGet();
        this.createCustomer.doSubmit = flag;
        // @ts-ignore
        let cell_number = document.getElementById('tel_code').value + this.roleForm.value.CellNumber;


        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.BranchLov = userInfo.Branch;
        this.createCustomer.Zone = this.zone.ZoneId;
        this.createCustomer.Branch = this.branch.BranchId;

        this.createCustomer.Dob = this.datePipe.transform(this.createCustomer.Dob, 'ddMMyyyy');
        this.createCustomer.CnicExpiry = this.datePipe.transform(this.createCustomer.CnicExpiry, 'ddMMyyyy');
        this.createCustomer.CnicIssueDate = this.datePipe.transform(this.createCustomer.CnicIssueDate, 'ddMMyyyy');

        this.createCustomer.CellNumber = cell_number;
        this.spinner.show();
        this._customerService.createCustomerSave(this.createCustomer)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {

                var pic = this.ProfileImageData;
                if (baseResponse.Success) {
                    if (this.ProfileImageData != undefined || this.ProfileImageData != null) {
                        this.UploadProfilePicture();
                    } else {
                        const dialogRef = this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);

                        dialogRef.afterClosed().subscribe(res => {
                            if (flag == true)
                                this.router.navigate(['/dashboard'], {relativeTo: this.activatedRoute});
                        });


                    }
                } else {

                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }
            });
    }

    UploadProfilePicture() {

        this._customerService.UploadImagesCallAPI(this.ProfileImageData, this.createCustomer.Cnic)
            .pipe(
                finalize(() => {

                })
            )
            .subscribe(baseResponse => {

                if (baseResponse.Success) {

                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                    this.goBackWithId();
                } else {

                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                }
            });


    }

    getTitle(): string {

        return 'Create Customer';
        //if (this.data.profile.ProfileID > 0) {

        //  return 'Edit Role';
        //}
        //return 'New Role';
    }

    close(result: any): void {
        // this.dialogRef.close(result);
    }

    onAlertClose($event) {
        // this.hasFormErrors = false;
    }

    previewImg(url: any) {
        const dialogRef = this.dialogRef.open(ViewFileComponent, {
            width: '100vh',
            height: '100vh',
            data: {url: url}
        });
    }

    async LoadLovs() {

        //this.ngxService.start();

        this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Education});
        this.CasteLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Cast});
        this.ReligionLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Religions});
        this.RiskCategoryLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.RiskCategory});
        this.PremisesFlagLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.PremisesFlag});
        this.BankEmpNoLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Employee});
        this.MaritalStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.MaritalStatus});
        this.GenderLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Gender});
        this.OccupationLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Occupation});
        this.DistrictLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.District});
        this.BorrowerStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.BorrowerStatus});
        this.CitizenshipLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Nationality});
        console.log(this.CasteLov)
        this.PostCodeLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.PostalCode});

        ////For Search
        this.DistrictLovFull = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.District});

        //For Caste
        this.CasteLovFull = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Cast});
        this.CasteLovFull.LOVs = this._lovService.SortLovs(this.CasteLovFull?.LOVs);

        //For Post Code
        this.PostCodeLovFull = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.PostalCode});
        this.PostCodeLovFull.LOVs = this._lovService.SortLovs(this.PostCodeLovFull?.LOVs);


        //For Occupation
        this.OccupationLovFull = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Occupation});
        this.OccupationLovFull.LOVs = this._lovService.SortLovs(this.OccupationLovFull?.LOVs);


        this.DistrictLovFull.LOVs = this._lovService.SortLovs(this.DistrictLovFull?.LOVs);
        this.DistrictLov.LOVs = this._lovService.SortLovs(this.DistrictLov?.LOVs);

        this.EducationLov.LOVs = this._lovService.SortLovs(this.EducationLov?.LOVs);
        this.CasteLov.LOVs = this._lovService.SortLovs(this.CasteLov?.LOVs);

        if (this.bit == '2') {
            var currentCaste = this.CasteLov.LOVs.filter(x => x.Id == this.createCustomer.Caste?.toString())[0];
            this.roleForm.controls.Caste.setValue(currentCaste?.Value);
        }


        //
        //


        this.ReligionLov.LOVs = this._lovService.SortLovs(this.ReligionLov?.LOVs);
        this.RiskCategoryLov.LOVs = this._lovService.SortLovs(this.RiskCategoryLov?.LOVs);
        this.PremisesFlagLov.LOVs = this._lovService.SortLovs(this.PremisesFlagLov?.LOVs);
        this.BankEmpNoLov.LOVs = this._lovService.SortLovs(this.BankEmpNoLov?.LOVs);
        this.MaritalStatusLov.LOVs = this._lovService.SortLovs(this.MaritalStatusLov?.LOVs);
        this.GenderLov.LOVs = this._lovService.SortLovs(this.GenderLov?.LOVs);
        this.OccupationLov.LOVs = this._lovService.SortLovs(this.OccupationLov?.LOVs);
        this.DistrictLov.LOVs = this._lovService.SortLovs(this.DistrictLov?.LOVs);
        this.BorrowerStatusLov.LOVs = this._lovService.SortLovs(this.BorrowerStatusLov?.LOVs);
        this.CitizenshipLov.LOVs = this._lovService.SortLovs(this.CitizenshipLov?.LOVs);

        this.PostCodeLov.LOVs = this._lovService.SortLovs(this.PostCodeLov?.LOVs);

        var userInfo = this.userUtilsService.getUserDetails();

    }

    GenderChange($event) {


        var MaritalStatus = this.roleForm.controls['MaritalStatus'].value;
        var GenderStatus = this.roleForm.controls['Gender'].value;


        if (GenderStatus == 'F') {

            if (MaritalStatus == 'M' || MaritalStatus == 'W') {
                this.HusbandNameShow = true;
                this.roleForm.controls['HusbandName'].setValidators([Validators.required]);
            } else {
                this.HusbandNameShow = false;

                this.roleForm.controls['HusbandName'].clearValidators();
                this.roleForm.controls['HusbandName'].updateValueAndValidity();
            }
        } else if (GenderStatus == 'M') {
            this.HusbandNameShow = false;

            this.roleForm.controls['HusbandName'].clearValidators();
            this.roleForm.controls['HusbandName'].updateValueAndValidity();
        }

    }

    OccupationChange($event) {

        var Occupation = this.roleForm.controls['Occupation'].value;

        if (Occupation == '1') {


            this.roleForm.controls['BankEmp'].setValidators([Validators.required]);
            this.roleForm.controls['BankEmp'].setErrors({'required': true});

            this.div_EmployeeShow = true;

        } else {


            this.roleForm.controls['BankEmp'].clearValidators();
            this.roleForm.controls['BankEmp'].updateValueAndValidity();
            this.div_EmployeeShow = false;
        }


    }

    CitizenshipChange($event) {

        var Citizenship = this.roleForm.controls['Citizenship'].value;

        if (Citizenship == '1') {

            this.roleForm.controls['PassportNumber'].clearValidators();
            this.roleForm.controls['PassportNumber'].updateValueAndValidity();
            this.PassportSterik = false;

        } else {


            this.roleForm.controls['PassportNumber'].setValidators([Validators.required]);
            this.roleForm.controls['PassportNumber'].setErrors({'required': true});
            this.PassportSterik = true;


        }

        this.roleForm.controls['PassportNumber'].updateValueAndValidity();

    }


    //////////Change events

    LoadPreviousData() {

        this.ObjSearchCustomer = JSON.parse(this.enc.decryptStorageData(localStorage.getItem('SearchCustomerStatus')));
        if (this.ObjSearchCustomer != null && this.ObjSearchCustomer != '') {


            this.spinner.show();
            this._customerService.GetCustomer(this.ObjSearchCustomer)
                .pipe(
                    finalize(() => {
                        this.spinner.hide();
                    })
                )
                .subscribe(baseResponse => {

                    if (baseResponse.Success) {
                        var customerobj = baseResponse.Customer;
                        this.tran_id = baseResponse.TranId;

                        this.getCustomerDocuments(customerobj);


                        this.createCustomer = customerobj;
                        if (this.createCustomer.FatherOrHusbandCnic != undefined && this.createCustomer.FatherOrHusbandCnic != null) {
                            this.createCustomer.FatherOrHusbandCnic = parseInt(this.createCustomer.FatherOrHusbandCnic).toString();
                        } else {
                            this.createCustomer.FatherOrHusbandCnic = '';
                        }

                        if (this.createCustomer.FaxNumber != undefined && this.createCustomer.FaxNumber != null) {
                            this.createCustomer.FaxNumber = parseInt(this.createCustomer.FaxNumber).toString();
                        } else {
                            this.createCustomer.FaxNumber = '';
                        }
                        //this.createCustomer.FaxNumber = && this.createCustomer.FaxNumber != null ? parseInt(this.createCustomer.FaxNumber).toString() : "";
                        this.createForm();
                        this.ReadWriteForm();


                        try {

                            if (customerobj.ProfilePicturePath != null && customerobj.ProfilePicturePath != undefined) {


                                var PreviousUploadProfile = environment.apiUrl+customerobj.ProfilePicturePath;
                                if (PreviousUploadProfile != undefined && PreviousUploadProfile != null) {

                                    this.images = [];
                                    this.images.push(PreviousUploadProfile);

                                }

                            }

                        } catch (e) {

                        }

                        try {

                            this.UrduFatherName = customerobj.UrduFatherName;
                            this.UrduName = customerobj.UrduName;
                            this.UrduBirthPlace = customerobj.UrduBirthPlace;
                            this.UrduCurrentAddress = customerobj.UrduCurrentAddress;
                            this.UrduPermanentAddress = customerobj.UrduPermanentAddress;

                        } catch (e) {

                        }

                        this.cdRef.detectChanges();


                    }


                    this.createForm();
                    this.cdRef.detectChanges();
                    //else
                    //  this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

                });

        }


    }

    ValidateMobileNumberSet() {

        var Mob = this.createCustomer?.CellNumber;


        if (Mob != null && Mob != undefined && Mob != '') {
            var MobLength = Mob.length;

            if (Mob.length == 14) {
                return Mob.substring(5);
            }

            if (Mob.length == 13) {
                return Mob.substring(4);
            } else if (Mob.length == 12) {
                return Mob.substring(3);
            } else {
                return Mob;
            }

        } else {
            Mob = '';
        }


    }

    ValidateMobileNumberGet() {

        var Mob = this.createCustomer?.CellNumber;


        if (Mob != null && Mob != undefined && Mob != '') {
            var MobLength = Mob.length;
            if (Mob.length == 8) {
                return Mob = '+923' + Mob;
            } else {
                return Mob;
            }

        }

    }

    ReadWriteForm() {
        var customerStatus = JSON.parse(this.enc.decryptStorageData(localStorage.getItem('SearchCustomerStatus')));
        var user = JSON.parse(this.enc.decryptStorageData(localStorage.getItem('ZTBLUser'))).User;
        if (customerStatus?.CustomerStatus.toLowerCase() == 'a' || customerStatus?.CustomerStatus.toLowerCase() == 'p')
            if (customerStatus.CreatedBy != user.UserId) {
                this.roleForm.disable();
                //this.roleForm.controls["Gender"].disabled;
                this.isGenderDisabled = true;
                this.CurrentAddressreadoly = true;
            } else {
                this.CurrentAddressreadoly = false;

                this.roleForm.controls['PermanentAddress'].updateValueAndValidity();
            }

        // if (customerStatus.CustomerStatus)


        this.GenderChange(null);
        this.CitizenshipChange(null);
        this.OccupationChange(null);
        //this.cnicfocusout();

        try {


            this.Namereadoly = this._lovService.IsReadonly(this.roleForm.controls['CustomerName'].value);
            this.FatherNamereadoly = this._lovService.IsReadonly(this.roleForm.controls['FatherName'].value);
            this.Dobreadoly = this._lovService.IsReadonly(this.roleForm.controls['Dob'].value);
            this.CnicExpiryreadoly = this._lovService.IsReadonly(this.roleForm.controls['CnicExpiry'].value);
            //this.CurrentAddressreadoly = this._lovService.IsReadonly(this.roleForm.controls['CurrentAddress'].value);
            this.PresentAddressreadoly = this._lovService.IsReadonly(this.roleForm.controls['PermanentAddress'].value);


        } catch (e) {


        }


    }//end of read write function

    goBackWithId() {

        this.router.navigate(['/customer/search-customer'], {relativeTo: this.activatedRoute});
    }

    ngAfterViewInit() {


    }

    onFileSelected(event) {

        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.fileNameProfile = file.name;

            var Name = file.name.split('.').pop();
            if (Name != undefined) {
                if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'png' || Name.toLowerCase() == 'jpeg') {
                    //this.roleForm.controls['ProfilePicture'].setValue(file);
                    var reader = new FileReader();

                    reader.onload = (event: any) => {

                        this.images.push(event.target.result);

                        this.ProfileImageData = file;

                        this.roleForm.patchValue({
                            fileSource: this.images
                        });
                    };
                    reader.readAsDataURL(event.target.file);
                }
            } else {
                this.layoutUtilsService.alertElementSuccess('Only jpeg, png, jpg files are allowed', 'Only jpeg, png, jpg files are allowed', '99');

                event.srcElement.value = null;
            }
        }
    }

    onFileChange(event) {

        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            var file = event.target.files[0];

            var Name = file.name.split('.').pop();
            if (Name != undefined) {
                if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'png' || Name.toLowerCase() == 'jpeg') {

                    for (let i = 0; i < filesAmount; i++) {

                        this.images = [];
                        var reader = new FileReader();

                        reader.onload = (event: any) => {


                            this.images.push(event.target.result);

                            this.ProfileImageData = file;
                            this.roleForm.patchValue({
                                fileSource: this.images
                            });
                        };
                        reader.readAsDataURL(event.target.files[i]);
                    }
                    this.cdRef.detectChanges();
                } else {
                    this.layoutUtilsService.alertElementSuccess('Only jpeg, png, jpg files are allowed', 'Only jpeg, png, jpg files are allowed', '99');

                    event.srcElement.value = null;

                    return;
                }
            }

        }
    }

    ///////End of change events////////////////

    onPickerClosed() {


        var Dob = this.roleForm.controls['Dob'].value;
        var CnicIssue = this.roleForm.controls['CnicIssueDate'].value;
        var CnicExpiry = this.roleForm.controls['CnicExpiry'].value;

        let DobDate = null;// new Date(ldStartDate);
        let CnicIssueDate = null;// new Date(ldStartDate);
        let CnicExpiryDate = null;// new Date(ldStartDate);

        if (CnicIssue != null && CnicIssue != '' && CnicIssue != undefined &&
            Dob != null && Dob != '' && Dob != undefined) {
            CnicIssueDate = new Date(CnicIssue);
            DobDate = new Date(Dob);


            var DifferenceFirst = Math.floor((CnicIssueDate.getFullYear()) - DobDate.getFullYear());
            if (DifferenceFirst < 18) {
                this.roleForm.controls['CnicIssueDate'].setErrors({'invaliddaterange': true});
                this.CNICCustomError = 'Date of Birth and CNIC Issue difference should be at least 18 years';
                return;
            } else {
                this.CNICCustomError = '';
                // this.roleForm.controls['CnicIssueDate'].setErrors({ 'invaliddaterange': null });

                this.roleForm.controls['CnicIssueDate'].clearValidators();
                this.roleForm.controls['CnicIssueDate'].updateValueAndValidity();

            }

        }

        if (CnicIssue != null && CnicIssue != '' && CnicIssue != undefined &&
            CnicExpiry != null && CnicExpiry != '' && CnicExpiry != undefined) {
            CnicIssueDate = new Date(CnicIssue);
            CnicExpiryDate = new Date(CnicExpiry);


            var DifferenceFirst = Math.floor((CnicExpiryDate.getFullYear()) - CnicIssueDate.getFullYear());
            if (DifferenceFirst < 5) {
                this.roleForm.controls['CnicIssueDate'].setErrors({'invaliddaterange': true});
                this.CNICCustomError = 'CNIC Issue and Expiry date difference should be at least 5 years';
                return;
            } else {
                this.CNICCustomError = '';
                //this.roleForm.controls['CnicIssueDate'].setErrors({ 'invaliddaterange': null });

                this.roleForm.controls['CnicIssueDate'].clearValidators();
                this.roleForm.controls['CnicIssueDate'].updateValueAndValidity();

            }

        }


    }

    cnicfocusout() {

        var Cnic = this.roleForm.controls['Cnic'].value;
        if (Cnic != '' && Cnic != undefined && Cnic != null && Cnic.length == 13) {

            var lastDigit = Cnic.substring(Cnic.length - 1);

            if (lastDigit % 2 == 0)///Means Female
            {
                this.roleForm.controls['Gender'].setValue('F');
            } else // Means Male as cnic last digit is odd
            {
                this.roleForm.controls['Gender'].setValue('M');
            }


        }


    }

    checkSequentialPhone() {

        var Input = this.roleForm.controls['PhoneNumber'].value;

        if (Input != '' && Input != null && Input != undefined) {

            if (this._common.isMatchSequentialInput(Input)) {
                this.roleForm.controls['PhoneNumber'].setErrors({'sequentialError': true});
            } else {

                //
                this.roleForm.controls['PhoneNumber'].setErrors({'sequentialError': null});
                this.roleForm.controls['PhoneNumber'].updateValueAndValidity();
            }


        }


    }

    checkSequentialFax() {

        var Input = this.roleForm.controls['FaxNumber'].value;

        if (Input != '' && Input != null && Input != undefined) {

            if (this._common.isMatchSequentialInput(Input)) {
                this.roleForm.controls['FaxNumber'].setErrors({'sequentialError': true});
            } else {

                //
                this.roleForm.controls['FaxNumber'].setErrors({'sequentialError': null});
                this.roleForm.controls['FaxNumber'].updateValueAndValidity();
            }


        }


    }

    checkSequentialCell() {

        var Input = this.roleForm.controls['CellNumber'].value;

        if (Input != '' && Input != null && Input != undefined) {

            if (this._common.isMatchSequentialInput(Input)) {
                this.roleForm.controls['CellNumber'].setErrors({'sequentialError': true});
            } else {

                //
                this.roleForm.controls['CellNumber'].setErrors({'sequentialError': null});
                this.roleForm.controls['CellNumber'].updateValueAndValidity();
            }


        }


    }

    checkSequentialNtn() {

        var Input = this.roleForm.controls['Ntn'].value;

        if (Input != '' && Input != null && Input != undefined) {

            if (this._common.isMatchSequentialInput(Input)) {
                this.roleForm.controls['Ntn'].setErrors({'sequentialError': true});
            } else {

                //
                this.roleForm.controls['Ntn'].setErrors({'sequentialError': null});
                this.roleForm.controls['Ntn'].updateValueAndValidity();
            }


        }


    }

    getAllData(event: { final_zone: any; final_branch: any; final_circle: any }) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
    }

    viewHistory() {
        localStorage.setItem('CustomerNumber',this.enc.encryptStorageData(  this.createCustomer.CustomerNumber));
        // this.router.navigate(['/customer/customer-history'])
        let url = this.router.serializeUrl(this.router.createUrlTree(['/customer/customer-history'], {queryParams: {}}));
        url = '#' + url;
        window.open(url, '_blank');
    }

    submitDocuments() {
        let dialog_ref = this.dialogRef.open(SubmitDocumentsComponent,
            {
                data: {
                    customer: this.createCustomer, tranId: this.tran_id, document_details: this.document_details
                },
                panelClass: ['w-9/12']
            }
        );

        dialog_ref.afterClosed().subscribe(() => {
            this.getCustomerDocuments(this.createCustomer);
        })

    }

    deleteImage(customer_document: any) {
        let dialogRef = this.layoutUtilsService.AlertElementConfirmation("Do you really want to delete this Document?");
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                this._customerService.deleteDocument(customer_document).subscribe((data) => {
                    if (data.Success) {
                        this.getCustomerDocuments(this.createCustomer);
                        this.toastr.success("Document Deleted Successfully");
                    } else {
                        this.toastr.error(data.Message);
                    }
                })
            } else {
                return
            }
        })

    }

    private filterDistricts() {
        let search = this.searchFilterCtrl.value;
        this.DistrictLov.LOVs = this.DistrictLovFull?.LOVs;
        if (!search) {
            this.DistrictLov.LOVs = this.DistrictLovFull.LOVs;
        } else {
            search = search.toLowerCase();
            this.DistrictLov.LOVs = this.DistrictLov?.LOVs.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
        }

    }

    private filterCaste() {

        // get the search keyword
        let search = this.searchFilterCtrlCaste.value;
        this.CasteLov.LOVs = this.CasteLovFull.LOVs;

        if (!search) {
            //this.DistrictLov.LOVs.next(this.DistrictLov.LOVs.slice());

            this.CasteLov.LOVs = this.CasteLovFull.LOVs;

        } else {
            search = search.toLowerCase();
            this.CasteLov.LOVs = this.CasteLov.LOVs.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
        }

    }

    private filterOccupation() {

        // get the search keyword
        let search = this.searchFilterCtrlOccupation?.value;
        this.OccupationLov.LOVs = this.OccupationLovFull?.LOVs;

        if (!search) {
            //this.DistrictLov.LOVs.next(this.DistrictLov.LOVs.slice());

            this.OccupationLov.LOVs = this.OccupationLovFull?.LOVs;

        } else {
            search = search.toLowerCase();
            this.OccupationLov.LOVs = this.OccupationLov?.LOVs.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
        }

    }

    private getCustomerDocuments(customerobj: any) {
        this.document_images = [];
        this.document_details = [];
        this.spinner.show()
        this._customerService.getCustomerDocuments(customerobj).subscribe((baseResponse) => {
            this.spinner.hide()
            this.document_details = baseResponse.DocumentDetails;
            this.document_details?.forEach((single_document_detail) => {
                single_document_detail?.CustomerDocuments?.forEach((customer_document) => {
                    this.document_images.push(
                        {
                            url: customer_document.FilePath,
                            type_description: single_document_detail.Description,
                            type_name: single_document_detail.DocumentTypeName,
                            reference: single_document_detail.RefrenceNumber,
                            file_description: customer_document.Description,
                            customer_document: customer_document
                        })
                })
            })
        });
    }
}//end of class
