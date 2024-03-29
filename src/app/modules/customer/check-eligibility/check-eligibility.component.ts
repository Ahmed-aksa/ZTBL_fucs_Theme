import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DateFormats, errorMessages, Lov, LovConfigurationKey, MaskEnum, regExps} from 'app/shared/classes/lov.class';
import {Activity} from 'app/shared/models/activity.model';
import {BaseRequestModel} from 'app/shared/models/base_request.model';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {CreateCustomer} from 'app/shared/models/customer.model';
import {CommonService} from 'app/shared/services/common.service';
import {CustomerService} from 'app/shared/services/customer.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from "ngx-toastr";
import {EncryptDecryptService} from "../../../shared/services/encrypt_decrypt.service";
import {BiometricSecuGenService} from "../../../shared/services/biometricSecuGen.service";


@Component({
    selector: 'kt-check-eligibility',
    templateUrl: './check-eligibility.component.html',
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class CheckEligibilityComponent implements OnInit {
    saving = false;
    submitted = false;
    customerInfo: FormGroup;
    _activity: Activity = new Activity();
    loading = false;
    viewLoading = false;
    dataID = "Test"
    CustomerNdc: any;
    CustomerECIB: any;
    Customer: any;
    gridHeight: string = '0px';
    Ftb: number;
    NDCPerform: boolean;
    IsNdcDefaulter: boolean;
    IsEcibDefaulter: boolean;
    BiMatricCasePerfom: boolean;
    NdcSubmit: boolean;
    BioMetricCapture: boolean;
    BiometricCredentials: boolean;
    ECIBPerformSuccess: boolean;
    NDCActionPerformSuccess: boolean;
    ECIBPerform: boolean;
    ECIBPerformForm: boolean;
    loadingAfterSubmit = false;
    tran_id: any;
    public LovCall = new Lov();
    public GenderLov: any;
    public AccountType: any;

    submitCwrLoading = false;
    refreshEcibLoading = false;

    customer_ndc: any;
    customer_nivs: any;
    customer_bmvs: any;
    NDC_Val: string;
    ECIB_Val: string;
    NDCLinkView: boolean;
    EcibLinkView: boolean;
    checkEligibiltyCnic: boolean;

    _customer: CreateCustomer = new CreateCustomer();
    public request = new BaseRequestModel();


    public maskEnums = MaskEnum;
    errors = errorMessages;

    todayMax = new Date();
    todayMin = new Date();


    disable_district_field: boolean;
    disrtrict_value;


    last_log_name: string = '';
    disable_buttons: boolean = true;
    show_ndc = false;
    IS_NIVS: string;

    should_regenerate: boolean = false;
    //Urdu
    UrduName: string = '';
    UrduCity: string = '';
    UrduCurrentAddress: string = '';
    currentActivity: Activity;
    //Refresh Ecib
    disable_defaulter: boolean = false;
    //this.refreshEcibLoading = false;
    remarks: any;
    number_of_files: number = 1;
    private first_request_response: BaseResponseModel;
    private rawData: any = [];
    private customer_number: any;

    //finger Print
    biometricTemplate: any;
    isSuccess: boolean = false;
    fingerIndex: string;
    // private subscription: Subscription;
    biometricImage: any = "assets/images/biometric_1.png";
    public Text: any;

    constructor(
        private formBuilder: FormBuilder,
        private _customerService: CustomerService,
        private _biometricService: BiometricSecuGenService,
        private userUtilsService: UserUtilsService,
        private layoutUtilsService: LayoutUtilsService,
        private _cdf: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private _lovService: LovService,
        //private state: RouterStateSnapshot,
        private router: Router,
        private datePipe: DatePipe,
        private _common: CommonService,
        private spinner: NgxSpinnerService,
        private toaster: ToastrService,
        private enc: EncryptDecryptService
    ) {
    }

    get f(): any {
        return this.customerInfo.controls;
        this.fingerIndex = "1";
        this.Text = this.FingerType(this.fingerIndex);// "Place Your Right Thumb";
    }



    ///By Pass screens in terms of data

    ngOnInit() {
        this.InitializeFinger();
        this.currentActivity = this.userUtilsService.getActivity('Check Eligibility');
        this.NDCPerform = false;
        this.IsNdcDefaulter = false;
        this.NDCActionPerformSuccess = true;
        this.NdcSubmit = false;
        this.BioMetricCapture = false;
        this.BiometricCredentials = false;
        this.BiMatricCasePerfom = false;
        this.ECIBPerform = false;
        this.ECIBPerformForm = false;
        this.ECIBPerformSuccess = false;
        this.IsEcibDefaulter = false;
        this.NDCLinkView = true;
        this.EcibLinkView = true;
        this.checkEligibiltyCnic = false;
        this.LoadLovs();
        this.createForm();


        this.todayMax.setFullYear(this.todayMax.getFullYear() - 18);

    }

    async LoadLovs() {

        this.GenderLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Gender})
        this.AccountType = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.NadraAccountTypes})
        this.GenderLov.LOVs = this._lovService.SortLovs(this.GenderLov.LOVs);
        this.AccountType.LOVs = this._lovService.SortLovs(this.AccountType.LOVs);
    }

    //Get Customer Info
    getCustomerInfo() {
        this.disable_buttons = true;
        this.show_ndc = true;
        this.checkEligibiltyCnic = true;
        const controlsCust = this.customerInfo.controls;
        this._customer = Object.assign(this._customer, this.customerInfo.value);
        if (this.customerInfo.controls["Cnic"].invalid) {
            controlsCust["Cnic"].markAsTouched()

            this.checkEligibiltyCnic = false;
            return;
        } else {
        }

        this.loading = true;
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.request.User = userInfo.User;


        this.request.Customer = this._customer;

        this._activity.ActivityID = 1;
        this.request.Activity = this._activity;

        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.spinner.show()
        this._customerService.getCustomerInfo(this.request)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {

                    this.first_request_response = baseResponse;
                    this.loading = false;
                    this.NDCPerform = true;
                    this.NdcSubmit = true;
                    this.Customer = baseResponse.Customer;
                    this.customer_number = this.Customer.CustomerNumber;
                    this.customer_number = baseResponse.Customer.CustomerNumber;
                    this.UrduName = baseResponse?.Customer?.UrduName;
                    this.UrduCity = baseResponse?.Customer?.UrduCity;
                    this.UrduCurrentAddress = baseResponse?.Customer?.UrduCurrentAddress;
                    this.customer_ndc = baseResponse.EligibilityRequest.CustomerNDC;
                    this.customer_bmvs = baseResponse.EligibilityRequest.CustomerBMVS;
                    this.customer_nivs = baseResponse.EligibilityRequest.CUSTOMERNIVS;
                    this.CustomerNdc = baseResponse.customerNDC;
                    if (this.CustomerNdc?.Code == "449") {
                        this.IsNdcDefaulter = true;
                        this.disable_defaulter = true;
                        this.NDC_Val = this.CustomerNdc.Message;
                    } else {
                        this.IsNdcDefaulter = false;
                    }


                    this.Ftb = baseResponse.Ftb;
                    this.tran_id = baseResponse.TranId;
                    this._cdf.detectChanges();

                    if (this.Customer.NDCPDFLink == null || this.Customer.NDCPDFLink == "") {
                        this.NDCLinkView = false;
                        this.layoutUtilsService.alertMessage("", "No NDCP Record Available");
                    }
                } else {
                    if (baseResponse.Ftb == 1) {
                        this.router.navigate(['/dashboard']);
                    }
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });

    }

    //Submit NDC
    SubmitNdc() {
        if (this.CustomerNdc.Code == '449') {

            this.router.navigate(['/dashboard'], {relativeTo: this.activatedRoute});
        } else {

            const _title = 'Confirmation';
            const _description = 'Do you really want to submit NDC for approval?';
            const _waitDesciption = '';
            const _deleteMessage = `Role has been deleted`;
            const dialogRef = this.layoutUtilsService.AlertElementConfirmation(_title, _description, _waitDesciption);
            dialogRef.afterClosed().subscribe(res => {
                if (!res) {
                    return;
                }
                this.spinner.show();

                this.loading = true;
                this._customer = this.Customer;
                this._customerService.submitNdc(this._customer, this.tran_id)
                    .pipe(
                        finalize(() => {
                            this.submitted = false;
                            this.last_log_name = 'ndc_submitted';
                            this.spinner.hide();

                        })
                    )
                    .subscribe((baseResponse: BaseResponseModel) => {
                        if (baseResponse.Success === true) {
                            this.NDCActionPerformSuccess = false;
                            this.NdcSubmit = false;
                            this.BiMatricCasePerfom = true;
                            this.PerformUseCases(this.first_request_response);
                            this._cdf.detectChanges();
                        } else {
                            if (baseResponse.Ftb == 1) {
                                this.router.navigate(['/dashboard']);
                            }
                            this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                        }

                    });

            });
        }


    }

    //OS Change Set
    PerformUseCases(Data) {
        if (Data.Customer.City) {
            this.disrtrict_value = Data.Customer.City;
            this.disable_district_field = true;
        } else if (Data.Customer.District) {
            this.disrtrict_value = Data.Customer.District;
            this.disable_district_field = true;
        } else {
            this.disable_district_field = false;
            this.disrtrict_value = '';
        }
        if (Data.Customer != '' && Data.Customer != null && Data.Customer != undefined) {
            // var check = Data.Customer.isBMVSAvailable;
            // if (check) {
            //     this.BiMatricCasePerfom = true;
            //     this._customer = new CreateCustomer();
            //     this._customer = Object.assign(this._customer, Data.Customer);
            //     this.BiometricCredentials = false;
            //
            // } else {
            //     this.BiMatricCasePerfom = false;
            //     this.BiometricCredentials = true;
            //     this._customer = new CreateCustomer();
            //     this._customer = Object.assign(this._customer, Data.Customer);
            // }


            let check = Data.Code;
            if (check == '2068') {
                this.BiMatricCasePerfom = true;
                this._customer = new CreateCustomer();
                this._customer = Object.assign(this._customer, Data.Customer);
                this.BiometricCredentials = false;

            } else {
                this.BiMatricCasePerfom = false;
                this.BiometricCredentials = true;
                this._customer = new CreateCustomer();
                this._customer = Object.assign(this._customer, Data.Customer);
            }

            if (this._customer.City) {
                this.disrtrict_value = this._customer.City;
                this.disable_district_field = true;
            } else if (this._customer.District) {
                this.disrtrict_value = this._customer.District;
                this.disable_district_field = true;
            } else {
                this.disable_district_field = false;
                this.disrtrict_value = '';
            }
            this.createForm();

            this._cdf.detectChanges();
        }

    }
    image:string=null;
    //Perform biomatric
    performBiomatric() {
        this.BiMatricCasePerfom = false;
        this.BioMetricCapture = true;
    }

    //biometric Start

    VerifyCustomerNADRA(){

        if (this.customerInfo.controls["FingerTemplate"].value == null ||this.customerInfo.controls["FingerTemplate"].value == "") {
            var Message = 'Please capture finger first';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        this._customer = Object.assign(this._customer, this.customerInfo.value);
        this.spinner.show();
        this._biometricService.VerifyCustomerNADRA(this._customer)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((res:any) => {
                console.log(res)

            });
    }

    InitializeFinger(){

        this.spinner.show();
        this._biometricService.InitializeFinger()
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((res) => {

            });
    }
    captureBiometric() {

        if (this.customerInfo.controls["FingerIndex"].value == null ||this.customerInfo.controls["FingerIndex"].value == "") {
            var Message = 'Please select finger index';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }
        this.spinner.show();
        this._biometricService.CaptureFinger(this.customerInfo.controls["FingerIndex"].value)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((res) => {
                if(res.code=="00"){

                    this.customerInfo.controls["FingerTemplate"].setValue(res.value);
                    this.image='data:image/jpeg;base64,'+res.image;
                }
                if(res.code=="07"){
                    this.InitializeFinger();
                }

            });



        // return this.http.get<any>('https://localhost:9999/ASW/captureFinger?template=2&finger=1')
        //     .pipe(map(response => {
        //
        //         return response;
        //     }));


    }

    FingerType(fingerIndex: string) {

        switch (fingerIndex) {

            case "7":

                return "Place Your Left Index Finger";

            case "6":

                return "Place Your Left Thumb";

            case "2":

                return "Place Your Right Index Finger";

            case "1":

                return "Place Your Right Thumb";

            case "3":

                return "Place Your Right Middle Finger";

            case "4":

                return "Place Your Right Ring Finger";

            case "5":

                return "Place Your Right Little Finger";

            case "8":

                return "Place Your Left Middle Finger";

            case "9":

                return "Place Your Left Ring Finger";

            case "10":

                return "Place Your Left Little Finger";

            default:

                return "No finger Index available";



        }

    }

    //biometric End

    //Submit biomatric
    saveBiomatricdata() {
        const controls = this.customerInfo.controls;
        this._customer = Object.assign(this._customer, this.customerInfo.value);
        if ((this._customer.Cnic == null || this._customer.Cnic == "") || (this._customer.CnicExpiry == null || this._customer.CnicExpiry == "") || (this._customer.Dob == null || this._customer.Dob == "") || (this._customer.CustomerName == null || this._customer.CustomerName == "") || (this._customer.FatherName == null || this._customer.FatherName == "") || (this._customer.CurrentAddress == null || this._customer.CurrentAddress == "") || (this._customer.Gender == null || this._customer.Gender == "")) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            this.toaster.error("Please Enter All Required fields");
            return;
        }
        this._customer.Dob = this.datePipe.transform(this._customer.Dob, "ddMMyyyy");
        this._customer.CnicExpiry = this.datePipe.transform(this._customer.CnicExpiry, "ddMMyyyy");
        this.BioMetricCapture = false;
        this.BiometricCredentials = true;
    }

    //Submit CWR
    submitCWR() {
        this.submitCwrLoading = true;
        const controls = this.customerInfo.controls;
        if (this.customerInfo.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            this.toaster.error("Please Enter All Required fields");
            return;
        }
        this.loading = true;
        this.Customer.CurrentAddress = this.customerInfo.controls['CurrentAddress'].value
        this._customer.CurrentAddress = this.customerInfo.controls['CurrentAddress'].value;
        this.Customer.Gender = this.customerInfo.controls['Gender'].value
        this._customer.Gender = this.customerInfo.controls['Gender'].value;

        this.Customer = this._customer;
        this.customer_number = this.Customer.CustomerNumber;

        this.spinner.show();
        this._customerService.addCustomerInfo(this._customer, this.tran_id)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    this.BiometricCredentials = false;
                    this.ECIBPerformForm = true;

                    this.Customer = baseResponse.Customer;
                    this.customer_number = this.Customer.CustomerNumber;
                    this.CustomerECIB = baseResponse.Ecib;

                    if (this.CustomerECIB.Code == "549") {
                        this.IsEcibDefaulter = true;
                        this.ECIBPerform = true;

                        this.should_regenerate = true;
                    } else {
                        this.IsEcibDefaulter = false;
                    }

                    if (this.CustomerECIB.Code == '552' || this.CustomerECIB.Code == '550') {
                        this.should_regenerate = false;
                        this.IsEcibDefaulter = false;
                        this.ECIBPerformSuccess = true;
                        localStorage.setItem('SearchCustomerStatus', this.enc.encryptStorageData(JSON.stringify(this.Customer)));
                    }
                    if (this.CustomerECIB.Code == '551') {
                        this.ECIBPerform = false;
                        this.should_regenerate = true;
                    }
                    if (this.Customer.ECIBPDFLink == null || this.Customer.ECIBPDFLink == "") {
                        this.EcibLinkView = false;
                        //this.layoutUtilsService.alertMessage("", "No ECIB Record Available");
                    } else {
                        this.EcibLinkView = true;
                    }

                    if (this.CustomerECIB.Message == "Eligible") {
                        this.ECIBPerformSuccess = true;
                        localStorage.setItem('SearchCustomerStatus', this.enc.encryptStorageData(JSON.stringify(this.Customer)));
                    }


                } else {
                    if (baseResponse.Ftb == 1) {
                        this.router.navigate(['/dashboard']);
                    }
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });

    }

    refreshEcib() {

        this.refreshEcibLoading = true;
        // if (this.CustomerECIB.Code == '549') {
        //     this.router.navigate(['/dashboard'], {relativeTo: this.activatedRoute});
        // } else
        {
            this.loading = true;
            this._customer = this.Customer;
            this.spinner.show()
            this._customerService.refreshEcib(this._customer, this.tran_id)
                .pipe(
                    finalize(() => {
                        this.refreshEcibLoading = true;
                        this.submitted = false;
                        this.loading = false;
                        this.spinner.hide();
                    })
                )
                .subscribe((baseResponse: BaseResponseModel) => {
                    this.refreshEcibLoading = true;
                    if (baseResponse.Success === true) {
                        this.BiometricCredentials = false;
                        this.customer_ndc = baseResponse.EligibilityRequest.CustomerNDC;
                        this.customer_bmvs = baseResponse.EligibilityRequest.CustomerBMVS;
                        this.customer_nivs = baseResponse.EligibilityRequest.CUSTOMERNIVS;
                        this.Customer = baseResponse.Customer;
                        this.customer_number = baseResponse.Customer.CustomerNumber;
                        this.CustomerECIB = baseResponse.Ecib;

                        localStorage.setItem('SearchCustomerStatus', this.enc.encryptStorageData(JSON.stringify(this.Customer)));
                        var bit = this.enc.decryptStorageData(localStorage.getItem("CreateCustomerBit"));
                        if (bit == '10') {
                            localStorage.setItem('CreateCustomerBit', this.enc.decryptStorageData('5'));
                            this.ECIBPerform = false;
                            this.ECIBPerformSuccess = true;
                        } else {
                            this.ECIBPerform = false;
                            this.ECIBPerformSuccess = true;
                        }

                        if (this.Customer.ECIBPDFLink == null || this.Customer.ECIBPDFLink == "") {
                            this.EcibLinkView = false;
                        } else {
                            this.EcibLinkView = true;
                        }

                    } else {
                        if (baseResponse.Ftb == 1) {
                            this.router.navigate(['/dashboard']);
                        }
                        this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                    }

                });
        }
        //this.refreshEcibLoading = false;
    }

    NextOpenCreateCustomer() {
        // if (localStorage.getItem('CreateCustomerBit') == '1') {
        //     this.router.navigate(['/customer/customerProfile'], {relativeTo: this.activatedRoute});
        // }
        var bit = this.enc.decryptStorageData(localStorage.getItem("CreateCustomerBit"));
        if (bit == '10') {
            localStorage.setItem('CreateCustomerBit', this.enc.encryptStorageData('5'));
            bit = this.enc.decryptStorageData(localStorage.getItem("CreateCustomerBit"));
        }
        //console.log(bit)
        if (bit == '1') {
            localStorage.setItem('CreateCustomerBit', this.enc.encryptStorageData('2'));
            localStorage.setItem('ShouldAlert', this.enc.encryptStorageData('true'));
            this.Customer.CustomerNumber = this.customer_number
            localStorage.setItem('SearchCustomerStatus', this.enc.encryptStorageData(JSON.stringify(this.Customer)));

            this.router.navigate(['/customer/customerProfile'], {relativeTo: this.activatedRoute});
        } else {
        }

    }

    createForm() {
        this.customerInfo = this.formBuilder.group({
            Cnic: [this._customer.Cnic, [Validators.required, Validators.pattern(regExps.cnic)]],
            Dob: [this._common.stringToDate(this._customer.Dob), [Validators.required]],
            CnicExpiry: [this._common.stringToDate(this._customer.CnicExpiry), [Validators.required]],
            CustomerName: [this._customer.CustomerName, [Validators.required]],
            FatherName: [this._customer.FatherName, [Validators.required]],
            CurrentAddress: [this._customer.CurrentAddress, [Validators.required]],
            Gender: [this._customer.Gender],
            AccountType: [this._customer.AccountType],
            FingerIndex: [this._customer.FingerIndex, [Validators.required]],
            CellNumber: [this._customer.CellNumber ,[Validators.required]],
            FingerTemplate: [this._customer.FingerTemplate],
            District: [null, [Validators.required]]
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.customerInfo.controls[controlName].hasError(errorName);
    }

    ngAfterViewInit() {
        this.gridHeight = window.innerHeight - 220 + 'px';
    }

    getTitle() {
        let result = 'Check Eligibility';

        if (this.BioMetricCapture == true) {
            result = 'Biometric Credentials';
        }
        if (this.BiometricCredentials == true) {
            result = 'CWR';
        }

        return result;
    }

    change_cnic(value: string) {

        this.Customer = null;
        this.NDCPerform = false;

        if (value.length == 13) {
            this.disable_buttons = false;
        } else {
            this.disable_buttons = true;
            this.show_ndc = false;
            this.disable_defaulter = false;
        }
    }

    regenerate() {

        this.loading = true;
        this._customer = this.Customer;
        this.spinner.show()

        this._customerService.regenerateEcib(this._customer, this.tran_id)
            .pipe(
                finalize(() => {
                    this.refreshEcibLoading = true;
                    this.submitted = false;
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                this.refreshEcibLoading = true;
                if (baseResponse.Success === true) {
                    this.BiometricCredentials = false;
                    this.Customer = baseResponse.Customer;
                    this.customer_number = this.Customer.CustomerNumber;
                    this.IsEcibDefaulter = false;
                    this.toaster.success(baseResponse.Message)
                } else {
                    if (baseResponse.Ftb == 1) {
                        this.router.navigate(['/dashboard']);
                    }
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });
    }

    submitEcibDefaulterForm() {
        if (this.remarks == '' || this.rawData.length == 0) {
            this.toaster.error("Please include Remarks and Add Files as Well");
            return 0;
        }
        let data = {
            ndc_file: this.Customer.NDCPDFLink,
            ecib_file: this.Customer.ECIBPDFLink,
            Cnic: this.Customer.Cnic,
            FatherName: this.Customer.FatherName,
            Remarks: this.remarks,
            status: 'P'
        };
        this.spinner.show();
        this._customerService.addEligibilityRequest(data, this.tran_id).pipe(
            finalize(() => {
                this.spinner.hide();
            })
        ).subscribe((data) => {
            if (data.Success) {
                this.toaster.success(data.Message);


                this.rawData.forEach((single_file, index) => {
                    this.spinner.show()
                    this._customerService.addFiles(data.EligibilityRequest.Id, single_file).pipe(
                        finalize(() => {
                            this.spinner.hide();
                        })
                    ).subscribe((data) => {
                        if (index + 2 == this.number_of_files) {
                            this.router.navigate(['dashboard']);
                        }
                    });
                });
            } else {
                this.toaster.error(data.Message);
            }
        })
    }

    onFileChange(event, i) {
        if (event.target.files && event.target.files[0]) {
            const filesAmount = event.target.files.length;
            const file = event.target.files[0];
            const Name = file.name.split('.').pop();
            if (Name != undefined) {
                if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'jpeg' || Name.toLowerCase() == 'png') {
                    const reader = new FileReader();
                    reader.onload = (event: any) => {
                        if (this.rawData[i]) {
                            this.rawData.splice(i, 1);
                            this.rawData.splice(i, 0, file);
                        } else {
                            //this.rawData.push(file);
                            this.rawData.splice(i, 0, file);
                        }
                    };
                    reader.readAsDataURL(file);
                    this.number_of_files = this.number_of_files + 1;

                } else {
                    this.layoutUtilsService.alertElement('', 'Only jpeg,jpg and png files are allowed', '99');
                    event.target.files = null;
                    return;
                }
            }
        } else {
            this.rawData.splice(i, 1);
        }


    }
    finger: Finger[] = [
        {Name: 'Right Thumb', value: "1"},
        {Name: 'Right Index Finger', value: "2"},
        {Name: 'Right Middle Finger', value: "3"},
        {Name: 'Right Ring Finger', value: "4"},
        {Name: 'Right Little Finger', value: "5"},
        {Name: 'Left Thumb', value: "6"},
        {Name: 'Left Index Finger', value: "7"},
        {Name: 'Left Middle Finger', value: "8"},
        {Name: 'Left Ring Finger', value: "9"},
        {Name: 'Left Little Finger', value: "10"}
    ];

}
interface Finger {
    Name: string;
    value: string;
}

