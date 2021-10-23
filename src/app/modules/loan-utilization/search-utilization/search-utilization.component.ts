
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
  userInfo;
  gridHeight: string;
  loanutilizationSearch: FormGroup;
  myDate = new Date().toLocaleDateString();
  isMCO: boolean = false;
  isBM: boolean = false;
  circle;
  circleNo;
  loggedInUser: any;
  public maskEnums = MaskEnum;
  errors = errorMessages;
  public LovCall = new Lov();
  public CustomerStatusLov: any;
  _customer: CreateCustomer = new CreateCustomer();
  _loanUtilizationSearch = new LoanUtilizationSearch;
  public Zone = new Zone();
  public Branch = new Branch();
  Zones: any = [];
  SelectedZones: any = [];
  Branches: any = [];
  SelectedBranches: any = [];
  isUserAdmin: boolean = false;
  isZoneUser: boolean = false;
  loggedInUserDetails: any;
  loanutilizationStatusLov;

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
    var userDetails = this.userUtilsService.getUserDetails();
    this.loggedInUserDetails = userDetails;

  }

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
    this._circleService.GetCircleByBranchId()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        if (baseResponse.Success) {
          this.circle = baseResponse.Circles;
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
        }
      });
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
  //   debugger

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
    } else {
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
      LoanCaseNo: [""],
      Status: ["", Validators.required],
      CircleId: []
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


  hasError(controlName: string, errorName: string): boolean {
    return this.loanutilizationSearch.controls[controlName].hasError(errorName);
  }

  searchloanutilization() {
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
