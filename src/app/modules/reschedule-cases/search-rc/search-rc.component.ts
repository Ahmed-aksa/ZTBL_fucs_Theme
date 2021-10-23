/* eslint-disable curly */
/* eslint-disable guard-for-in */
/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable arrow-parens */
/* eslint-disable no-debugger */
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
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { Branch } from 'app/shared/models/branch.model';
import { Loan } from 'app/shared/models/loan-application-header.model';
import { Zone } from 'app/shared/models/zone.model';
import { CircleService } from 'app/shared/services/circle.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LovService } from 'app/shared/services/lov.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { ReschedulingService } from '../service/rescheduling.service';

@Component({
  selector: 'app-search-rc',
  templateUrl: './search-rc.component.html',
  styleUrls: ['./search-rc.component.scss']
})

export class SearchRcComponent implements OnInit {
  loading: boolean;
  loaded = true
  rcSearch: FormGroup;
  LoggedInUserInfo: BaseResponseModel;
  isZoneReadOnly: boolean;
  isBranchReadOnly: boolean;

  Math: any;

  //pagination
  itemsPerPage = 10; //you could use your specified
  totalItems: number | any;
  pageIndex = 1;
  dv: number | any; //use later

  OffSet: any;

  matTableLenght: boolean;

  //Branch inventory
  Branches: any = [];
  SelectedBranches: any = [];
  public Branch = new Branch();
  public search = new Loan();
  public LovCall = new Lov();

  //Loan Status inventory
  LoanStatus: any = [];
  loanStatus: any = [];
  SelectedLoanStatus: any = [];

  //Zone inventory
  Zones: any = [];
  SelectedZones: any = [];
  public Zone = new Zone();
  displayedColumns = [
    "Branch",
    "TransactionDate",
    "LoanApp",
    "GlDescription",
    "Status",
    "Scheme",
    "OldDate",
    "AcStatus",
  ];
  dataSource: MatTableDataSource<SearchRC>;
  ELEMENT_DATA: SearchRC[] = [];
  Mydata: any;

  disable_circle = true;
  disable_zone = true;
  disable_branch = true;
  single_branch = true;
  single_circle = true;
  single_zone = true;
  selected_z;
  selected_b;

  //Zone inventory
  Circles: any = [];
  SelectedCircles: any = [];
  constructor(
    private fb: FormBuilder,
    private userUtilsService: UserUtilsService,
    private _circleService: CircleService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private _reschedulingService: ReschedulingService,
    private spinner: NgxSpinnerService,
    private _lovService: LovService
  ) {
    this.Math = Math;
  }

  ngOnInit() {
    this.create();

    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

    if (this.LoggedInUserInfo.Branch != null) {

      this.Branches = this.LoggedInUserInfo.Branch;
      this.SelectedBranches = this.Branches;

      this.Zone = this.LoggedInUserInfo.Zone;
      this.SelectedZones = this.Zone;

      this.selected_z = this.SelectedZones.ZoneId
      this.selected_b = this.SelectedBranches.BranchCode
      console.log(this.SelectedZones)
      this.rcSearch.controls["Zone"].setValue(this.SelectedZones.ZoneName);
      this.rcSearch.controls["Branch"].setValue(this.SelectedBranches.Name);

    }else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
      this.spinner.show();

      this.userUtilsService.getZone().subscribe((data: any) => {
          this.Zone = data.Zones;
          this.SelectedZones = this.Zone;
          this.single_zone = false;
          this.disable_zone = false;
          this.spinner.hide();

      });}

    debugger;

    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();


    if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
      debugger;
      this.disable_circle = false;
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;
    }
    if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
      this.isZoneReadOnly = true;
      this.isBranchReadOnly = true;
    }
    this.getLoanStatus();
  }

  create() {
    this.rcSearch = this.fb.group({
      Zone: [""],
      Branch: [""],
      TrDate: [""],
      Lcno: [""],
      Status: [""],
    });
  }

  //-------------------------------Loan Status Functions-------------------------------//
  async getLoanStatus() {
    this.LoanStatus = await this._lovService.CallLovAPI(
      (this.LovCall = { TagName: LovConfigurationKey.RescheduleStatus})
    );
    this.SelectedLoanStatus = this.LoanStatus.LOVs.reverse();
    debugger;
    console.log(this.SelectedLoanStatus);
  }

  searchLoanStatus(loanStatusId) {
    debugger;
    loanStatusId = loanStatusId.toLowerCase();
    if (loanStatusId != null && loanStatusId != undefined && loanStatusId != "")
      this.SelectedLoanStatus = this.LoanStatus.LOVs.filter(
        (x) => x.Name.toLowerCase().indexOf(loanStatusId) > -1
      );
    else this.SelectedLoanStatus = this.LoanStatus.LOVs;
  }

  validateLoanStatusOnFocusOut() {
    if (this.SelectedLoanStatus.length == 0)
      this.SelectedLoanStatus = this.LoanStatus;
  }

  find() {
    this.loaded = true
    this.spinner.show();
    this.search = Object.assign(this.rcSearch.getRawValue());
    console.log(this.search)

    debugger;
    this._reschedulingService
      .RescheduleSearch(this.search)
      .pipe(
        finalize(() => {
          this.spinner.hide();
          this.loaded = false
          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        this.dataSource= null
        this.ELEMENT_DATA = []
        if (baseResponse.Success === true) {
          console.log(baseResponse)
          this.loading = false;
          this.Mydata = baseResponse.Loan.ReschedulingSearch
        debugger
        for (let data in this.Mydata) {
          this.ELEMENT_DATA.push({
            branch: this.Mydata[data].OrgUnitName,
            transactionDate: this.Mydata[data].WorkingDate,
            loanApp: this.Mydata[data].LoanCaseNo,
            glDescription: this.Mydata[data].GlDesc,
            status: this.Mydata[data].StatusName,
            scheme: this.Mydata[data].SchemeCode,
            oldDate: this.Mydata[data].LastDueDate,
            acStatus: this.Mydata[data].DisbStatusName,
            
          });
        }
        debugger
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
        console.log(this.dataSource.data)
        if (this.dataSource.data.length > 0)
            this.matTableLenght = true;
          else
            this.matTableLenght = false;
          
          this.dv = this.dataSource.filteredData;
          debugger;
          this.totalItems = this.dataSource.filteredData.length;
          this.OffSet = this.pageIndex;
          this.dataSource = this.dv.slice(0, this.itemsPerPage);
        //console.log(this.dataSource.filteredData.length)
        //console.log(this.dataSource.data.length)
        } else {
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
        }
        this.loading = false;
      });
  }

  paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
    this.itemsPerPage = pageSize;
    this.pageIndex = pageIndex;
    this.OffSet = pageIndex;
    //this.SearchJvData();
    //this.dv.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
    this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
  }
  
  changeBranch(changedValue) {

    let changedBranch = null;
    if (changedValue.has('value')) {
        changedBranch = {Branch: {BranchCode: changedValue.value}}
    } else {
        changedBranch = {Branch: {BranchCode: changedValue}}

    }
}
}


interface SearchRC {
  branch: string;
  transactionDate: string;
  loanApp: string;
  glDescription: string;
  status: string;
  scheme: string;
  oldDate: string;
  acStatus: string;
}
