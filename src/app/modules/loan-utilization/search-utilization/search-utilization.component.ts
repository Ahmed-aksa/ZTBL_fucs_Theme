
import { DatePipe } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { errorMessages, Lov, LovConfigurationKey, MaskEnum } from 'app/shared/classes/lov.class';
import { Branch } from 'app/shared/models/branch.model';
import { CreateCustomer } from 'app/shared/models/customer.model';
import { LoanUtilizationSearch } from 'app/modules/loan-utilization/Model/loan-utilization.model';
import { CircleService } from 'app/shared/services/circle.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LovService } from 'app/shared/services/lov.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Zone } from '../../user-management/users/utils/zone.model'
import {LoanUtilizationService} from "../service/loan-utilization.service";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import { Circle } from 'app/shared/models/circle.model';

@Component({
  selector: 'kt-search-utilization',
  templateUrl: './search-utilization.component.html',
  providers: [LoanUtilizationService, DatePipe]
})
export class SearchUtilizationComponent implements OnInit {

  dataSource = new MatTableDataSource();
  @Input() isDialog: any = false;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;


  //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob', 'CustomerStatus', 'View'];
  //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob','CustomerStatus', 'View'];

  displayedColumns = ["LoanCaseNo",
    // "GlCode",
    "Status",
    "Remarks",
    "Lng",
    "Lat",
    "Actions",]
  gridHeight: string;
  loanutilizationSearch: FormGroup;
  myDate = new Date().toLocaleDateString();
  isMCO: boolean = false;
  isBM: boolean = false;
  isAdmin:boolean=false;
  circle;
  circleNo;
  loggedInUser: any;
  public maskEnums = MaskEnum;
  errors = errorMessages;
  public LovCall = new Lov();
  public CustomerStatusLov: any;
  _customer: CreateCustomer = new CreateCustomer();
  _loanUtilizationSearch = new LoanUtilizationSearch;
  isUserAdmin: boolean = false;
  isZoneUser: boolean = false;
  loggedInUserDetails: any;
  loanutilizationStatusLov;

    //Start ZBC

    LoggedInUserInfo: BaseResponseModel;
    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();
    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;
    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];
    public Circle = new Circle();
    selected_b;
    selected_z;
    selected_c;

    //final
    final_branch: any;
    final_zone: any;
    final_cricle: any;

    //End ZBC


  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    private filterFB: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _loanutilizationService: LoanUtilizationService,
    private _lovService: LovService,
    private layoutUtilsService: LayoutUtilsService,
    private _circleService: CircleService,
    private _cdf: ChangeDetectorRef,
    private userUtilsService: UserUtilsService) { this.loggedInUser = userUtilsService.getUserDetails(); }

  ngOnInit() {
      var userDetails = this.userUtilsService.getUserDetails();
      this.loggedInUserDetails = userDetails;
    this.setUsers()
    if (this.isDialog)
      this.displayedColumns = ["LoanCaseNo",
        // "GlCode",
        "Status",
        "Remarks",
        "Lng",
        "Lat",
        "Actions",]
    //else
    //  this.displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CurrentAddress', 'CustomerStatus', 'View']

    this.LoadLovs();
    this.createForm();
    this.setCircles();
    this.settingZBC();


  }
    //Start ZBC
    userInfo = this.userUtilsService.getUserDetails();

    settingZBC(){

        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if (this.LoggedInUserInfo.Branch && this.LoggedInUserInfo.Branch.BranchCode != "All") {
            this.SelectedCircles = this.LoggedInUserInfo.UserCircleMappings;

            this.SelectedBranches = this.LoggedInUserInfo.Branch;
            this.SelectedZones = this.LoggedInUserInfo.Zone;

            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.loanutilizationSearch.controls["Zone"].setValue(this.SelectedZones?.Id);
            this.loanutilizationSearch.controls["Branch"].setValue(this.SelectedBranches?.BranchCode);
            this.loanutilizationSearch.controls["Circle"].setValue(this.SelectedCircles?.Id);
            // if (this.customerForm.value.Branch) {
            //     this.changeBranch(this.customerForm.value.Branch);
            // }
        } else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.UserCircleMappings) {
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

    private assignBranchAndZone() {
        
        //Circle
        if (this.SelectedCircles.length) {
            this.final_cricle = this.SelectedCircles?.filter((circ) => circ.Id == this.selected_c)[0]
            this.userInfo.Circles = this.final_cricle;
        } else {
            this.final_cricle = this.SelectedCircles;
            this.userInfo.Circles = this.final_cricle;
        }
        //Branch
        if (this.SelectedBranches.length) {
            this.final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0];
            this.userInfo.Branch = this.final_branch;
        } else {
            this.final_branch = this.SelectedBranches;
            this.userInfo.Branch = this.final_branch;
        }
        //Zone
        if (this.SelectedZones.length) {
            this.final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
            this.userInfo.Zone = this.final_zone;
        } else {
            this.final_zone = this.SelectedZones;
            this.userInfo.Zone = this.final_zone;
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


    changeBranch(changedValue){
        
        let changedBranch = null;
        if (changedValue.value)
            changedBranch = {Branch: {BranchCode: changedValue.value}}
        else
            changedBranch = {Branch: {BranchCode: changedValue}}

        this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {
            this.Circles = data.Circles;
            this.SelectedCircles = this.Circles;
            // this.selected_c = this.SelectedCircles?.Id
            this.disable_circle = false;
            if (changedValue.value) {
                // this.getBorrower();
            }
        });
    }

    //End ZBC

  setUsers() {
    var userInfo = this.userUtilsService.getUserDetails();
    this.userInfo = this.userUtilsService.getUserDetails();
    // console.log(userInfo);
    //MCO User
    if (userInfo.User.userGroup[0].ProfileID == "56") {
      this.isMCO = true;
    }

    if (userInfo.User.userGroup[0].ProfileID == "57") {
      this.isBM = true;
    }
      if (userInfo.User.userGroup[0].ProfileID == "9999999") {
          this.isAdmin = true;
      }

    if (this.isUserAdmin || this.isZoneUser) {
      userInfo.Branch = {};
      if (this.Branch.BranchCode != undefined)
        userInfo.Branch.BranchId = this.Branch.BranchCode;
      else
        userInfo.Branch.BranchId = 0;
    }
    if (this.isUserAdmin) {
      userInfo.Zone = {};
      if (this.Zone.ZoneId != undefined)
        userInfo.Zone.ZoneId = this.Zone.ZoneId
      else
        userInfo.Zone.ZoneId = 0;
    }
    //BM User
    // if(userInfo.User.userGroup[0].ProfileID=="56"){
    //   this.isMCO=true;
    // }else{
    //   this.isMCO=false;
    // }

  }

  setCircles() {
      var userInfo = this.userUtilsService.getUserDetails();
      if(userInfo.User.userGroup[0].ProfileID != "9999999"){
          this._circleService.GetCircleByBranchId()
              .pipe(
                  finalize(() => {
                      this.loading = false;
                  })
              )
              .subscribe(baseResponse => {
                  if (baseResponse.Success) {
                      this.circle = baseResponse.Circles;
                  } else {
                      this.layoutUtilsService.alertElement("", baseResponse.Message);
                  }
              });
      }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridHeight = window.innerHeight - 400 + 'px';
    //var userInfo = this.userUtilsService.getUserDetails();
    //this.loanutilizationSearch.controls['Zone'].setValue(userInfo.Zone.ZoneName);
    //this.loanutilizationSearch.controls['Branch'].setValue(userInfo.Branch.Name);
  }

  // CheckEditStatus(loanUtilization: any) {
  //   

  //   if () {
  //     return true
  //   }
  //   else {
  //     return false
  //   }
  // }

  CheckEditStatus(loanUtilization: any) {
    this.loggedInUserDetails.User.UserId
    if (this.isMCO) {
      if (loanUtilization.Status == "P" || loanUtilization.Status == "R") {
        if (loanUtilization.CreatedBy == this.loggedInUserDetails.User.UserId) {
          return true
        }
        else {
          return false
        }
      } else {
        return false;
      }
    }
    else if (this.isBM) {
      if (loanUtilization.Status == "S") {
        return true
      }
    } else {
      return false
    }
  }

  CheckViewStatus(loanUtilization: any) {

    if (this.isMCO) {
      if (loanUtilization.Status == "C" || loanUtilization.Status == "S" || loanUtilization.Status == "A") {
        if (loanUtilization.CreatedBy == this.loggedInUserDetails.User.UserId) {
          return true
        }
        else {
          return false
        }
      } else {
        return false;
      }
    }
    else if (this.isBM) {
      if (loanUtilization.Status == "C" || loanUtilization.Status == "P" || loanUtilization.Status == "R" || loanUtilization.Status == "A") {
        return true
      }
    }
    else if(this.isAdmin){
    return true
    }
    else {
      return false
    }

  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  createForm() {
    var userInfo = this.userUtilsService.getUserDetails();
    this.loanutilizationSearch = this.filterFB.group({
      Zone: [userInfo?.Zone?.ZoneName],
      Branch: [userInfo?.Branch?.Name],
      Circle:[],
      LoanCaseNo: [""],
      Status: ["", Validators.required],
      CircleId: []
    });

  }



  SetBranches(branchId) {
    this.Branch.BranchCode = branchId.value;

  }


  hasError(controlName: string, errorName: string): boolean {
    return this.loanutilizationSearch.controls[controlName].hasError(errorName);
  }

  searchloanutilization() {
      if (!this.loanutilizationSearch.controls.Zone.value) {
          var Message = 'Please select Zone';
          this.layoutUtilsService.alertElement(
              '',
              Message,
              null
          );
          return;
      }

      if (!this.loanutilizationSearch.controls.Branch.value) {
          var Message = 'Please select Branch';
          this.layoutUtilsService.alertElement(
              '',
              Message,
              null
          );
          return;
      }

      this.assignBranchAndZone();
    this.spinner.show();
    // this._customer.clear();
    // console.log(this.loanutilizationSearch.controls["Status"].value);
    if (!this.loanutilizationSearch.controls["Status"].value) {
      this.loanutilizationSearch.controls["Status"].setValue("All")
    }
    this._loanUtilizationSearch = Object.assign(this.loanutilizationSearch.value);
    this._loanutilizationService.searchUtilization(this._loanUtilizationSearch, this.userInfo)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        if (baseResponse.Success) {
          this.dataSource.data = baseResponse.LoanUtilization["Utilizations"];
          console.log(this.dataSource.data)
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
          this.dataSource.data = []
        }
      });
  }



  getStatus(status: string) {

    if (status == 'P') {
      return "Submit";
    }
    else if (status == 'N') {
      return "Pending";
    }
    else if (status == 'A') {
      return "Authorized";
    }
    else if (status == 'R') {
      return "Refer Back";
    }
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



  ngOnDestroy() {
  }

  masterToggle() {

  }


  editloanutilization(utilization: any) {

    this.router.navigate(['/loan-utilization/loan-uti'], {
      state: { example: utilization },
      relativeTo: this.activatedRoute
    });
  }


  viewloanutilization(utilization: any) {
    utilization.view = "1";
    this.router.navigate(['/loan-utilization/loan-uti'], {
      state: { example: utilization },
      relativeTo: this.activatedRoute
    });
  }

  async LoadLovs() {

    this.loanutilizationStatusLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.UtilizationTypes })
    // console.log(this.CustomerStatusLov.LOVs);
    this.loanutilizationStatusLov.LOVs.forEach(function (value) {
      if (!value.Value)
        value.Value = "All";
    });



  }

}
