import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ReportFilters} from "../../report-managment/models/report-filters.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CreateCustomer} from "../../../shared/models/customer.model";
import {errorMessages, Lov, LovConfigurationKey, MaskEnum} from "../../../shared/classes/lov.class";
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {LovService} from "../../../shared/services/lov.service";
import {DeceasedCustomerService} from "../Services/deceased-customer.service";
import {CircleService} from "../../../shared/services/circle.service";
import {finalize} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {HttpParams} from "@angular/common/http";


@Component({
    selector: 'app-search-deceased',
    templateUrl: './search-deceased.component.html',
    styleUrls: ['./search-deceased.component.scss'],
    providers: [DatePipe]
})
export class SearchDeceasedComponent implements OnInit {

    // public Customer = new Customer();

    @Input() isDialog: any = false;
    reportFilter: ReportFilters = new ReportFilters();
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;


    branch: any;
    zone: any;
    circle: any;

    public _apiNameWidth = "350px";
    public _dateWidth = "200px";
    public _IdWidth = "100px";
    gridHeight: string;


    public maskEnums = MaskEnum;
    errors = errorMessages;
    selected_z: any;
    public LovCall = new Lov();
    disable_zone = true;
    // public LandStatusLov: any;
    public CustomerStatusLov: any;
    _customer: CreateCustomer = new CreateCustomer();
    public Zone = new Zone();
    public Branch = new Branch();
    Branches: any = [];
    SelectedBranches: any = [];
    isUserAdmin: boolean = false;
    isZoneUser: boolean = false;
    loggedInUserDetails: any;
    OffSet: number;
    single_zone = true;
    public Customer = new Customer();
    ShowViewMore: boolean;
    deceasedCustomerSearch: FormGroup;
    loading: boolean;
    matTableLenght: any;
    //displayedColumns = ['customer_name', 'father_name', 'death_date', 'Cnic', 'address', 'per_address', 'status', 'branch_code', 'certificate_verified', 'legal_heir'];
    displayedColumns = ['customer_name', 'father_name', 'death_date', 'Cnic', 'address', 'branch_code', 'StatusDesc', 'per_address', 'certificate_verified', 'legal_heir'];

    // dataSource : MatTableDataSource<DeceasedCustomer>

    dataSource = new MatTableDataSource();

    dataSourceEmpty = new MatTableDataSource();
        //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];

    //Branch inventory
    disable_circle = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];
    selected_b;
    selected_c;
    private final_branch: any;
    private final_zone: any;
    entry : any = {}

    constructor(
        private userUtilsService: UserUtilsService,
        private cdRef: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private _deceasedCustomer: DeceasedCustomerService,
        private _lovService: LovService,
        private _circleService: CircleService,
        private _cdf: ChangeDetectorRef,
        private filterFB: FormBuilder,
    ) {
    }


    ngOnInit(): void {
        //this.SearchDeceasedCustomer();
        if (this.isDialog)
            //this.displayedColumns = ['customer_name', 'father_name', 'death_date', 'Cnic', 'address', 'per_address', 'status', 'branch_code', 'certificate_verified', 'legal_heir']
            this.displayedColumns = ['customer_name', 'father_name', 'death_date', 'Cnic', 'address', 'branch_code', 'certificate_verified', 'legal_heir']

        this.matTableLenght = false;
        this.ShowViewMore = false;

        this.LoadLovs();
        this.createForm();
        this.settingZBC();
        // this.settingZBC();
        //var u = new UserUtilsService();
        var userDetails = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.loggedInUserDetails = userDetails;


        //if (userDetails.Branch.BranchCode == "All")

        if (userDetails.User.AccessToData == "2") {
            //admin user
            this.isUserAdmin = true;
            this.GetZones();
        }
        else if (userDetails.User.AccessToData == "1") {
            //zone user
            this.isZoneUser = true;
            this.deceasedCustomerSearch.value.ZoneId = userDetails.Zone.ZoneId;
            this.Zone.ZoneName = userDetails.Zone.ZoneName;
            this.deceasedCustomerSearch.controls.ZoneId.setValue(this.SelectedZones.ZoneName);
            this.deceasedCustomerSearch.controls.BranchId.setValue(this.SelectedBranches.BranchCode);
            this.deceasedCustomerSearch.controls.Zone.setValue(userDetails.Zone.ZoneName);
            this.deceasedCustomerSearch.controls.Branch.setValue(userDetails.Branch.Name);
            this.GetBranches(userDetails.Zone.ZoneId);
        }
        else {
            //branch
            this.Zone.ZoneName = userDetails.Zone.ZoneName;
            this.Branch.Name = userDetails.Branch.Name;
        }

    }

    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 200 + 'px';
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
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
    SearchDeceasedCustomer(){
        this.dataSource.data=[];
        this.assignBranchAndZone();

        this.spinner.show()
        this.Customer = Object.assign(this.Customer, this.deceasedCustomerSearch.value);

        // let zoneData =this.SelectedZones.find(x=>x.ZoneId==this.deceasedCustomerSearch.controls.ZoneId.value)
        // let branchData = this.SelectedBranches.find(x=>x.BranchId==this.deceasedCustomerSearch.controls.BranchId.value)
        // this.entry.Branch = branchData;
        // this.entry.Zone = zoneData;
        // this.entry.Branch = branchData;
        this._deceasedCustomer
            .SearchDeceasedCustomer(this.Customer, this.isUserAdmin, this.isZoneUser, this.final_zone,this.final_branch)
            // .SearchDeceasedCustomer()
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {

                    this.dataSource.data = baseResponse.DeceasedCustomer.DeceasedCustomerInfoList;
                    console.log(this.dataSource.data)

                } else {

                    this.layoutUtilsService.alertElement(
                        "",
                        baseResponse.Message,
                    );
                }
            });
    }



    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    dv: number | any; //use later

    SearchLandData() {
        this.assignBranchAndZone();
        this.spinner.show();
        // this.CustomerLandRelation.Offset = this.OffSet.toString();
        // this.CustomerLandRelation.Limit = this.itemsPerPage.toString();
        //this.landSearch.controls["ZoneId"].setValue(this.Zone.ZoneId);
        //this.landSearch.controls["BranchId"].setValue(this.Branch.BranchCode);

        this.Customer = Object.assign(this.Customer, this.deceasedCustomerSearch.value);

        this._deceasedCustomer.SearchDeceasedCustomer(this.Customer, this.isUserAdmin, this.isZoneUser,this.final_zone,this.final_branch)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {

                if (baseResponse.Success) {
                    this.loading = false;

                    this.dataSource.data = baseResponse.searchLandData;

                    if (this.dataSource.data.length > 0)
                        this.matTableLenght = true;
                    else
                        this.matTableLenght = false;
                    //if (this.dataSource.data.length == 0) {
                    //  this.dataSource.data = baseResponse.searchLandData;
                    //  this.ShowViewMore = true;
                    //}
                    //else {
                    //  for (var i = 0; i < baseResponse.searchLandData.length; i++) {

                    //    this.dataSource.data.push(baseResponse.searchLandData[i]);
                    //  }
                    //  this.dataSource._updateChangeSubscription();
                    //}
                    //pagination
                    this.dv = this.dataSource.data;
                    //this.dataSource = new MatTableDataSource(data);

                    this.totalItems = baseResponse.searchLandData[0].TotalCount;
                    //this.paginate(this.pageIndex) //calling paginate function
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                }
                else {

                    this.matTableLenght = false;

                    this.dataSource = this.dv.slice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
                    //this.dataSource.data = [];
                    //this._cdf.detectChanges();
                    this.OffSet = 1;
                    this.pageIndex = 1;
                    this.dv = this.dv.slice(1,0);
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }

                this.loading = false;
            });

    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        this.OffSet = pageIndex;
        this.SearchLandData();
        //this.dv.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
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
            }
            else
                this.layoutUtilsService.alertElement("", baseResponse.Message);

        });
    }

    SetBranches(branchId) {
        this.Branch.BranchCode = branchId.value;
    }

    GetBranches(ZoneId) {
        this.loading = true;
        this.dataSource.data = [];
        this.Branches = [];

        if (ZoneId.value === undefined)
            this.Zone.ZoneId = ZoneId;
        else
            this.Zone.ZoneId = ZoneId.value;
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

                this.Branches = baseResponse.Branches;
                this.SelectedBranches = baseResponse.Branches;
                //this.landSearch.controls['BranchId'].setValue(this.Branches[0].BranchId);
                this._cdf.detectChanges();
            }

            else
                this.layoutUtilsService.alertElement("", baseResponse.Message);

        });
    }

    createForm() {
        this.deceasedCustomerSearch = this.filterFB.group({
            CustomerName: [this.Customer.CustomerName],
            FatherName: [this.Customer.FatherName],
            // Cnic: [this.Customer.Cnic, [Validators.pattern(regExps.cnic)]],
            Cnic: [this.Customer.Cnic,Validators.pattern("^[0-9]{5}[0-9]{7}[0-9]$")],
            // Validators.pattern("^[0-9]*$"),
            CustomerStatus: [this.Customer.CustomerStatus],
            ZoneId: [this.Zone.ZoneId],
            BranchId: [this.Branch.BranchCode]
        });
    }


    async LoadLovs() {

        //this.ngxService.start();

        this.CustomerStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.DeceasedCustomerStatus})

        this.CustomerStatusLov = this.CustomerStatusLov.LOVs;
        console.log(this.CustomerStatusLov);
        ////For Bill type
        // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })

        // this.ngxService.stop();

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
            this.deceasedCustomerSearch.controls.ZoneId.setValue(this.SelectedZones.ZoneName);
            this.deceasedCustomerSearch.controls.BranchId.setValue(this.SelectedBranches.BranchCode);
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

    changeZone(changedValue) {
        let changedZone = {Zone: {ZoneId: changedValue.value}}
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }

    checkUser() {
        var userInfo = this.userUtilsService.getUserDetails();
        // console.log(userInfo);
        if (userInfo.User.userGroup[0].ProfileID == '56') {
            // this.isMCO = true;
        } else if (userInfo.User.userGroup[0].ProfileID == '57') {
            // this.isBM = true;
            this.deceasedCustomerSearch.controls.Remarks.setValidators(Validators.required);
        }

        this.deceasedCustomerSearch.controls.ZoneId.setValue(userInfo.Zone.ZoneName);
        this.deceasedCustomerSearch.controls.BranchId.setValue(userInfo.Branch.Name);
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
}

export interface DeceasedCustomer{
    CustomerName: string;
    FatherName: string;
    DeathDate: string;
    Cnic: string;
    Address: string;
    PermanentAddress: string;
    Status : string;
    BranchCode: string;
    IsCertificateVerified: string;
    LegalHeairHasIncome: string
}
class Customer {
    CustomerName:string;
    Cnic:string;
    FatherName:string;
    CustomerStatus:string;
}
export class Zone {
    ZoneId: number;
    ZoneName: string;

}
export class Branch {

    BranchId: number;
    BranchCode: string;
    Name: string;

    clear() {

    }
}

