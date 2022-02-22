import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CustomerService} from "../../../shared/services/customer.service";
import {LovService} from "../../../shared/services/lov.service";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {errorMessages, Lov, LovConfigurationKey, MaskEnum, regExps} from "../../../shared/classes/lov.class";
import {Store} from "@ngrx/store";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {AppState} from "../../../shared/reducers";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {CircleService} from "../../../shared/services/circle.service";
import {LandService} from "../services/land.service";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreateCustomer} from "../../../shared/models/customer.model";
import {CustomerLandRelation} from 'app/shared/models/customer-land-relation.model';
import {Branch} from 'app/shared/models/branch.model';
import {Zone} from 'app/shared/models/zone.model';
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {ViewMapsComponent} from "../../../shared/component/view-map/view-map.component";
import {Activity} from "../../../shared/models/activity.model";

@Component({
    selector: 'app-cust-land-list',
    templateUrl: './cust-land-list.component.html',
    styleUrls: ['./cust-land-list.component.scss']
})
export class CustLandListComponent implements OnInit {

    final_branch: any;
    final_zone: any;
    single_zone = true;
    selected_z: any;
    disable_zone = true;
    SelectedZones: any;

    disable_branch = true;
    selected_b: any;
    single_branch = true;
    SelectedBranches: any;

    Math: any;
    dataSource = new MatTableDataSource();
    matTableLenght: any;
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;


    displayedColumns = ['BranchCode', 'PassbookNO', 'Cnic', 'CustomerName', 'FatherName', 'IsRedeem', 'StatusDesc', 'View'];

    gridHeight: string;

    OffSet: number;
    ShowViewMore: boolean;
    landSearch: FormGroup;
    myDate = new Date().toLocaleDateString();

    public CustomerLandRelation = new CustomerLandRelation();


    public maskEnums = MaskEnum;
    errors = errorMessages;
    public LovCall = new Lov();
    public LandStatusLov: any;
    _customer: CreateCustomer = new CreateCustomer();
    public Zone: any;
    public Branch = new Branch();
    Zones: any = [];
    Branches: any = [];
    isUserAdmin: boolean = false;
    isZoneUser: boolean = false;
    loggedInUserDetails: any;
    private LoggedInUserInfo: any;
    currentActivity: Activity;

    constructor(private store: Store<AppState>,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                public snackBar: MatSnackBar,
                private filterFB: FormBuilder,
                private router: Router,
                private _landService: LandService,
                private _customerService: CustomerService,
                private _lovService: LovService,
                private cdRef: ChangeDetectorRef,
                private layoutUtilsService: LayoutUtilsService,
                private _circleService: CircleService,
                private spinner: NgxSpinnerService,
                private _cdf: ChangeDetectorRef,
                private userUtilsService: UserUtilsService
    ) {
        this.Math = Math;
    }

    changeZone(changedValue) {
        this.Zone = this.SelectedZones.filter((zone) => zone.ZoneId == changedValue.vaue);
        this.selected_z = changedValue.value;
        let changedZone = {Zone: {ZoneId: changedValue.value}}
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }


    changeBranch(changedValue) {
        this.selected_b = changedValue.value;
        this.Branch = this.SelectedBranches.filter((zone) => zone.BranchCode == changedValue.vaue);
    }

    ngOnInit() {
        this.currentActivity = this.userUtilsService.getActivity('Search Land');
        this.matTableLenght = false;
        this.LoadLovs();
        this.ShowViewMore = false;
        this.createForm();
        var userDetails = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();

        this.loggedInUserDetails = userDetails;
        if (this.loggedInUserDetails?.Branch && this.loggedInUserDetails?.Branch?.BranchCode != "All") {
            this.SelectedBranches = this.loggedInUserDetails?.Branch;
            this.SelectedZones = this.loggedInUserDetails?.Zone;
            this.Zone = this.loggedInUserDetails?.Zone;
            this.Branch = this.loggedInUserDetails?.Branch;
            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode;
            this.landSearch.controls["ZoneId"].setValue(this.SelectedZones?.Id);
            this.landSearch.controls["BranchId"].setValue(this.SelectedBranches?.BranchCode);
        } else if (!this.loggedInUserDetails?.Branch && !this.loggedInUserDetails?.Zone && !this.loggedInUserDetails?.UserCircleMappings) {
            this.spinner.show();
            this.userUtilsService.getZone().subscribe((data: any) => {
                this.Zone = data?.Zones;
                this.SelectedZones = this?.Zone;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();
            });
        }
        //if (userDetails.Branch.BranchCode == "All")
        if (userDetails.User.AccessToData == "1") {
            //admin user
            this.isUserAdmin = true;
        } else if (userDetails.User.AccessToData == "2") {
            //zone user
            this.isZoneUser = true;
        } else {
            //branch
        }
    }


    createForm() {

        this.landSearch = this.filterFB.group({
            PassbookNO: [this.CustomerLandRelation.PassbookNO],
            Cnic: [this.CustomerLandRelation.Cnic, [Validators.pattern(regExps.cnic)]],
            Status: [this.CustomerLandRelation.Status],
            ZoneId: [this.Zone?.ZoneId],
            BranchId: [this.Branch?.BranchCode]
        });
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

                baseResponse.Zones?.forEach(function (value) {
                    value.ZoneName = value.ZoneName.split("-")[1];
                })
                this.Zones = baseResponse.Zones;
                this.SelectedZones = baseResponse.Zones;

                //this.landSearch.controls['ZoneId'].setValue(this.Zones[0].ZoneId);
                //this.GetBranches(this.Zones[0].ZoneId);
                this.loading = false;
                this._cdf.detectChanges();
            } else
                this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

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
            } else
                this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

        });


    }


    searchBranch(branchId) {
        branchId = branchId.toLowerCase();
        if (branchId != null && branchId != undefined && branchId != "")
            this.SelectedBranches = this.Branches.filter(x => x.Name.toLowerCase().indexOf(branchId) > -1);
        else
            this.SelectedBranches = this.Branches;
    }

    validateBranchOnFocusOut() {
        if (this.SelectedBranches.length == 0)
            this.SelectedBranches = this.Branches;
    }


    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 200 + 'px';
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.landSearch.controls[controlName].hasError(errorName);
    }

    searchLand() {

        this.OffSet = 0;
        this.pageIndex = 0;
        this.dataSource.data = [];
        this.SearchLandData();

    }

    searchZone(zoneId) {

        zoneId = zoneId.toLowerCase();
        if (zoneId != null && zoneId != undefined && zoneId != "")
            this.SelectedZones = this.Zones.filter(x => x.ZoneName.toLowerCase().indexOf(zoneId) > -1);
        else
            this.SelectedZones = this.Zones;
    }

    validateZoneOnFocusOut() {
        if (this.SelectedZones.length == 0)
            this.SelectedZones = this.Zones;
    }


    viewMore() {

        this.OffSet = this.OffSet + 1;
        this.SearchLandData();
    }

    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    dv: number | any; //use later
    private assignBranchAndZone() {
        if (this.SelectedBranches.length)
            this.final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0]
        else
            this.final_branch = this.SelectedBranches;
        let zone = null;
        if (this.SelectedZones.length)
            this.final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
        else
            this.final_zone = this.SelectedZones;

    }

    SearchLandData() {

        this.spinner.show();
        this.CustomerLandRelation.Offset = this.OffSet.toString();
        this.CustomerLandRelation.Limit = this.itemsPerPage.toString();
        this.CustomerLandRelation = Object.assign(this.CustomerLandRelation, this.landSearch.value);
        this.assignBranchAndZone();
        this.CustomerLandRelation.BranchId = this.final_branch?.BranchId;
        this.CustomerLandRelation.ZoneId = this.final_zone?.ZoneId;
        this._landService.searchLand(this.CustomerLandRelation, this.isUserAdmin, this.isZoneUser, this.final_branch, this.final_zone)
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
                    this.dv = this.dataSource.data;
                    //this.dataSource = new MatTableDataSource(data);

                    this.totalItems = baseResponse.searchLandData[0].TotalCount;
                    //this.paginate(this.pageIndex) //calling paginate function
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                } else {

                    this.matTableLenght = false;

                    // this.dataSource = this.dv.slice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
                    //this.dataSource.data = [];
                    //this._cdf.detectChanges();
                    this.OffSet = 1;
                    this.pageIndex = 1;
                    // this.dv = this.dv.slice(1, 0);
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
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

    exportToExcel() {
        //this.exportActivities = [];
        //Object.assign(this.tempExportActivities, this.dataSource.data);
        //this.tempExportActivities.forEach((o, i) => {
        //  this.exportActivities.push({
        //    activityName: o.activityName,
        //    activityURL: o.activityURL,
        //    parentActivityName: o.parentActivityName
        //  });
        //});
        //this.excelService.exportAsExcelFile(this.exportActivities, 'activities');
    }

    filterConfiguration(): any {
        const filter: any = {};
        const searchText: string = this.searchInput.nativeElement.value;
        filter.title = searchText;
        return filter;
    }


    CheckEidtStatusOld(Status: any) {

        if (Status == "1" || Status == "4") {
            return true
        } else {
            return false
        }

    }

    CheckViewStatusOld(Status: any) {


        if (Status != "1" && Status != "4") {
            return true
        } else {
            return false
        }

    }


    CheckEidtStatus(land: any) {


        if (land.Status == "1" || land.Status == "4") {
            if (land.EnteredBy == this.loggedInUserDetails.User.UserId) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }

    }

    CheckViewStatus(land: any) {


        if (land.Status != "1" && land.Status != "4") {
            return true
        } else {
            if (land.EnteredBy == this.loggedInUserDetails.User.UserId) {
                return false
            } else {
                return true
            }
        }

    }


    ngOnDestroy() {
    }


    masterToggle() {

    }

    editland(Land: any) {

        //if (this.isUserAdmin) {
        //
        //
        //}

        Land.Branch = this.Branches.filter(x => x.BranchId == Land.BranchId);
        Land.Zone = this.Zones.filter(x => x.ZoneId == Land.ZoneID);
        localStorage.setItem('SearchLandData', JSON.stringify(Land));
        localStorage.setItem('EditLandData', '1');
        this.router.navigate(['../land-info-add', {upFlag: "1"}], {relativeTo: this.activatedRoute});
    }


    async LoadLovs() {

        //this.ngxService.start();

        this.LandStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.LandStatus})


        ////For Bill type
        // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })

        // this.ngxService.stop();

    }

    checkMap(data) {
        if (data?.Lat?.length > 0) {
            if(data.Lat=="0.0"){
                return false;
            }else{
                return true;
            }
        } else {
            return false;
        }
    }

    viewMap(data) {
        const dialogRef = this.dialog.open(ViewMapsComponent, {
            panelClass: ['h-screen', 'max-w-full', 'max-h-full'],
            width: '100%',
            data: data,
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
        });
    }

}
