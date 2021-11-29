import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer, Documents, MarkDeceasedCustomer} from "../../../shared/models/deceased_customer.model";
import {MatTableDataSource} from "@angular/material/table";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {CircleService} from "../../../shared/services/circle.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DeceasedCustomerService} from "../../../shared/services/deceased-customer.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CommonService} from "../../../shared/services/common.service";
import {DatePipe} from "@angular/common";
import {finalize} from "rxjs/operators";
import {ViewFileComponent} from "../../deceased-customer/view-file/view-file.component";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";

@Component({
    selector: 'app-eligibility-logs',
    templateUrl: './eligibility-logs.component.html',
    styleUrls: ['./eligibility-logs.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats},
        {
            provide: MatDialogRef,
            useValue: {}
        },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {}
        },
    ],
})
export class EligibilityLogsComponent implements OnInit {


    customerForm: FormGroup;
    //matElects: FormGroup;

    displayedColumns = [
        "lcno",
        "gl",
        "scm",
        "crp",
        "rate",
        "disb_date",
        "disb_amt",
        "principal",
        "tot_markup",
        "markup_rec",
        "other_charges",
        "legal_charges",
        "balance",
    ];

    create_circ_form: FormGroup;
    branch: any;
    zone: any;
    circle: any;

    visible: any = true;
    hasFormErrors = false;
    isEmpty: boolean = false;
    viewerOpen = false;
    txtValue: string = null;
    len: string = null;
    deceasedCustomerID = null
    public markDeceasedCustomer = new MarkDeceasedCustomer();
    imageUrl: any;
    file: File;
    rawData = new Documents();
    errorShow: boolean;
    viewOnly: boolean;
    single_zone = true
    disable_zone = true
    public Zone = new Zone();
    selected_b;
    Circles: any = [];
    SelectedCircles: any = [];
    disable_circle = true;
    Branches: any = [];
    SelectedBranches: any = [];
    selected_z: any;
    selected_c: any;
    SelectedZones: any = [];
    disable_branch = true;
    single_branch = true;
    loading: boolean;
    private _cdf: ChangeDetectorRef
    Zones: any = [];


    dataSource: MatTableDataSource<DeceasedCust>;
    LoggedInUserInfo: BaseResponseModel;

    ELEMENT_DATA: DeceasedCust[] = [];
    isEditMode;
    myModel: boolean = false;
    DeceasedCustomerInf;
    DeceasedCustomerDisbursementRecoveries = [];
    DeceasedCustomerAttachedFile = [];
    url: string
    public deceasedInfo = new Customer();

    cnicn;
    name;
    select: Selection[] = [
        {value: "0", viewValue: "NO"},
        {value: "1", viewValue: "Yes"},
    ];
    private loggedInUserDetails: any;
    private final_branch: any;
    private final_zone: any;
    isUserAdmin: boolean = false;


    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userUtilsService: UserUtilsService,
        private cdRef: ChangeDetectorRef,
        private _circleService: CircleService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private _deceasedCustomer: DeceasedCustomerService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private _common: CommonService,
        private datePipe: DatePipe,
    ) {

        router.events.subscribe((val: any) => {
            if (val.url == "/deceased-customer/customers") {
            }
        });

    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    ngAfterViewInit() {
        // this.GetDisbursement();
        if (this.route.snapshot.params["LnTransactionID"] != null) {

            this.GetReshTransaction()
        }
    }

    //to disable future date
    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }

    GetReshTransaction() {

        this.spinner.show();
        this.cnicn = this.route.snapshot.params["LnTransactionID"];
        this.name = this.route.snapshot.params["CustomerName"];
        if (this.route.snapshot.params["ViewObj"]) {
            this.viewOnly = true;
        }
        this.deceasedInfo.Cnic = this.cnicn
        this.deceasedInfo.CustomerName = this.name

        this._deceasedCustomer
            .GetDeceasedCustomer(this.deceasedInfo, this.final_branch, this.final_zone)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {

                    this.isEmpty = true;
                    this.DeceasedCustomerInf = baseResponse.DeceasedCustomer.DeceasedCustomerInfo;
                    this.deceasedCustomerID = baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeceasedID
                    this.customerForm.controls["DateofDeath"].setValue(this._common.stringToDate(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeathDate));
                    this.customerForm.controls["Cn"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.Cnic);
                    this.customerForm.controls["Cnic"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.Cnic);
                    this.customerForm.controls["CustomerName"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.CustomerName);
                    this.customerForm.controls["FatherName"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.FatherName);
                    this.customerForm.controls["NadraNo"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.NadraNo);
                    this.customerForm.controls["MakerRemarks"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.MakerRemarks);
                    if (baseResponse.DeceasedCustomer.DeceasedCustomerInfo.IsCertificateVerified == "Y") {
                        this.myModel = true
                        this.customerForm.controls["IsNadraCertificateVerified"].setValue(true);
                    } else {
                        this.myModel = false
                        this.customerForm.controls["IsNadraCertificateVerified"].setValue(false);
                    }
                    this.dataSource = baseResponse.DeceasedCustomer.DeceasedCustomerDisbursementRecoveries;
                    //
                    this.DeceasedCustomerAttachedFile = baseResponse.ViewDocumnetsList
                } else {
                    this.isEmpty = false;

                    this.layoutUtilsService.alertElement(
                        "",
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
    }


    ngOnInit() {
        this.createForm();
        this.settingZBC();
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if (userInfo.User.AccessToData == "1") {
            //admin user
            this.isUserAdmin = true;
            this.GetZones();
        }
        this.customerForm.controls.Zone.setValue(userInfo.Zone.ZoneName);
        this.customerForm.controls.Branch.setValue(userInfo.Branch.Name);
        //this.elementsFormControls();.
        //
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }


    GetZones() {

        this.loading = true;
        this._circleService.getZones()
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {

            if (baseResponse.Success) {

                baseResponse.Zones.forEach(function (value) {
                    value.ZoneName = value.ZoneName.split("-")[1];
                })
                this.Zones = baseResponse.Zones;
                this.SelectedZones = baseResponse.Zones;

                //this.landSearch.controls['ZoneId'].setValue(this.Zones[0].ZoneId);
                //this.GetBranches(this.Zones[0].ZoneId);
                this.loading = false;
                this._cdf.detectChanges();
            } else
                this.layoutUtilsService.alertElement("", baseResponse.Message);

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

    changeBranch(changedValue) {
        let changedBranch = null;
        if (changedValue.value)
            changedBranch = {Branch: {BranchCode: changedValue.value}}
        else
            changedBranch = {Branch: {BranchCode: changedValue}}

        this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {

            this.Circles = data.Circles;
            this.SelectedCircles = this.Circles;
            this.disable_circle = false;
            if (changedValue.value) {
                // this.getBorrower();
            }
        });
    }

    private assignBranchAndZone() {


        //Branch
        if (this.SelectedBranches.length) {
            this.final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0];
            this.loggedInUserDetails.Branch = this.final_branch;
        } else {
            this.final_branch = this.SelectedBranches;
            this.loggedInUserDetails.Branch = this.final_branch;
        }
        //Zone
        if (this.SelectedZones.length) {
            this.final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
            this.loggedInUserDetails.Zone = this.final_zone;
        } else {
            this.final_zone = this.SelectedZones;
            this.loggedInUserDetails.Zone = this.final_zone;
        }

    }


    hasError(controlName: string, errorName: string): boolean {
        //
        return this.customerForm.controls[controlName].hasError(errorName);
    }

    createForm() {


        this.customerForm = this.fb.group({
            ZoneId: ["", Validators.required],
            BranchId: ["", Validators.required],
            PPNo: [""],
            Cnic: [""],
            DateofDeath: ['', Validators.required],
            NadraNo: ['', Validators.required],
            DetailSourceIncome: [''],
            CustomerName: [''],
            Cn: [''],
            FatherName: [''],
            MakerRemarks: ['', Validators.required],
            IsNadraCertificateVerified: [''],
            IsReferredBack: [''],
            LegalHeirPay: ['', Validators.required],
            file: [''],
            DeceasedID: [''],


        });

        this.customerForm.controls["DetailSourceIncome"].disable();
    }

    onFileChange(event) {

        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            this.file = event.target.files[0];

            var Name = this.file.name.split('.').pop();
            if (Name != undefined) {
                if (Name.toLowerCase() == "jpg" || Name.toLowerCase() == "jpeg" || Name.toLowerCase() == "png") {
                    var reader = new FileReader();

                    reader.onload = (event: any) => {
                        this.rawData.file = this.file;
                        this.imageUrl = event.target.result;
                        this.visible = false;
                    }


                    reader.readAsDataURL(this.file);

                } else {
                    this.layoutUtilsService.alertElement("", "Only jpeg,jpg and png files are allowed", "99");

                    return;
                }
            }
        } else {
            this.visible = true;
        }


    }

    // onChange(e){
    //
    // }

    onChang(e) {

        if (e == false) {
            this.myModel = true
            // this.customerForm.controls["IsNadraCertificateVerified"].setValue(this.myModel);
        } else {
            this.myModel = false
            // this.customerForm.controls["IsNadraCertificateVerified"].setValue(this.myModel);
        }

    }

    previewImg() {
        // for(var a=0 ; this.DeceasedCustomerAttachedFile.length > a; a++)
        // {
        //
        //   if(id == this.DeceasedCustomerAttachedFile[a].ID)
        //   {
        //
        //     this.url = this.DeceasedCustomerAttachedFile[a].Path
        //   }
        // }

        const dialogRef = this.dialog.open(ViewFileComponent, {
            width: '90%',
            height: '90%',
            data: {documentView: this.DeceasedCustomerAttachedFile, url: this.imageUrl}
        });
    }

    find() {
        this.assignBranchAndZone();
        this.spinner.show();
        this._deceasedCustomer
            .GetDeceasedCustomer(this.customerForm.value, this.final_branch, this.final_zone)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.isEmpty = true;

                    var json = JSON.stringify(baseResponse.DeceasedCustomer);

                    // console.log()
                    this.DeceasedCustomerInf = baseResponse.DeceasedCustomer.DeceasedCustomerInfo;
                    //

                    this.deceasedCustomerID = baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeceasedID
                    this.customerForm.controls["DateofDeath"].setValue(this._common.stringToDate(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeathDate));
                    // this.DateofDeath = baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeathDate;
                    this.customerForm.controls["Cn"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.Cnic);
                    this.customerForm.controls["CustomerName"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.CustomerName);
                    this.customerForm.controls["FatherName"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.FatherName);
                    this.customerForm.controls["NadraNo"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.NadraNo);
                    this.customerForm.controls["DeceasedID"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeceasedID);
                    this.customerForm.controls["MakerRemarks"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.MakerRemarks);

                    if (baseResponse.DeceasedCustomer.DeceasedCustomerInfo.IsCertificateVerified == "Y") {
                        this.myModel = true
                    } else {
                        this.myModel = false
                    }

                    // if(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.LegalHeirPay == "Y")
                    // {
                    // this.customerForm.controls["DeceasedID"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeceasedID);
                    // }
                    // else {
                    //   this.myModel = false
                    // }


                    this.dataSource = baseResponse.DeceasedCustomer.DeceasedCustomerDisbursementRecoveries;


                    //this.savedFiles =
                    this.DeceasedCustomerAttachedFile = baseResponse.ViewDocumnetsList


                } else {

                    this.layoutUtilsService.alertElement(
                        "",
                        baseResponse.Message,
                        baseResponse.Code = null
                    );
                }
            });
    }

    settingZBC() {

        this.loggedInUserDetails = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if (this.loggedInUserDetails.Branch && this.loggedInUserDetails.Branch.BranchCode != "All") {
            this.SelectedCircles = this.loggedInUserDetails.UserCircleMappings;

            this.SelectedBranches = this.loggedInUserDetails.Branch;
            this.SelectedZones = this.loggedInUserDetails.Zone;

            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.customerForm.controls.ZoneId.setValue(this.SelectedZones.ZoneName);
            this.customerForm.controls.BranchId.setValue(this.SelectedBranches.BranchCode);
            // if (this.customerForm.value.Branch) {
            //     this.changeBranch(this.customerForm.value.Branch);
            // }
        } else if (!this.loggedInUserDetails.Branch && !this.loggedInUserDetails.Zone && !this.loggedInUserDetails.Zone) {
            this.spinner.show();
            this.userUtilsService.getZone().subscribe((data: any) => {
                this.Zone = data?.Zones;
                this.SelectedZones = this?.Zone;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();
            });
        }
    }

    viewDocument(id) {

        for (var a = 0; this.DeceasedCustomerAttachedFile.length > a; a++) {

            if (id == this.DeceasedCustomerAttachedFile[a].ID) {

                this.url = this.DeceasedCustomerAttachedFile[a].Path
            }
        }

        const dialogRef = this.dialog.open(ViewFileComponent, {
            width: '50%',
            height: '50%',
            data: {documentView: this.DeceasedCustomerAttachedFile, url: this.url}
        });
    }

    OnChangeDisable(value) {
        if (value == "0") {
            this.customerForm.controls["DetailSourceIncome"].reset();
            this.customerForm.controls["DetailSourceIncome"].disable();
            this.markDeceasedCustomer.OtherSourceOfIncome = null;
        } else if (value == "1") {
            this.customerForm.controls["DetailSourceIncome"].reset();
            this.customerForm.controls["DetailSourceIncome"].enable();
            this.customerForm.controls["DetailSourceIncome"].setValidators(Validators.required);
            this.customerForm.controls["DetailSourceIncome"].updateValueAndValidity();
        } else {
            this.customerForm.controls["DetailSourceIncome"].reset();
            this.customerForm.controls["DetailSourceIncome"].disable();
            this.markDeceasedCustomer.OtherSourceOfIncome = null;
        }
    }

    // onTextChange(value)
    // {
    //   this.txtValue = value;
    //   this.customerForm.reset();
    //   if(this.txtValue == '')
    //   {
    //     this.isEmpty = true;
    //   }

    // }


    changed(value) {
        this.len = value.target.value;
        if (this.len.length <= 13) {
            //this.customerForm.reset();
            this.isEmpty = false;

            this.customerForm.markAsUntouched();
            this.customerForm.markAsPristine();
        }
    }

    MarkAsDeceasedCustomer() {


        this.errorShow = false;
        this.hasFormErrors = false;

        if (this.customerForm.invalid) {
            const controls = this.customerForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }

        if (this.customerForm.controls["IsNadraCertificateVerified"].value == "true") {
            this.customerForm.controls["IsNadraCertificateVerified"].setValue("N");
        } else {
            this.customerForm.controls["IsNadraCertificateVerified"].setValue("Y");
        }

        if (this.DeceasedCustomerInf.Status == "4") {
            if (this.file == undefined) {
                this.file = this.DeceasedCustomerAttachedFile[0].Path

            }
            this.customerForm.controls["IsReferredBack"].setValue("1");
        }


        this.markDeceasedCustomer = Object.assign(this.markDeceasedCustomer, this.customerForm.value);
        //if(this.deceasedCustomerID != null){
        //  this.markDeceasedCustomer.DeceasedID = this.deceasedCustomerID
        //}
        if (this.customerForm.controls["LegalHeirPay"].value == 0) {
            this.markDeceasedCustomer.LegalHeirPay = "N";
        } else {
            this.markDeceasedCustomer.LegalHeirPay = "Y";
        }
        if (this.DeceasedCustomerInf.Status != undefined && this.DeceasedCustomerInf.Status != "4") {
            // if(!this.deceasedCustomerID == null){
            //   var Message;
            //   var Code;
            //   this.layoutUtilsService.alertElement("", Message="Please Attach Image",Code=null);
            // }
            if (!this.customerForm.controls.file.value || !this.DeceasedCustomerAttachedFile) {
                var Message;
                var Code;
                this.layoutUtilsService.alertElement("", Message = "Please Attach Image", Code = null);
            } else {

                this.spinner.show();
                this._deceasedCustomer
                    .MarkAsDeceasedCustomer(this.markDeceasedCustomer, this.file)
                    .pipe(finalize(() => {
                        this.spinner.hide();
                    }))
                    .subscribe((baseResponse) => {
                        if (baseResponse.Success) {

                            this.layoutUtilsService.alertElementSuccess(
                                "",
                                Message = "Information Saved Successfully",
                                baseResponse.Code = null
                            );
                            this.router.navigateByUrl('deceased-customer/search')
                        } else {

                            this.layoutUtilsService.alertElement(
                                "",
                                baseResponse.Message,
                                baseResponse.Code = null
                            );

                        }
                    });
            }
        } else {


            if (!this.customerForm.controls.file.value && !this.DeceasedCustomerAttachedFile) {
                var Message;
                var Code;
                this.layoutUtilsService.alertElement("", Message = "Please Attach Image", Code = null);
            } else {
                this.markDeceasedCustomer.DeceasedID = this.deceasedCustomerID;
                this.spinner.show();

                this._deceasedCustomer
                    .MarkAsDeceasedCustomer(this.markDeceasedCustomer, this.file)
                    .pipe(finalize(() => {
                        this.spinner.hide();
                    }))
                    .subscribe((baseResponse) => {
                        if (baseResponse.Success) {

                            this.layoutUtilsService.alertElementSuccess(
                                "",
                                Message = "Information Saved Successfully",
                                baseResponse.Code = null
                            );
                            this.router.navigateByUrl('deceased-customer/search')
                        } else {

                            this.layoutUtilsService.alertElement(
                                "",
                                baseResponse.Message,
                                baseResponse.Code = null
                            );

                        }
                    });
            }
        }
    }

}

export interface Selection {
    value: string;
    viewValue: string;
}

export interface DeceasedCust {
    LoanCaseNo: string;
    GlDescription: string;
    SchemeCode: string;
    CropCode: string;
    IntRate: string;
    DisbDate: string;
    DisbursedAmount: string;
    RecoverdPrincipal: string;
    ToDateMarkup: string;
    RecoveredMarkup: string;
    OtherReceiveable: string;
    LegalChargesReceiveable: string;
    Balance: string;
}

function stringToDate(DeathDate: any) {
    throw new Error("Function not implemented.");
}

export class Zone {
    ZoneId: number;
    ZoneName: string;

}
