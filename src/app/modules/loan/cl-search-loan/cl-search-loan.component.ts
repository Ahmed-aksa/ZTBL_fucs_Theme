import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

import { finalize } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { DateFormats, Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { SearchLoan } from 'app/shared/models/Loan.model';
import { MatTableDataSource } from '@angular/material/table';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { LoanService } from 'app/shared/services/loan.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { LovService } from 'app/shared/services/lov.service';



@Component({
  selector: 'kt-cl-search-loan',
  templateUrl: './cl-search-loan.component.html',
  styleUrls: ['./cl-search-loan.component.scss'],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }

  ]
})
export class ClSearchLoanComponent implements OnInit {

  loanSearch: FormGroup;
  loanFilter = new SearchLoan()
  LoggedInUserInfo: BaseResponseModel;
  dataSource = new MatTableDataSource();

  public LovCall = new Lov();

  //Loan Status inventory
  LoanStatus: any = [];
  loanStatus: any = [];
  SelectedLoanStatus: any = [];

  circle : any = [];

  loggedInUserIsAdmin: boolean = false;

  displayedColumns = ['BranchName', 'AppDate', 'AppNumberManual', 'LoanCaseNo', 'ApplicationTitle', 'DevAmount', 'ProdAmount', 'StatusName','Action'];

  gridHeight: string;

    matTableLenght = false;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Math: any;
    loading = false;

    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    dv: number | any; //use later


  constructor(
    private spinner: NgxSpinnerService,
    private filterFB: FormBuilder,
    private _loanService: LoanService,
    private layoutUtilsService: LayoutUtilsService,
    private userUtilsService: UserUtilsService,
    private _lovService: LovService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {
      this.Math = Math;
  }

  ngOnInit() {
    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
    if (this.LoggedInUserInfo.Branch?.BranchCode == "All")
      this.loggedInUserIsAdmin = true;
    this.createForm();
    this.getLoanStatus();
  }


  createForm() {
    this.loanSearch = this.filterFB.group({
      LcNo: [this.loanFilter.LcNo],
      AppNo: [this.loanFilter.AppNo],
      Appdt: [this.loanFilter.Appdt],
      Status: [this.loanFilter.Status, [Validators.required]]
    });
  }

  //-------------------------------Loan Status Functions-------------------------------//
  async getLoanStatus() {
    this.LoanStatus = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.LoanStatus })
    this.SelectedLoanStatus = this.LoanStatus.LOVs;
    console.log(this.SelectedLoanStatus)
  }
  searchLoanStatus(loanStatusId) {
    loanStatusId = loanStatusId.toLowerCase();
    if (loanStatusId != null && loanStatusId != undefined && loanStatusId != "")
      this.SelectedLoanStatus = this.LoanStatus.LOVs.filter(x => x.Name.toLowerCase().indexOf(loanStatusId) > -1);
    else
      this.SelectedLoanStatus = this.LoanStatus.LOVs;
  }
  validateLoanStatusOnFocusOut() {
    if (this.SelectedLoanStatus.length == 0)
      this.SelectedLoanStatus = this.LoanStatus;
  }


  ngAfterViewInit() {
    this.gridHeight = window.innerHeight - 200 + 'px';
  }




  searchLoan() {
    const controls = this.loanSearch.controls;
    if (this.loanSearch.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    Object.keys(controls).forEach(controlName =>
      controls[controlName].value == undefined || controls[controlName].value == null ? controls[controlName].setValue("") : controls[controlName].value
    );

    this.loanFilter = Object.assign(this.loanFilter, this.loanSearch.getRawValue());

    if (!this.loggedInUserIsAdmin) {
      this.loanFilter.ZoneId = this.LoggedInUserInfo.Zone.ZoneId;
      this.loanFilter.BranchId = this.LoggedInUserInfo.Branch.BranchId;
      this.loanFilter.Appdt = this.datePipe.transform(this.loanFilter.Appdt, 'ddMMyyyy')
     // this.circle = this.LoggedInUserInfo.UserCircleMappings;
    }
    this.pageIndex = 1;

    this.spinner.show()
    this._loanService.searchLoanApplication(this.loanFilter)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        if (baseResponse.Success) {
            this.loading = false;
            this.matTableLenght = true;
          this.dataSource.data = baseResponse.Loan.ApplicationHeaderList;

            this.dv = this.dataSource.data;

            this.totalItems = baseResponse.Loan.ApplicationHeaderList.length;
            //this.paginate(this.pageIndex) //calling paginate function
            //this.OffSet = this.pageIndex;
            this.dataSource = this.dv.slice(0, this.itemsPerPage);
        }
        else {
            this.layoutUtilsService.alertElement("", baseResponse.Message);
          this.dataSource = this.dv.splice(1,0);
            this.loading = false;
            this.matTableLenght = false;
        }
      },
        (error) => {
            this.loading = false;
            this.matTableLenght = false;
          this.layoutUtilsService.alertElement("", "Error Occured While Processing Request", "500");
        }
    );

  }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        //this.OffSet = pageIndex;

        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
    }

  editLoan(updateLoan) {
    this.router.navigate(['../create', { LnTransactionID: updateLoan.LoanAppID, Lcno: updateLoan.LoanCaseNo }], { relativeTo: this.activatedRoute });
  }
}
