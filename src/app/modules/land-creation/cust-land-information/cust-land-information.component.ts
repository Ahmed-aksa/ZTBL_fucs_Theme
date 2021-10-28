import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CreateCustomer} from 'app/shared/models/customer.model';
import {DateFormats, Lov, LovConfigurationKey, MaskEnum} from 'app/shared/classes/lov.class';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LovService} from "../../../shared/services/lov.service";
import {CustomerService} from "../../../shared/services/customer.service";
import {NgxSpinnerService} from "ngx-spinner";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Store} from "@ngrx/store";
import {CommonService} from "../../../shared/services/common.service";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {LandChargeCreationComponent} from "../land-charge-creation/land-charge-creation.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {CustomerListDialogComponent} from "../customer-list-dialog/customer-list-dialog.component";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {AppState} from "../../../shared/reducers";
import {finalize, takeUntil} from "rxjs/operators";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {Subject} from "rxjs";
import {DatePipe} from "@angular/common";
import {CircleService} from "../../../shared/services/circle.service";
import {LandHistoryComponent} from "../land-history/land-history.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LandInfo} from 'app/shared/models/land-info.model';
import {LandInfoDetails} from "../models/land-info-details.model";
import {CustomerLandRelation} from 'app/shared/models/customer_land_relation.model';
import {Zone} from 'app/shared/models/zone.model';
import {LandService} from "../services/land.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {LargeFilesUploadComponent} from "../large-files-upload/large-files-upload.component";
import {AreaConverterComponent} from "../area-converter/area-converter.component";
import {KtDialogService} from "../../../shared/services/kt-dialog.service";

@Component({
    selector: 'app-cust-land-information',
    templateUrl: './cust-land-information.component.html',
    styleUrls: ['./cust-land-information.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}
    ],
})
export class CustLandInformationComponent implements OnInit {
    hasFormErrors = false;
    viewLoading = false;
    loadingAfterSubmit = false;
    ShowTable: boolean = false;
    ShowError: boolean;
    AllowchargeCreation: boolean;
    AllowDocumentUpload: boolean;
    AllowSubmit: boolean;
    SaveCustomer = false;
    remove: boolean;
    errorShow: boolean;
    loading: boolean;
    NumberOfCustomerDisable: boolean;
    submitted = false;
    TrainId: number;
    hasHistoryLandInfoId: boolean = false;
    LandInformationForm: FormGroup;

    final_branch: any;
    final_zone: any;
    /**
     * Zone And Branch functionality
     */
    single_zone = true;
    disable_zone = true;
    SelectedZones: any;
    selected_z: any;
    SelectedBranches: any;
    Branches: any;
    selected_b: any;
    single_branch = true;
    disable_branch = true;
    navigationSubscription;
    public createCustomer = new CreateCustomer();
    public SearchDataCustomer = new CreateCustomer();
    public SearchDataCustomerBackup: CreateCustomer[] = [];
    public maskEnums = MaskEnum;
    public LovCall = new Lov();
    public request = new BaseRequestModel();
    public LandInfo = new LandInfo();
    public LandInfoDetail: LandInfoDetails[] = [];
    alphas: any[] = [];
    public CustomerLandRelation = new CustomerLandRelation();
    public PostCodeLov: any;
    public PostCodeLovFull: any;
    public LandingProcedureLov: any;
    private _onDestroy = new Subject<void>();
    public CustomerLov: any;
    public BranchLov: any;
    public ZoneLov: any;
    public selectedCustomerID: any;
    public errorMessage: any;
    public errorMessageLand: any;
    public searchFilterCtrlPostCode: FormControl = new FormControl();
    public Zone: any;
    // Objects for Get Data
    LandInfoDetailsList: any;
    LandInfoDataList: any;
    ChargeCreation: any;
    ChargeCreationDetailList: any;
    customerLandRelation: any;
    LoginUserInfo: any;
    BArea = ""
    BAreaOwned = "";
    BLeasedIn = "";
    BLeasedOut = "";
    BFimalyOperated = "";
    BUnderCustomhiring = "";
    BTotal = 0;
    // I
    IArea = "";
    IAreaOwned = "";
    ILeasedIn = "";
    ILeasedOut = "";
    IFimalyOperated = "";
    IUnderCustomhiring = "";
    ITotal = 0;
    // U
    UnArea = "";
    UnAreaOwned = "";
    UnLeasedIn = "";
    UnLeasedOut = "";
    UnFimalyOperated = "";
    UnUnderCustomhiring = "";
    UnTotal = 0;
    // UA
    UnAArea = "";
    UnAAreaOwned = "";
    UnALeasedIn = "";
    UnALeasedOut = "";
    UnAFimalyOperated = "";
    UnAUnderCustomhiring = "";
    UnATotal = 0;
    // TA
    AreaTotal: any
    AreaOwnedTotal: any
    LeasedInTotal: any
    LeasedOutTotal: any
    FamilyOperatedTotal: any
    UnderCustomHiringTotal: any
    TotalOfTotal = 0;
    isEditMode: any;
    LandInfoSearchData: any;
    isFormReadonly: boolean;
    zoneLovAll: any;
    branchLovAll: any;
    clearSaveCustomerButtonHide: boolean;
    landDetailMarlaPlaceholder: string = "0";
    dynamicArray: Array<DynamicGrid> = [];
    newDynamic: any = {};
    isLandHistory: boolean;
    today = new Date();
    LoggedInUserInfo: any;

    constructor(
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private _snackBar: MatSnackBar,
        private _lovService: LovService,
        private _landService: LandService,
        private _customerService: CustomerService,
        private route: ActivatedRoute,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userUtilsService: UserUtilsService,
        private cdRef: ChangeDetectorRef,
        private datePipe: DatePipe,
        private spinner: NgxSpinnerService,
        private _common: CommonService,
        private _circleService: CircleService,
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        var CheckEdit = localStorage.getItem("EditLandData");
        if (CheckEdit == '0') {
            localStorage.setItem("SearchLandData", "");
        }
    }

    ngOnInit() {
        this.isEditMode = localStorage.getItem("EditLandData");
        if (this.isEditMode != "0") {
            this.LandInfoSearchData = JSON.parse(localStorage.getItem("SearchLandData"));
        }
        this.LandInfo.LandingProcedure = "IP";
        this.isFormReadonly = false;
        this.AllowchargeCreation = false;
        this.NumberOfCustomerDisable = false;
        this.AllowDocumentUpload = false;
        this.AllowSubmit = false;
        this.ShowError = false;
        this.remove = false;
        this.loading = false;
        this.isLandHistory = false;
        this.LoadLovs();
        this.GetZones();
        this.createForm();
        this.clearSaveCustomerButtonHide = true;
        this.searchFilterCtrlPostCode.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterPostCode();
            });
        var historyLandInfoId = localStorage.getItem("HistoryLandInfoId");
        var upFlag = this.route.snapshot.params['upFlag'];
        if (upFlag == 1 && historyLandInfoId && this.isEditMode == "1") {
            this.hasHistoryLandInfoId = true;
            localStorage.removeItem("HistoryLandInfoId");
            localStorage.setItem('EditLandData', '0');
            this.GetCustomerAllLandInfoHistory(historyLandInfoId);
            this.isLandHistory = true;
        } else if (upFlag == 1 && this.isEditMode == "1") {
            localStorage.setItem('EditLandData', '0');
            this.GetCustomerAllLandInfo(false);
            this.clearSaveCustomerButtonHide = false;
        }
    }

    private assignBranchAndZone() {
        if (this.SelectedBranches?.length)
            this.final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0]
        else
            this.final_branch = this.SelectedBranches;
        if (this.SelectedZones?.length)
            this.final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
        else
            this.final_zone = this.SelectedZones;

    }

    SelectionChangePushData(event: any) {
        var resetTable = true
        this.ShowTable = true
        if (this.isEditMode == '1' && this.alphas.length > 0 && this.TotalOfTotal == 0) {
            this.selectedCustomerID = event.value;
        } else {
            if (this.TotalOfTotal == 0) {
                if (this.selectedCustomerID != undefined && this.selectedCustomerID != '' && this.selectedCustomerID != null) {
                    var Customerdata = this.CustomerLov.filter(x => x.LandCustID == this.selectedCustomerID)[0];
                    this.LandInformationForm.controls['LandCustID'].setValue(Customerdata.LandCustID)
                } else {
                    this.selectedCustomerID = event.value;
                }
                return
            }
        }
        if (this.selectedCustomerID == undefined || this.selectedCustomerID == '' || this.selectedCustomerID == null) {
            this.selectedCustomerID = event.value;
            resetTable = false
        }

        this.getLandDetailTableData()
        var dataFound = this.reloadLandDetailTableData(event.value)
        this.checkForDulpicateCustomerLandDetail()
        if (resetTable && !dataFound) {
            this.clearLandDetailTableData()
        }
        this.selectedCustomerID = event.value;
    }

    reloadLandDetailTableData(customerId: any): boolean {
        var landInfoDetail = [];
        for (var i = 0; i < this.alphas.length; i++) {
            var detail = this.alphas[i]
            if (detail[0].LandCustID == customerId) {
                landInfoDetail = detail;
                break;
            }
        }
        if (landInfoDetail.length == 0)
            return false
        if (this.LandInfoSearchData != undefined && this.LandInfoSearchData != null) {
            if ((this.LandInfoSearchData.Status == '3' || this.LandInfoSearchData.Status == '2' || this.LandInfoSearchData.Status == '1') && this.isEditMode == "1") {
                this.landDetailMarlaPlaceholder = "";
                this.BArea = landInfoDetail[0].Area == "0" ? "" : landInfoDetail[0].Area
                this.BAreaOwned = landInfoDetail[0].AreaOwned == "0" ? "" : landInfoDetail[0].AreaOwned
                this.BFimalyOperated = landInfoDetail[0].FamAreaOpr == "0" ? "" : landInfoDetail[0].FamAreaOpr
                this.BLeasedIn = landInfoDetail[0].LeasedIn == "0" ? "" : landInfoDetail[0].LeasedIn
                this.BLeasedOut = landInfoDetail[0].LeasedOut == "0" ? "" : landInfoDetail[0].LeasedOut
                this.BUnderCustomhiring = landInfoDetail[0].AreaUnderCust == "0" ? "" : landInfoDetail[0].AreaUnderCust
                this.BTotal = landInfoDetail[0].AreaTotal == "0" ? "" : landInfoDetail[0].AreaTotal
                this.IArea = landInfoDetail[1].Area == "0" ? "" : landInfoDetail[1].Area
                this.IAreaOwned = landInfoDetail[1].AreaOwned == "0" ? "" : landInfoDetail[1].AreaOwned
                this.IFimalyOperated = landInfoDetail[1].FamAreaOpr == "0" ? "" : landInfoDetail[1].FamAreaOpr
                this.ILeasedIn = landInfoDetail[1].LeasedIn == "0" ? "" : landInfoDetail[1].LeasedIn
                this.ILeasedOut = landInfoDetail[1].LeasedOut == "0" ? "" : landInfoDetail[1].LeasedOut
                this.IUnderCustomhiring = landInfoDetail[1].AreaUnderCust == "0" ? "" : landInfoDetail[1].AreaUnderCust
                this.ITotal = landInfoDetail[1].AreaTotal == "0" ? "" : landInfoDetail[1].AreaTotal

                this.UnArea = landInfoDetail[2].Area == "0" ? "" : landInfoDetail[2].Area
                this.UnAreaOwned = landInfoDetail[2].AreaOwned == "0" ? "" : landInfoDetail[2].AreaOwned
                this.UnFimalyOperated = landInfoDetail[2].FamAreaOpr == "0" ? "" : landInfoDetail[2].FamAreaOpr
                this.UnLeasedIn = landInfoDetail[2].LeasedIn == "0" ? "" : landInfoDetail[2].LeasedIn
                this.UnLeasedOut = landInfoDetail[2].LeasedOut == "0" ? "" : landInfoDetail[2].LeasedOut
                this.UnUnderCustomhiring = landInfoDetail[2].AreaUnderCust == "0" ? "" : landInfoDetail[2].AreaUnderCust
                this.UnTotal = landInfoDetail[2].AreaTotal == "0" ? "" : landInfoDetail[2].AreaTotal
                this.UnAArea = landInfoDetail[3].Area == "0" ? "" : landInfoDetail[3].Area
                this.UnAAreaOwned = landInfoDetail[3].AreaOwned == "0" ? "" : landInfoDetail[3].AreaOwned
                this.UnAFimalyOperated = landInfoDetail[3].FamAreaOpr == "0" ? "" : landInfoDetail[3].FamAreaOpr
                this.UnALeasedIn = landInfoDetail[3].LeasedIn == "0" ? "" : landInfoDetail[3].LeasedIn
                this.UnALeasedOut = landInfoDetail[3].LeasedOut == "0" ? "" : landInfoDetail[3].LeasedOut
                this.UnAUnderCustomhiring = landInfoDetail[3].AreaUnderCust == "0" ? "" : landInfoDetail[3].AreaUnderCust
                this.UnATotal = landInfoDetail[3].AreaTotal == "0" ? "" : landInfoDetail[3].AreaTotal

                this.AreaTotal = landInfoDetail[4].Area == "0" ? "" : landInfoDetail[4].Area
                this.AreaOwnedTotal = landInfoDetail[4].AreaOwned == "0" ? "" : landInfoDetail[4].AreaOwned
                this.FamilyOperatedTotal = landInfoDetail[4].FamAreaOpr == "0" ? "" : landInfoDetail[4].FamAreaOpr
                this.LeasedInTotal = landInfoDetail[4].LeasedIn == "0" ? "" : landInfoDetail[4].LeasedIn
                this.LeasedOutTotal = landInfoDetail[4].LeasedOut == "0" ? "" : landInfoDetail[4].LeasedOut
                this.UnderCustomHiringTotal = landInfoDetail[4].AreaUnderCust == "0" ? "" : landInfoDetail[4].AreaUnderCust
                this.TotalOfTotal = landInfoDetail[4].AreaTotal == "0" ? "" : landInfoDetail[4].AreaTotal
            } else {
                this.BArea = landInfoDetail[0].Area
                this.BAreaOwned = landInfoDetail[0].AreaOwned
                this.BFimalyOperated = landInfoDetail[0].FamAreaOpr
                this.BLeasedIn = landInfoDetail[0].LeasedIn
                this.BLeasedOut = landInfoDetail[0].LeasedOut
                this.BUnderCustomhiring = landInfoDetail[0].AreaUnderCust
                this.BTotal = landInfoDetail[0].AreaTotal
                this.IArea = landInfoDetail[1].Area
                this.IAreaOwned = landInfoDetail[1].AreaOwned
                this.IFimalyOperated = landInfoDetail[1].FamAreaOpr
                this.ILeasedIn = landInfoDetail[1].LeasedIn
                this.ILeasedOut = landInfoDetail[1].LeasedOut
                this.IUnderCustomhiring = landInfoDetail[1].AreaUnderCust
                this.ITotal = landInfoDetail[1].AreaTotal

                this.UnArea = landInfoDetail[2].Area
                this.UnAreaOwned = landInfoDetail[2].AreaOwned
                this.UnFimalyOperated = landInfoDetail[2].FamAreaOpr
                this.UnLeasedIn = landInfoDetail[2].LeasedIn
                this.UnLeasedOut = landInfoDetail[2].LeasedOut
                this.UnUnderCustomhiring = landInfoDetail[2].AreaUnderCust
                this.UnTotal = landInfoDetail[2].AreaTotal
                this.UnAArea = landInfoDetail[3].Area
                this.UnAAreaOwned = landInfoDetail[3].AreaOwned
                this.UnAFimalyOperated = landInfoDetail[3].FamAreaOpr
                this.UnALeasedIn = landInfoDetail[3].LeasedIn
                this.UnALeasedOut = landInfoDetail[3].LeasedOut
                this.UnAUnderCustomhiring = landInfoDetail[3].AreaUnderCust
                this.UnATotal = landInfoDetail[3].AreaTotal

                this.AreaTotal = landInfoDetail[4].Area
                this.AreaOwnedTotal = landInfoDetail[4].AreaOwned
                this.FamilyOperatedTotal = landInfoDetail[4].FamAreaOpr
                this.LeasedInTotal = landInfoDetail[4].LeasedIn
                this.LeasedOutTotal = landInfoDetail[4].LeasedOut
                this.UnderCustomHiringTotal = landInfoDetail[4].AreaUnderCust
                this.TotalOfTotal = landInfoDetail[4].AreaTotal
            }
        } else {
            this.BArea = landInfoDetail[0].Area
            this.BAreaOwned = landInfoDetail[0].AreaOwned
            this.BFimalyOperated = landInfoDetail[0].FamAreaOpr
            this.BLeasedIn = landInfoDetail[0].LeasedIn
            this.BLeasedOut = landInfoDetail[0].LeasedOut
            this.BUnderCustomhiring = landInfoDetail[0].AreaUnderCust
            this.BTotal = landInfoDetail[0].AreaTotal
            this.IArea = landInfoDetail[1].Area
            this.IAreaOwned = landInfoDetail[1].AreaOwned
            this.IFimalyOperated = landInfoDetail[1].FamAreaOpr
            this.ILeasedIn = landInfoDetail[1].LeasedIn
            this.ILeasedOut = landInfoDetail[1].LeasedOut
            this.IUnderCustomhiring = landInfoDetail[1].AreaUnderCust
            this.ITotal = landInfoDetail[1].AreaTotal

            this.UnArea = landInfoDetail[2].Area
            this.UnAreaOwned = landInfoDetail[2].AreaOwned
            this.UnFimalyOperated = landInfoDetail[2].FamAreaOpr
            this.UnLeasedIn = landInfoDetail[2].LeasedIn
            this.UnLeasedOut = landInfoDetail[2].LeasedOut
            this.UnUnderCustomhiring = landInfoDetail[2].AreaUnderCust
            this.UnTotal = landInfoDetail[2].AreaTotal
            this.UnAArea = landInfoDetail[3].Area
            this.UnAAreaOwned = landInfoDetail[3].AreaOwned
            this.UnAFimalyOperated = landInfoDetail[3].FamAreaOpr
            this.UnALeasedIn = landInfoDetail[3].LeasedIn
            this.UnALeasedOut = landInfoDetail[3].LeasedOut
            this.UnAUnderCustomhiring = landInfoDetail[3].AreaUnderCust
            this.UnATotal = landInfoDetail[3].AreaTotal

            this.AreaTotal = landInfoDetail[4].Area
            this.AreaOwnedTotal = landInfoDetail[4].AreaOwned
            this.FamilyOperatedTotal = landInfoDetail[4].FamAreaOpr
            this.LeasedInTotal = landInfoDetail[4].LeasedIn
            this.LeasedOutTotal = landInfoDetail[4].LeasedOut
            this.UnderCustomHiringTotal = landInfoDetail[4].AreaUnderCust
            this.TotalOfTotal = landInfoDetail[4].AreaTotal
        }
        return true
    }

    clearLandDetailTableData() {

        this.BArea = ""
        this.BAreaOwned = ""
        this.BFimalyOperated = ""
        this.BLeasedIn = ""
        this.BLeasedOut = ""
        this.BUnderCustomhiring = ""
        this.BTotal = 0
        this.IArea = ""
        this.IAreaOwned = ""
        this.IFimalyOperated = ""
        this.ILeasedIn = ""
        this.ILeasedOut = ""
        this.IUnderCustomhiring = ""
        this.ITotal = 0

        this.UnArea = ""
        this.UnAreaOwned = ""
        this.UnFimalyOperated = ""
        this.UnLeasedIn = ""
        this.UnLeasedOut = ""
        this.UnUnderCustomhiring = ""
        this.UnTotal = 0
        this.UnAArea = ""
        this.UnAAreaOwned = ""
        this.UnAFimalyOperated = ""
        this.UnALeasedIn = ""
        this.UnALeasedOut = ""
        this.UnAUnderCustomhiring = ""
        this.UnATotal = 0

        this.AreaTotal = ""
        this.AreaOwnedTotal = ""
        this.FamilyOperatedTotal = ""
        this.LeasedInTotal = ""
        this.LeasedOutTotal = ""
        this.UnderCustomHiringTotal = ""
        this.TotalOfTotal = 0
    }


    changeZone(changedValue) {
        this.LandInfo.Zone = this.SelectedZones.filter((zone) => zone.ZoneId == changedValue.value).ZoneName;
        this.ZoneLov = this.SelectedZones.filter((zone) => zone.ZoneId == changedValue.value).ZoneName;
        let changedZone = {Zone: {ZoneId: changedValue.value}}
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }

    changeBranch(changedValue) {
        this.LandInfo.Branch = this.SelectedBranches.filter((branch) => branch.BranchCode == changedValue.value).Name;
        this.BranchLov = this.SelectedBranches.filter((branch) => branch.BranchCode == changedValue.value);
    }

    private filterPostCode() {
        // get the search keyword
        let search = this.searchFilterCtrlPostCode.value;
        this.PostCodeLov.LOVs = this.PostCodeLovFull.LOVs;
        if (!search) {
            //this.DistrictLov.LOVs.next(this.DistrictLov.LOVs.slice());
            this.PostCodeLov.LOVs = this.PostCodeLovFull.LOVs;
        } else {
            search = search.toLowerCase();
            this.PostCodeLov.LOVs = this.PostCodeLov.LOVs.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
        }
    }

    createForm() {

        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.LoggedInUserInfo = userInfo;
        this.LoginUserInfo = userInfo;
        if (this.LandInfoSearchData !== undefined && this.LandInfoSearchData !== null && this.LandInfoSearchData !== '') {
            this.LandInfo.Id = this.LandInfoSearchData.LandInfoID;
            this.LandInfo.BranchId = this.LandInfoSearchData.BranchId;
            if ((this.LandInfoSearchData.Status == '3' || this.LandInfoSearchData.Status == '2') && this.isEditMode == "1") {
                this.isFormReadonly = true;
                localStorage.setItem("SearchLandData", '');
            }

        }

        this.LandInformationForm = this.formBuilder.group({
            Zone: [this.LandInfo.Zone],
            Branch: [this.LandInfo.Branch],
            PostCode: [this.LandInfo.PostCode, [Validators.required]],
            LandingProcedure: [this.LandInfo.LandingProcedure],
            PassbookNO: [this.LandInfo.PassbookNO, [Validators.required]],
            TotalArea: [this.LandInfo.TotalArea, [Validators.required]],
            DateIssue: [this._common.stringToDate(this.LandInfo.DateIssue), [Validators.required]],
            PlaceofIssuePB: [this.LandInfo.PlaceofIssuePB, [Validators.required]],
            CompleteAddress: [this.LandInfo.CompleteAddress, [Validators.required]],
            LandAutoCode: [this.LandInfo.LandAutoCode],
            NumberOfCustomer: [this.LandInfo.NumberOfCustomer],
            Remarks: [this.LandInfo.Remarks],
            LandCustID: [this.CustomerLandRelation.LandCustID],
        });
        if (this.LoggedInUserInfo.Branch && this.LoggedInUserInfo.Branch.BranchCode != "All") {
            this.SelectedBranches = this.LoggedInUserInfo.Branch;
            this.SelectedZones = this.LoggedInUserInfo.Zone;
            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.LandInformationForm.controls["Zone"].setValue(this.SelectedZones?.Id);
            this.LandInformationForm.controls["Branch"].setValue(this.SelectedBranches?.BranchCode);
            this.LandInfo.Zone = userInfo.Zone.ZoneName;
            this.LandInfo.Branch = userInfo.Branch.Name
            this.BranchLov = userInfo.Branch;
            this.ZoneLov = userInfo.Zone;
        } else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
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

    getTitle(): string {
        return "Customer Land Information"
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.LandInformationForm.controls[controlName].hasError(errorName);
    }

    async LoadLovs() {
        //this.ngxService.start();
        this.PostCodeLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.PostalCode})
        this.PostCodeLovFull = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.PostalCode})
        this.PostCodeLovFull.LOVs = this._lovService.SortLovs(this.PostCodeLovFull.LOVs);

        this.PostCodeLov.LOVs = this._lovService.SortLovs(this.PostCodeLov.LOVs);
        this.LandingProcedureLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.LandingProcedure})
        this.LandingProcedureLov.LOVs = this._lovService.SortLovs(this.LandingProcedureLov.LOVs);
        // var userInfo = this.userUtilsService.getUserDetails();
        // this.BranchLov = userInfo.Branch;
        // this.ZoneLov = userInfo.Zone;
    }

    landChargeCreation() {

        this.LandInfo.Id = this.CustomerLov[0].LandInfoID;
        if (this.LandInfoSearchData != undefined && this.LandInfoSearchData != "") {
            this.LandInfo.Status = this.LandInfoSearchData.Status;
        }
        this.LandInfo.UserId = this.CustomerLov[0].CustomerNumber;
        const dialogRef = this.dialog.open(LandChargeCreationComponent, {
            data: {
                landInfo: this.LandInfo,
                landChargCreation: this.ChargeCreation,
                landChargeCreationDetails: this.ChargeCreationDetailList,
                TrainId: this.TrainId
            }, disableClose: true, panelClass: ['full-screen-modal']
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }

            this.ChargeCreation = res.data.ChargeCreation;
            this.ChargeCreationDetailList = res.data.ChargeCreationDetails;
        });
    }

    landUploadFiles() {

        if (this.CustomerLov != undefined) {
            this.LandInfo.Id = this.CustomerLov[0].LandInfoID;
        }
        if (this.LandInfoSearchData != undefined && this.LandInfoSearchData != "") {
            this.LandInfo.Status = this.LandInfoSearchData.Status;
        }
        const dialogRef = this.dialog.open(LargeFilesUploadComponent, {
            data: {
                landInfo: this.LandInfo,
                landInfoDataList: this.LandInfoDataList,
                TrainId: this.TrainId
            }, disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.LandInfoDataList = res.data.uploadDocumentsData;
            this.spinner.hide();
        });
    }

    AreaConvertor() {

        const dialogRef = this.dialog.open(AreaConverterComponent, {data: {}, disableClose: true});
        dialogRef.afterClosed().subscribe(res => {
            if (res.data.TotalArea != undefined)
                this.LandInformationForm.controls['TotalArea'].setValue(res.data.TotalArea);
            if (!res) {
                return;
            }
        });
    }

    clearSaveCustomerLandInfo() {
        if (this.LandInfo.Id) {
            return;
        }
        this.LandInformationForm.controls['PostCode'].setValue("");
        this.LandInformationForm.controls['LandingProcedure'].setValue("");
        this.LandInformationForm.controls['PassbookNO'].setValue("");
        this.LandInformationForm.controls['TotalArea'].setValue("");
        this.LandInformationForm.controls['DateIssue'].setValue("");
        this.LandInformationForm.controls['PlaceofIssuePB'].setValue("");
        this.LandInformationForm.controls['CompleteAddress'].setValue("");
        this.LandInformationForm.controls['LandAutoCode'].setValue("");
        this.LandInformationForm.controls['LandingProcedure'].setValue("");
        //this.LandInformationForm.controls['NumberOfCustomer'].setValue("");
        //this.deleteAllRows();
        //this.dynamicArray = [];
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
                this.zoneLovAll = baseResponse.Zones;
            } else
                this.layoutUtilsService.alertElement("", baseResponse.Message);
        });
    }

    GetBranches(ZoneId, branchId) {
        this.loading = true;

        this.Zone.ZoneId = ZoneId;
        this._circleService.getBranchesByZone(this.Zone)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {
                this.loading = false;
                //baseResponse.Branches.forEach(function (value) {
                //  value.Name = value.Name.split("-")[1];
                //})
                var branchNameTemp = baseResponse.Branches.filter(x => x.BranchId == branchId)[0]
                this.LandInformationForm.controls['Branch'].setValue(branchNameTemp.Name)
                this.branchLovAll = baseResponse.Branches;
            } else
                this.layoutUtilsService.alertElement("", baseResponse.Message);
        });

    }

    saveCustomerLandInfo() {

        this.errorMessageLand = "";
        this.errorShow = false;
        this.hasFormErrors = false;

        this.LandInfo = Object.assign(this.LandInfo, this.LandInformationForm.getRawValue());
        this.LandInfo.BranchId = this.BranchLov?.BranchId;
        this.LandInfo.DateIssue = this.datePipe.transform(this.LandInfo.DateIssue, "ddMMyyyy");
        if (this.CustomerLov != undefined && this.CustomerLov != "") {
            this.LandInfo.Id = this.CustomerLov[0].LandInfoID;
        }

        this.LandInfo.customerLandRelation = [];

        if (this.LandInfo.NumberOfCustomer != this.SearchDataCustomerBackup.length) {
            this.errorMessageLand = "Number of Customer must be equal to search Customer";
            return;
        }

        for (var i = 0; i < this.SearchDataCustomerBackup.length; i++) {
            var customer = new CustomerLandRelation();
            customer.IsActive = "Y";
            customer.Cnic = this.SearchDataCustomerBackup[i].Cnic;
            customer.LandInfoID = 0;
            customer.BranchId = this.BranchLov.BranchId;
            customer.IsActive = "Y";
            customer.IsOwner = "Y";
            customer.CustomerName = this.SearchDataCustomerBackup[i].CustomerName;
            customer.FatherName = this.SearchDataCustomerBackup[i].FatherName;
            customer.TotalArea = "";
            customer.EnteredBy = "test";
            this.LandInfo.customerLandRelation.push(customer);
        }
        this.assignBranchAndZone();
        this.spinner.show();
        this.LandInfo.TotalArea = parseInt(this.LandInfo.TotalArea).toString();
        this._landService
            .saveCustomerLandInfo(this.LandInfo, this.final_branch, this.final_zone)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.loadingAfterSubmit = false;
                    this.NumberOfCustomerDisable = true;
                    this.CustomerLov = baseResponse.CustomerLandRelationList;
                    //temp
                    this.customerLandRelation = baseResponse.CustomerLandRelationList;
                    this.LandInfo.Id = baseResponse.LandInfo.Id;
                    this.LandInfo.LandAutoCode = baseResponse.LandInfo.LandAutoCode;
                    // this.LandInfo.UserId =
                    this.TrainId = baseResponse.TranId;
                    //adding custLandId in dynamic array
                    this.dynamicArray.forEach(function (part, index) {
                        var tempCustomer = baseResponse.CustomerLandRelationList.filter(x => x.Cnic == this[index].cnic);
                        this[index].LandCustID = tempCustomer[0].LandCustID;
                    }, this.dynamicArray); // use arr as this
                    this.GetCustomerAllLandInfo(true);
                    //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    //this.spinner.hide();
                }
            });
    }

    GetCustomerAllLandInfoHistory(historyLandInfoId: string) {
        this.assignBranchAndZone();
        this.spinner.show();
        this._landService.getLandHistoryDetail(this.LandInfo, historyLandInfoId, this.final_branch, this.final_zone)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    if (this.LoginUserInfo.User.UserId != baseResponse.LandInfo.EnteredBy && this.LoginUserInfo.Branch.BranchCode != "All")
                        this.isFormReadonly = true;

                    this.SaveCustomer = true;
                    this.NumberOfCustomerDisable = true;
                    this.AllowchargeCreation = true;
                    this.AllowDocumentUpload = true;
                    this.AllowSubmit = true;
                    this.LandInfo = baseResponse.LandInfo;
                    this.LandInfo.ZoneName = this.LandInfoSearchData.Zone[0].ZoneId;
                    this.LandInfoDataList = baseResponse.LandInfoDataList;
                    this.LandInfoDetailsList = baseResponse.LandInfoDetailsList;
                    this.ChargeCreation = baseResponse.ChargeCreation;
                    this.ChargeCreationDetailList = baseResponse.ChargeCreationDetailList;
                    this.customerLandRelation = baseResponse.CustomerLandRelationList;
                    this.alphas = [];
                    var areaOwnByAllCustomer = 0
                    if (this.LandInfoDetailsList != undefined) {
                        for (var i = 0; i < this.LandInfoDetailsList.length; i++) {
                            var landData = []
                            for (var j = 0; j < this.LandInfoDetailsList[i].length; j++) {
                                if (this.LandInfoDetailsList[i][j].LandCustID != undefined && this.LandInfoDetailsList[i][j].LandCustID != null &&
                                    this.LandInfoDetailsList[i][j].LandCustID != '') {
                                    landData.push(this.LandInfoDetailsList[i][j])
                                }
                            }
                            if (landData.length > 0) {
                                this.alphas.push(landData)
                                if (landData[4].AreaOwnedTotal != undefined || landData[4].AreaOwnedTotal != null || landData[4].AreaOwnedTotal != '') {
                                    areaOwnByAllCustomer += parseInt(landData[4].AreaOwned)
                                }
                            }
                        }
                    }

                    this.LandInfo.TotalOwnedAreaForChargeCreation = "" + areaOwnByAllCustomer
                    if (this.customerLandRelation != undefined) {

                        for (var i = 0; i < this.customerLandRelation.length; i++) {
                            this.newDynamic = {
                                cnic: this.customerLandRelation[i].Cnic,
                                owner: "",
                                customerName: this.customerLandRelation[i].CustomerName,
                                fatherName: this.customerLandRelation[i].FatherName,
                                area: this.customerLandRelation[i].TotalArea,
                                isReadOnly: true,
                                LandCustID: this.customerLandRelation[i].LandCustID,
                                LandInfoID: this.customerLandRelation[i].LandInfoID
                            };
                            this.dynamicArray.push(this.newDynamic);
                            this.SearchDataCustomerBackup.push(this.customerLandRelation[i])
                        }

                        this.CustomerLov = this.customerLandRelation;
                        this.LandInformationForm.controls['ZoneId'].setValue(this.LandInfo.ZoneID);
                        this.GetBranches(this.LandInfo.ZoneID, this.LandInfo.BranchId);
                        this.LandInformationForm.controls['PostCode'].setValue(this.LandInfo.PostCode);
                        this.LandInformationForm.controls['LandingProcedure'].setValue(this.LandInfo.LandingProcedure);
                        this.LandInformationForm.controls['PassbookNO'].setValue(this.LandInfo.PassbookNO);
                        this.LandInformationForm.controls['TotalArea'].setValue(this.LandInfo.TotalArea);
                        this.LandInformationForm.controls['DateIssue'].setValue(this._common.stringToDate(this.LandInfo.DateIssue));
                        this.LandInformationForm.controls['PlaceofIssuePB'].setValue(this.LandInfo.PlaceofIssuePB);
                        this.LandInformationForm.controls['CompleteAddress'].setValue(this.LandInfo.CompleteAddress);
                        this.LandInformationForm.controls['LandAutoCode'].setValue(this.LandInfo.LandAutoCode);
                        this.LandInformationForm.controls['NumberOfCustomer'].setValue(this.customerLandRelation.length);
                        this.LandInformationForm.controls['Remarks'].setValue(this.LandInfo.Remarks);

                        this.cdRef.detectChanges();
                    } else
                        this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            });
        this.cdRef.detectChanges();
    }

    GetCustomerAllLandInfo(showSuccessDialog: Boolean) {
        if (!showSuccessDialog) {
            this.spinner.show();
        }
        this.assignBranchAndZone();
        this._landService.getCustomerAllLandInfo(this.LandInfo, this.final_branch, this.final_zone)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {

                    if (this.LoginUserInfo.User.UserId != baseResponse.LandInfo.EnteredBy && this.LoginUserInfo.Branch.BranchCode != "All")
                        this.isFormReadonly = true;

                    this.SaveCustomer = true;
                    this.NumberOfCustomerDisable = true;
                    this.AllowchargeCreation = true;
                    this.AllowDocumentUpload = true;
                    this.AllowSubmit = true;
                    this.LandInfo = baseResponse.LandInfo;
                    this.LandInfoDataList = baseResponse.LandInfoDataList;
                    this.LandInfoDetailsList = baseResponse.LandInfoDetailsList;
                    this.ChargeCreation = baseResponse.ChargeCreation;
                    this.ChargeCreationDetailList = baseResponse.ChargeCreationDetailList;
                    this.customerLandRelation = baseResponse.CustomerLandRelationList;
                    this.dynamicArray = []
                    this.SearchDataCustomerBackup = []
                    this.alphas = [];
                    var areaOwnByAllCustomer = 0
                    if (this.LandInfoDetailsList != undefined) {
                        for (var i = 0; i < this.LandInfoDetailsList.length; i++) {
                            var landData = []
                            for (var j = 0; j < this.LandInfoDetailsList[i].length; j++) {
                                if (this.LandInfoDetailsList[i][j].LandCustID != undefined && this.LandInfoDetailsList[i][j].LandCustID != null &&
                                    this.LandInfoDetailsList[i][j].LandCustID != '') {
                                    landData.push(this.LandInfoDetailsList[i][j])
                                }
                            }
                            if (landData.length > 0) {
                                this.alphas.push(landData)
                                if (landData[4].AreaOwnedTotal != undefined || landData[4].AreaOwnedTotal != null || landData[4].AreaOwnedTotal != '') {
                                    areaOwnByAllCustomer += parseInt(landData[4].AreaOwned)
                                }
                            }
                        }
                    }

                    this.LandInfo.TotalOwnedAreaForChargeCreation = "" + areaOwnByAllCustomer
                    if (this.customerLandRelation != undefined) {

                        for (var i = 0; i < this.customerLandRelation.length; i++) {
                            this.newDynamic = {
                                cnic: this.customerLandRelation[i].Cnic,
                                owner: "",
                                customerName: this.customerLandRelation[i].CustomerName,
                                fatherName: this.customerLandRelation[i].FatherName,
                                area: this.customerLandRelation[i].TotalArea,
                                isReadOnly: true,
                                LandCustID: this.customerLandRelation[i].LandCustID,
                                LandInfoID: this.customerLandRelation[i].LandInfoID
                            };
                            this.dynamicArray.push(this.newDynamic);
                            this.SearchDataCustomerBackup.push(this.customerLandRelation[i])
                        }

                        this.CustomerLov = this.customerLandRelation;
                        //var ZoneNameTemp = this.zoneLovAll.filter(x => x.ZoneId == this.LandInfo.Zone);
                        this.LandInformationForm.controls['ZoneId'].setValue(this.LandInfo.ZoneID);
                        this.GetBranches(this.LandInfo.ZoneID, this.LandInfo.BranchId);
                        //this.LandInformationForm.controls['Branch'].setValue(this.LandInfo.Branch);
                        this.LandInformationForm.controls['PostCode'].setValue(this.LandInfo.PostCode);
                        this.LandInformationForm.controls['LandingProcedure'].setValue(this.LandInfo.LandingProcedure);
                        this.LandInformationForm.controls['PassbookNO'].setValue(this.LandInfo.PassbookNO);
                        this.LandInformationForm.controls['TotalArea'].setValue(this.LandInfo.TotalArea);
                        this.LandInformationForm.controls['DateIssue'].setValue(this._common.stringToDate(this.LandInfo.DateIssue));
                        this.LandInformationForm.controls['PlaceofIssuePB'].setValue(this.LandInfo.PlaceofIssuePB);
                        this.LandInformationForm.controls['CompleteAddress'].setValue(this.LandInfo.CompleteAddress);
                        this.LandInformationForm.controls['LandAutoCode'].setValue(this.LandInfo.LandAutoCode);
                        this.LandInformationForm.controls['NumberOfCustomer'].setValue(this.customerLandRelation.length);
                        this.LandInformationForm.controls['Remarks'].setValue(this.LandInfo.Remarks);

                        this.cdRef.detectChanges();

                        if (showSuccessDialog) {
                            this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                        }
                    } else
                        this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            });
        this.cdRef.detectChanges();
    }

    checkForDulpicateCustomerLandDetail() {

        var index = []
        for (var i = 0; i < this.alphas.length; i++) {
            var landInfoDetails = this.alphas[i]
            if (landInfoDetails[0].LandCustID == this.selectedCustomerID) {
                index.push(i)
            }
        }
        if (index.length > 1) {
            var j = index[0]
            this.alphas.splice(j, 1);
        }
    }

    saveCustomerLandInfoDetails() {

        this.errorMessage = "";
        this.getLandDetailTableData();
        this.checkForDulpicateCustomerLandDetail()

        if (this.CustomerLov.length != this.alphas.length) {
            this.errorMessage = "Please enter the land detail for all customers"
            return
        }
        var totalArea = 0
        var totalOwnedArea = 0;
        var enteredArea = parseInt(this.LandInfo.TotalArea);
        //this.CustomerLov = this.SearchDataCustomerBackup;
        for (var i = 0; i < this.alphas.length; i++) {
            var landInfoDetails = this.alphas[i]
            totalArea = totalArea + parseInt(landInfoDetails[4].AreaTotal);
            totalOwnedArea = totalOwnedArea + parseInt(landInfoDetails[4].AreaOwned);
        }

        if (totalArea != enteredArea) {
            this.errorMessage = "Area of all the custmer must be equal to the entered Area Owned<br/>" +
                "Area Owner = " + enteredArea + "<br/>Total Area of all the customers = " + totalArea
            return
        } else {
            this.spinner.show();
            this._landService
                .saveCustomerLandInfoDetail(this.alphas, this.TrainId)
                .pipe(
                    finalize(() => {
                        this.submitted = false;
                        this.spinner.hide();
                    })
                )
                .subscribe((baseResponse: BaseResponseModel) => {

                    if (baseResponse.Success === true) {
                        this.AllowchargeCreation = true;
                        this.AllowDocumentUpload = true;
                        this.AllowSubmit = true;
                        this.loadingAfterSubmit = false;
                        this.LandInfo.TotalOwnedAreaForChargeCreation = totalOwnedArea.toString();
                        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                    } else {
                        this.layoutUtilsService.alertElement("", baseResponse.Message);
                    }
                });
        }
    }

    submitCustomerLandInfo() {
        this.spinner.show();
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.LandInfo.Remarks = this.LandInformationForm.controls["Remarks"].value;
        this.request.LandInfo = this.LandInfo;
        //this.request.LandInfo.Remarks = "";
        this.request.TranId = this.TrainId;
        this._landService
            .SubmitLandInfo(this.request)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                    this.router.navigate(['/dashboard'], {relativeTo: this.activatedRoute});
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            });
    }

    searchCustomer(index) {
        this.assignBranchAndZone();
        var customerSearchArray = this.dynamicArray[index];
        if (customerSearchArray.cnic == '' || customerSearchArray.cnic == undefined || customerSearchArray.cnic == null) {
            return;
        }
        var duplicateCustomer = this.SearchDataCustomerBackup.filter(x => x.Cnic == customerSearchArray.cnic)[0];
        if (duplicateCustomer != undefined && duplicateCustomer != null) {
            this.layoutUtilsService.alertElement("", "Customer CNIC Already Added", "Duplicate Cutomer");
            return;
        }
        this.createCustomer.CustomerStatus = 'A';
        this.createCustomer.Cnic = customerSearchArray.cnic;

        this._customerService
            .searchCustomer(this.createCustomer, this.final_branch, this.final_zone)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.SaveCustomer = true;
                    this.SearchDataCustomer = baseResponse.Customers[0];
                    this.dynamicArray[index].customerName = this.SearchDataCustomer.CustomerName;
                    this.dynamicArray[index].fatherName = this.SearchDataCustomer.FatherName;
                    this.dynamicArray[index].Customer_Id = this.SearchDataCustomer.CustomerNumber;
                    this.dynamicArray[index].isReadOnly = true;
                    this.SearchDataCustomerBackup.push(this.SearchDataCustomer);
                    this.cdRef.detectChanges();
                } else {

                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            });

    }

    onKey(event: any) {
        var value = event.target.value;
        if (value == undefined || value == null || value == '') {
            return
        }
        // if(this.dynamicArray.length > value){
        //   this.dynamicArray.length = 0;
        // }
        value = parseInt(value);
        //this.SearchDataCustomerBackup.splice(value, 1);
        if (this.dynamicArray.length > value) {
            var tempValueCount = this.dynamicArray.filter(item => item.cnic != '').length;
            if (tempValueCount > value) {
                this.layoutUtilsService.alertElement("", "There are some customers present in below list and you entered number less than already present. Please remove some customers to continue");
            }
            this.dynamicArray = this.dynamicArray.filter(item => item.cnic != '');
            event.target.value = this.dynamicArray.length;
            this.LandInformationForm.controls["NumberOfCustomer"].setValue(this.dynamicArray.length);
        } else {
            var length = this.dynamicArray.length
            for (var j = length; j < value; j++) {
                this.newDynamic = {
                    cnic: "",
                    owner: "",
                    customerName: "",
                    fatherName: "",
                    area: "",
                    CnicFieldEnabled: false
                };
                this.dynamicArray.push(this.newDynamic);
            }
        }
    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    getUserInput(userInput: any): any {
        if (userInput == undefined || userInput == '') {
            return '0'
        }
        return userInput
    }

    onKeyInputCalculateValue(event: any) {

        this.BTotal = 0;

        this.BAreaOwned = this.BArea;
        this.BTotal = +parseInt(this.getUserInput(this.BAreaOwned)) + parseInt(this.getUserInput(this.BLeasedIn)) +
            parseInt(this.getUserInput(this.BFimalyOperated)) + parseInt(this.getUserInput(this.BUnderCustomhiring)) -
            parseInt(this.getUserInput(this.BLeasedOut));
        this.ITotal = 0;
        this.IAreaOwned = this.IArea;
        this.ITotal = +parseInt(this.getUserInput(this.IAreaOwned)) + parseInt(this.getUserInput(this.ILeasedIn)) + parseInt(this.getUserInput(this.IFimalyOperated)) + parseInt(this.getUserInput(this.IUnderCustomhiring)) - parseInt(this.getUserInput(this.ILeasedOut));
        this.UnTotal = 0;
        this.UnAreaOwned = this.UnArea;
        this.UnTotal = +parseInt(this.getUserInput(this.UnAreaOwned)) + parseInt(this.getUserInput(this.UnLeasedIn)) + parseInt(this.getUserInput(this.UnFimalyOperated)) + parseInt(this.getUserInput(this.UnUnderCustomhiring)) - parseInt(this.getUserInput(this.UnLeasedOut));
        this.UnATotal = 0;
        this.UnAAreaOwned = this.UnAArea;
        this.UnATotal = +parseInt(this.getUserInput(this.UnAAreaOwned)) + parseInt(this.getUserInput(this.UnALeasedIn)) + parseInt(this.getUserInput(this.UnAFimalyOperated)) + parseInt(this.getUserInput(this.UnAUnderCustomhiring)) - parseInt(this.getUserInput(this.UnALeasedOut));

        this.AreaTotal = 0;
        this.AreaTotal = +parseInt(this.getUserInput(this.BArea)) + parseInt(this.getUserInput(this.IArea)) + parseInt(this.getUserInput(this.UnArea)) + parseInt(this.getUserInput(this.UnAArea));
        this.AreaOwnedTotal = 0;
        this.AreaOwnedTotal = +parseInt(this.getUserInput(this.BAreaOwned)) + parseInt(this.getUserInput(this.IAreaOwned)) + parseInt(this.getUserInput(this.UnAreaOwned)) + parseInt(this.getUserInput(this.UnAAreaOwned));
        this.LeasedInTotal = 0;
        this.LeasedInTotal = +parseInt(this.getUserInput(this.BLeasedIn)) + parseInt(this.getUserInput(this.ILeasedIn)) + parseInt(this.getUserInput(this.UnLeasedIn)) + parseInt(this.getUserInput(this.UnALeasedIn));
        this.LeasedOutTotal = 0;
        this.LeasedOutTotal = +parseInt(this.getUserInput(this.BLeasedOut)) + parseInt(this.getUserInput(this.ILeasedOut)) + parseInt(this.getUserInput(this.UnLeasedOut)) + parseInt(this.getUserInput(this.UnALeasedOut));
        this.FamilyOperatedTotal = 0;
        this.FamilyOperatedTotal = +parseInt(this.getUserInput(this.BFimalyOperated)) + parseInt(this.getUserInput(this.IFimalyOperated)) + parseInt(this.getUserInput(this.UnFimalyOperated)) + parseInt(this.getUserInput(this.UnAFimalyOperated));
        this.UnderCustomHiringTotal = 0;
        this.UnderCustomHiringTotal = +parseInt(this.getUserInput(this.BUnderCustomhiring)) + parseInt(this.getUserInput(this.IUnderCustomhiring)) + parseInt(this.getUserInput(this.UnUnderCustomhiring)) + parseInt(this.getUserInput(this.UnAUnderCustomhiring));
        this.TotalOfTotal = +this.BTotal + this.ITotal + this.UnTotal + this.UnATotal;

    }

    getLandObject(Customerdata: any): LandInfoDetails {
        var landDetails = new LandInfoDetails();
        var BranchID = this.BranchLov.BranchId;
        landDetails.BranchID = BranchID;
        landDetails.CustomerNumber = Customerdata.CustomerNumber;
        landDetails.IsOwner = "Y";
        landDetails.LandCustID = Customerdata.LandCustID;
        landDetails.LandInfoDetailID = 0;
        landDetails.LandInfoID = Customerdata.LandInfoID;
        landDetails.LandUnit = 1;
        return landDetails
    }

    getLandDetailTableData() {

        if (this.isEditMode == '1' && this.alphas.length > 0 && this.TotalOfTotal == 0) {
            return
        }
        if (this.TotalOfTotal == 0) {
            var Customerdata = this.CustomerLov.filter(x => x.LandCustID == this.selectedCustomerID)[0];
            this.errorMessage = "Please enter land details for " + Customerdata.CustomerName
            return
        }
        this.LandInfoDetail = [];
        var Customerdata = this.CustomerLov.filter(x => x.LandCustID == this.selectedCustomerID)[0];
        var LandDetails = this.getLandObject(Customerdata)
        LandDetails.Area = this.BArea
        LandDetails.AreaOwned = this.BAreaOwned
        LandDetails.FamAreaOpr = this.BFimalyOperated
        LandDetails.LeasedIn = this.BLeasedIn
        LandDetails.LeasedOut = this.BLeasedOut
        LandDetails.LandTypeID = 1;
        LandDetails.AreaUnderCust = this.BUnderCustomhiring
        LandDetails.AreaTotal = this.BTotal;

        this.LandInfoDetail.push(LandDetails);
        var LandDetails = this.getLandObject(Customerdata)

        LandDetails.Area = this.IArea
        LandDetails.AreaOwned = this.IAreaOwned
        LandDetails.FamAreaOpr = this.IFimalyOperated
        LandDetails.LeasedIn = this.ILeasedIn
        LandDetails.LeasedOut = this.ILeasedOut
        LandDetails.AreaUnderCust = this.IUnderCustomhiring
        LandDetails.LandTypeID = 2;
        LandDetails.AreaTotal = this.ITotal;
        this.LandInfoDetail.push(LandDetails);
        var LandDetails = this.getLandObject(Customerdata)

        LandDetails.Area = this.UnArea
        LandDetails.AreaOwned = this.UnAreaOwned
        LandDetails.FamAreaOpr = this.UnFimalyOperated
        LandDetails.LeasedIn = this.UnLeasedIn
        LandDetails.LeasedOut = this.UnLeasedOut
        LandDetails.AreaUnderCust = this.UnUnderCustomhiring
        LandDetails.LandTypeID = 3;
        LandDetails.AreaTotal = this.UnTotal;
        this.LandInfoDetail.push(LandDetails);
        var LandDetails = this.getLandObject(Customerdata)
        LandDetails.Area = this.UnAArea
        LandDetails.AreaOwned = this.UnAAreaOwned
        LandDetails.FamAreaOpr = this.UnAFimalyOperated
        LandDetails.LeasedIn = this.UnALeasedIn
        LandDetails.LeasedOut = this.UnALeasedOut
        LandDetails.AreaUnderCust = this.UnAUnderCustomhiring
        LandDetails.LandTypeID = 4;
        LandDetails.AreaTotal = this.UnATotal;
        this.LandInfoDetail.push(LandDetails);
        var LandDetails = this.getLandObject(Customerdata)
        LandDetails.Area = this.AreaTotal;
        LandDetails.AreaOwned = this.AreaOwnedTotal;
        LandDetails.FamAreaOpr = this.FamilyOperatedTotal;
        LandDetails.LeasedIn = this.LeasedInTotal;
        LandDetails.LeasedOut = this.LeasedOutTotal;
        LandDetails.AreaUnderCust = this.UnderCustomHiringTotal;
        LandDetails.LandTypeID = 5;
        LandDetails.AreaTotal = this.TotalOfTotal;
        this.LandInfoDetail.push(LandDetails);

        this.alphas.push(this.LandInfoDetail);
    }

    deleteRow(index) {
        if (this.dynamicArray.length > 1) {
            if (this.dynamicArray[index].LandCustID != null && this.dynamicArray[index].LandCustID != "") {
                this.spinner.show();
                var tempCustLandInfo = this.customerLandRelation.filter(x => x.Cnic == this.dynamicArray[index].cnic);
                var indexCustLandInfo = this.customerLandRelation.indexOf(tempCustLandInfo[0])
                var indexCustLov = this.CustomerLov.indexOf(tempCustLandInfo[0])
                var indexAlphas = -1;
                if (this.alphas != undefined) {
                    this.alphas.forEach((item, key) => {
                        if (item[0].LandCustID == tempCustLandInfo[0].LandCustID)
                            indexAlphas = key;
                    });
                }

                this._landService.deleteCustomerWithLand(this.dynamicArray[index].LandCustID)
                    .pipe(
                        finalize(() => {
                            this.spinner.hide();
                        })
                    ).subscribe((baseResponse: BaseResponseModel) => {
                    if (baseResponse.Success === true) {
                        this.SearchDataCustomerBackup.splice(indexCustLandInfo, 1)
                        this.CustomerLov.splice(indexCustLov, 1);
                        this.alphas.splice(indexAlphas, 1);
                        if (this.dynamicArray[index].LandCustID == this.selectedCustomerID) {
                            // B
                            this.BArea = ""
                            this.BAreaOwned = "";
                            this.BLeasedIn = "";
                            this.BLeasedOut = "";
                            this.BFimalyOperated = "";
                            this.BUnderCustomhiring = "";
                            this.BTotal = 0;
                            this.IArea = "";
                            this.IAreaOwned = "";
                            this.ILeasedIn = "";
                            this.ILeasedOut = "";
                            this.IFimalyOperated = "";
                            this.IUnderCustomhiring = "";
                            this.ITotal = 0;
                            this.UnArea = "";
                            this.UnAreaOwned = "";
                            this.UnLeasedIn = "";
                            this.UnLeasedOut = "";
                            this.UnFimalyOperated = "";
                            this.UnUnderCustomhiring = "";
                            this.UnTotal = 0;
                            this.UnAArea = "";
                            this.UnAAreaOwned = "";
                            this.UnALeasedIn = "";
                            this.UnALeasedOut = "";
                            this.UnAFimalyOperated = "";
                            this.UnAUnderCustomhiring = "";
                            this.UnATotal = 0;
                            this.AreaTotal = "";
                            this.AreaOwnedTotal = "";
                            this.LeasedInTotal = "";
                            this.LeasedOutTotal = "";
                            this.FamilyOperatedTotal = "";
                            this.UnderCustomHiringTotal = "";
                            this.TotalOfTotal = 0;
                        }

                        this.dynamicArray[index].cnic = "";
                        this.dynamicArray[index].owner = "";
                        this.dynamicArray[index].customerName = "";
                        this.dynamicArray[index].fatherName = "";
                        this.dynamicArray[index].area = "";
                        this.dynamicArray[index].LandCustID = "";
                        this.dynamicArray[index].LandInfoID = "";
                        this.dynamicArray[index].isReadOnly = false;
                        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                    } else {
                        this.layoutUtilsService.alertElement("", baseResponse.Message);
                    }
                });
            } else {
                var tempCust = this.SearchDataCustomerBackup.filter(x => x.Cnic == this.dynamicArray[index].cnic);
                if (tempCust != null && tempCust.length > 0) {
                    var tempIndex = this.SearchDataCustomerBackup.indexOf(tempCust[0]);
                    this.SearchDataCustomerBackup.splice(tempIndex, 1);
                }
                this.dynamicArray[index].cnic = "";
                this.dynamicArray[index].owner = "";
                this.dynamicArray[index].customerName = "";
                this.dynamicArray[index].fatherName = "";
                this.dynamicArray[index].area = "";
                this.dynamicArray[index].isReadOnly = false;

                return true;
            }
        } else {
            this.layoutUtilsService.alertElement("", "Atleast one record is required.");
            return true;
        }
    }

    ViewLandHistory() {

        if (this.CustomerLov != undefined) {
            this.LandInfo.Id = this.CustomerLov[0].LandInfoID;
        }
        let url = "/land-creation/land-info-history/" + this.LandInfo.Id
        this.router.navigateByUrl(url);
    }

    viewCustomrePage() {
        const dialogRef = this.dialog.open(CustomerListDialogComponent, {width: "85%", data: {}, disableClose: true});
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
        });
    }

    popupCenter = ({url, title, w, h}) => {
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        const systemZoom = width / window.screen.availWidth;
        const left = (width - w) / 2 / systemZoom + dualScreenLeft
        const top = (height - h) / 2 / systemZoom + dualScreenTop
        const newWindow = window.open(url, title,
            `
      scrollbars=yes,
      width=${w / systemZoom},
      height=${h / systemZoom},
      top=${top},
      left=${left}
      `
        )
        if (window.focus) newWindow.focus();
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }
}

export class DynamicGrid {
    cnic: string;
    owner: string;
    customerName: string;
    fatherName: string;
    area: string;
    isReadOnly: boolean;
    LandCustID: string;
    LandInfoID: string;
    Customer_Id: string;
}
