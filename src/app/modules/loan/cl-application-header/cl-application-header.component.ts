import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateFormats, Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';
import { Loan, LoanApplicationHeader } from 'app/shared/models/Loan.model';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { Circle } from 'app/shared/models/circle.model';
import { Branch } from 'app/shared/models/branch.model';
import { CircleService } from 'app/shared/services/circle.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { LoanService } from 'app/shared/services/loan.service';

import {Zone} from '../../../modules/user-management/users/utils/zone.model'
import { CommonService } from 'app/shared/services/common.service';
import { LovService } from 'app/shared/services/lov.service';
@Component({
  selector: 'kt-cl-application-header',
  templateUrl: './cl-application-header.component.html',
  styleUrls: ['./cl-application-header.component.scss'],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }

  ]
})
export class ClApplicationHeaderComponent implements OnInit {

  //Global Variables
  //@Input() childMessage: string;

    zone: any;
    branch: any;
    circle: any;

  @Input() loanAppHeaderDetails: any;

  applicationHeaderForm: FormGroup;
  public loanApplicationHeader = new LoanApplicationHeader();

  today = new Date();
  hasFormErrors = false;
  LoggedInUserInfo: BaseResponseModel;
  public LovCall = new Lov();
  public LoanDetail = new Loan();

  isCheckLcInProgress: boolean;
  isSaveApplicationHeaderInProgress: boolean;
  Zones: any = [];
  SelectedZones: any = [];
  public Zone = new Zone();
  Circles: any = [];
  SelectedCircles: any = [];
  public Circle = new Circle();
  Branches: any = [];
  SelectedBranches: any = [];
  public Branch = new Branch();
  LoanTypes: any = [];
  loanType: any = [];
  SelectedLoanType: any = [];

  //Loan Category inventory
  LoanCategories: any = [];
  loanCategory: any = [];
  SelectedLoanCategory: any = [];
  @Output() applicationCall: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private _circleService: CircleService,
    private _cdf: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private userUtilsService: UserUtilsService,
    private _loanService: LoanService,
    private datePipe: DatePipe,
    private _common: CommonService,
    private _lovService: LovService,
    private spinner: NgxSpinnerService
  )
  {
  }

  ngOnInit() {
    this.spinner.show();
    this.isCheckLcInProgress = false;
    this.isSaveApplicationHeaderInProgress = false;

    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();



    //-------------------------------Loading Zone-------------------------------//


    //-------------------------------Loading Circle-------------------------------//

    if (this.LoggedInUserInfo.Branch?.BranchCode != "All")
    {
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;
    }

    //-------------------------------Loading Loan Type-------------------------------//
    this.getLoanType();

    //-------------------------------Loading Loan Category-------------------------------//
    this.getLoanCategory();

    //-------------------------------Creating Form-------------------------------//
    this.createForm();

    this.spinner.hide();
   // this.getLcNoAutoAssignedByApi();
  }
    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }
  //-------------------------------Form Level Functions-------------------------------//
  createForm() {
    this.applicationHeaderForm = this.formBuilder.group({

      AppDate: [this._common.stringToDate(this.LoggedInUserInfo.Branch?.WorkingDate), [Validators.required]],
      DevProdFlag: [this.loanApplicationHeader.DevProdFlag, [Validators.required]],
      DevAmount: [this.loanApplicationHeader.DevAmount, [Validators.required]],
      ProdAmount: [this.loanApplicationHeader.ProdAmount, [Validators.required]],
      LoanCaseNo: [this.loanApplicationHeader.LoanCaseNo, [Validators.required]],
      AppNumberManual: [this.loanApplicationHeader.AppNumberManual, [Validators.required]],
      CategoryID: [this.loanApplicationHeader.CategoryID, [Validators.required]],
      LoanAutoNo: [this.loanApplicationHeader.LoanAutoNo],
      CircleID: [this.loanApplicationHeader.CircleID, [Validators.required]],
      RefDepositAcc: [this.loanApplicationHeader.RefDepositAcc, [Validators.required, Validators.minLength(14)]],
      ApplicantionTitle: [this.loanApplicationHeader.ApplicantionTitle]
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.applicationHeaderForm?.controls[controlName].hasError(errorName);
  }

  validateBranchOnFocusOut() {
    if (this.SelectedBranches.length == 0)
      this.SelectedBranches = this.Branches;
  }

  searchircle(circleId) {

    circleId = circleId.toLowerCase();
    if (circleId != null && circleId != undefined && circleId != "")
      this.SelectedCircles = this.Circles.filter(x => x.CircleCode.toLowerCase().indexOf(circleId) > -1);
    else
      this.SelectedCircles = this.Circles;
  }
  validateircleOnFocusOut() {
    if (this.SelectedCircles.length == 0)
      this.SelectedCircles = this.Circles;
  }

  //-------------------------------Loan Type Core Functions-------------------------------//
  async getLoanType() {
    this.LoanTypes = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.LoanTypes })

    this.SelectedLoanType = this.LoanTypes.LOVs;
  console.log("selectedloan"+JSON.stringify(this.SelectedLoanType))
  }
  searchLoanType(loanTypeId) {
    loanTypeId = loanTypeId.toLowerCase();
    if (loanTypeId != null && loanTypeId != undefined && loanTypeId != "")
      this.SelectedLoanType = this.LoanTypes?.LOVs?.filter(x => x.Name.toLowerCase().indexOf(loanTypeId) > -1);
    else
      this.SelectedLoanType = this.LoanTypes.LOVs;
  }
  validateLoanTypeOnFocusOut() {
    if (this.SelectedLoanType.length == 0)
      this.SelectedLoanType = this.LoanTypes;
  }

  //-------------------------------Loan Category Core Functions-------------------------------//
  async getLoanCategory() {
    this.LoanCategories = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.LoanCategories })
    this.SelectedLoanCategory = this.LoanCategories.LOVs;

  }
  searchLoanCategory(loanCategoryId) {
    loanCategoryId = loanCategoryId.toLowerCase();
    if (loanCategoryId != null && loanCategoryId != undefined && loanCategoryId != "")
      this.SelectedLoanCategory = this.LoanCategories.filter(x => x.Name.toLowerCase().indexOf(loanCategoryId) > -1);
    else
      this.SelectedLoanCategory = this.LoanCategories;
  }
  validateLoanCategoryOnFocusOut() {
    if (this.SelectedLoanCategory.length == 0)
      this.SelectedLoanCategory = this.LoanCategories;
  }

  loadAppDataOnUpdate(appHeaderData) {
    this.loanApplicationHeader = appHeaderData;
    //this.createForm();
    if (this.loanApplicationHeader != null, this.loanApplicationHeader != undefined) {
      if (this.loanApplicationHeader.DevAmount != null, this.loanApplicationHeader.DevAmount != undefined) {
        this.applicationHeaderForm.controls['DevAmount'].setValue(this.loanApplicationHeader.DevAmount);
      }
      if (this.loanApplicationHeader.ProdAmount != null, this.loanApplicationHeader.ProdAmount != undefined) {
        this.applicationHeaderForm.controls['ProdAmount'].setValue(this.loanApplicationHeader.ProdAmount);
      }
      if (this.loanApplicationHeader.LoanCaseNo != null, this.loanApplicationHeader.LoanCaseNo != undefined) {
        this.applicationHeaderForm.controls['LoanCaseNo'].setValue(this.loanApplicationHeader.LoanCaseNo);
      }
      if (this.loanApplicationHeader.AppNumberManual != null, this.loanApplicationHeader.AppNumberManual != undefined) {
        this.applicationHeaderForm.controls['AppNumberManual'].setValue(this.loanApplicationHeader.AppNumberManual);
      }
      if (this.loanApplicationHeader.CategoryID != null, this.loanApplicationHeader.CategoryID != undefined) {
        this.applicationHeaderForm.controls['CategoryID'].setValue(this.loanApplicationHeader.CategoryID);
      }
      if (this.loanApplicationHeader.LoanAutoNo != null, this.loanApplicationHeader.LoanAutoNo != undefined) {
        this.applicationHeaderForm.controls['LoanAutoNo'].setValue(this.loanApplicationHeader.LoanAutoNo);
      }
      if (this.loanApplicationHeader.CircleID != null, this.loanApplicationHeader.CircleID != undefined) {
        this.applicationHeaderForm.controls['CircleID'].setValue(this.loanApplicationHeader.CircleID);
      }
      if (this.loanApplicationHeader.RefDepositAcc != null, this.loanApplicationHeader.RefDepositAcc != undefined) {
        this.applicationHeaderForm.controls['RefDepositAcc'].setValue(this.loanApplicationHeader.RefDepositAcc);
      }
      if (this.loanApplicationHeader.ApplicantionTitle != null, this.loanApplicationHeader.ApplicantionTitle != undefined) {
        this.applicationHeaderForm.controls['ApplicantionTitle'].setValue(this.loanApplicationHeader.ApplicantionTitle);
      }
      if (this.loanApplicationHeader.DevProdFlag != null, this.loanApplicationHeader.DevProdFlag != undefined) {
        var devProdFlag = this.LoanTypes?.LOVs?.filter(x => x.Name == this.loanApplicationHeader.DevProdFlag); //[0].Id;
        if (devProdFlag?.length > 0) {
          this.applicationHeaderForm.controls['DevProdFlag'].setValue(devProdFlag[0].Id);
        }      }


    }
  }

  getLcNoAutoAssignedByApi() {
    this.spinner.show();
    this.isCheckLcInProgress = true;
    this._loanService.generateNewAutoLc(this.LoggedInUserInfo.Branch)
      .pipe(
        finalize(() => {
          this.isCheckLcInProgress = false;
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {

        if (baseResponse.Success) {
          this.applicationHeaderForm.controls["LoanCaseNo"].setValue(baseResponse.Loan.ApplicationHeader.LoanAutoNo);
        }
        else {

          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        }
      });

  }

  onChangeLoanType(loanType) {
    if (loanType.value == "P") {

      this.applicationHeaderForm.controls["ProdAmount"].setValidators([Validators.required]);
      this.applicationHeaderForm.controls["ProdAmount"].updateValueAndValidity();
      this.applicationHeaderForm.controls["DevAmount"].clearValidators();
      this.applicationHeaderForm.controls["DevAmount"].updateValueAndValidity();
    }
    else if (loanType.value == "D") {
      this.applicationHeaderForm.controls["DevAmount"].setValidators([Validators.required]);
      this.applicationHeaderForm.controls["DevAmount"].updateValueAndValidity();
      this.applicationHeaderForm.controls["ProdAmount"].clearValidators();
      this.applicationHeaderForm.controls["ProdAmount"].updateValueAndValidity();
    }
    else if (loanType.value == "B") {
      this.applicationHeaderForm.controls["DevAmount"].setValidators([Validators.required]);
      this.applicationHeaderForm.controls["DevAmount"].updateValueAndValidity();
      this.applicationHeaderForm.controls["ProdAmount"].setValidators([Validators.required]);
      this.applicationHeaderForm.controls["ProdAmount"].updateValueAndValidity();
    }
  }

  onClearSavApplicationHeader() {

    //this.applicationHeaderForm.controls["ZoneId"].setValue("");
    //this.applicationHeaderForm.controls["BranchID"].setValue("");
    //this.applicationHeaderForm.controls["AppDate"].setValue("");
    this.applicationHeaderForm.controls["DevProdFlag"].setValue("");
    this.applicationHeaderForm.controls["DevAmount"].setValue("");
    this.applicationHeaderForm.controls["ProdAmount"].setValue("");
    //this.applicationHeaderForm.controls["LoanCaseNo"].setValue("");
    this.applicationHeaderForm.controls["AppNumberManual"].setValue("");
    this.applicationHeaderForm.controls["CategoryID"].setValue("");
    //this.applicationHeaderForm.controls["AccountNo"].setValue("");
    this.applicationHeaderForm.controls["CircleID"].setValue("");
    this.applicationHeaderForm.controls["RefDepositAcc"].setValue("");
    this.applicationHeaderForm.controls["ApplicantionTitle"].setValue("");
  }

  onSaveApplicationHeader() {



    //Parsing dev amount
    let devAmount = this.applicationHeaderForm.controls["DevAmount"].value
    devAmount = devAmount == null || devAmount == undefined || devAmount == "" ? 0 : devAmount;
    //this.applicationHeaderForm.controls["DevelopmentAmount"].setValue(devAmount);

    //Parsing reference number
    let applicantionTitle = this.applicationHeaderForm.controls["ApplicantionTitle"].value
    applicantionTitle = applicantionTitle == null || applicantionTitle == undefined || applicantionTitle == "" ? "" : applicantionTitle;

    //Parsing production amount
    let prdAmount = this.applicationHeaderForm.controls["ProdAmount"].value
    prdAmount = prdAmount == null || prdAmount == undefined || prdAmount == "" ? 0 : prdAmount;


    this.loanApplicationHeader= Object.assign(this.loanApplicationHeader, this.applicationHeaderForm.getRawValue());

    this.loanApplicationHeader.DevAmount = devAmount;
    this.loanApplicationHeader.ProdAmount = prdAmount;
    this.loanApplicationHeader.ApplicantionTitle = applicantionTitle;

    this.hasFormErrors = false;
    if (this.applicationHeaderForm.invalid) {
      const controls = this.applicationHeaderForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      //this.spinner.hide();
      return;
    }

    if (this.loanApplicationHeader.DevProdFlag == "1") {
      if (this.loanApplicationHeader.ProdAmount > 0) {
        if (this.loanApplicationHeader.DevAmount != 0) {
          this.layoutUtilsService.alertMessage("", "Development Amount should be equal to 0");
          return;
        }
      }
      else {
        this.layoutUtilsService.alertMessage("", "Production Amount should be greater than 0");
        return;
      }
    }
    else if (this.loanApplicationHeader.DevProdFlag == "2") {
      if (this.loanApplicationHeader.DevAmount > 0) {
        if (this.loanApplicationHeader.ProdAmount != 0) {
          this.layoutUtilsService.alertMessage("", "Production Amount should be equal to 0");
          return;
        }
      }
      else {
        this.layoutUtilsService.alertMessage("", "Development Amount should be greater than 0");
        return;
      }
    }
    else if (this.loanApplicationHeader.DevProdFlag == "3") {
      if (this.loanApplicationHeader.ProdAmount == 0 || this.loanApplicationHeader.DevAmount == 0) {
        this.layoutUtilsService.alertMessage("", "Development and production Amount should be greater than 0");
        return;
      }
    }

    //this.loanApplicationHeader.AppDate = this.datePipe.transform(this.loanApplicationHeader.AppDate, "ddMMyyyy");
    this.loanApplicationHeader.AppDate = this.LoggedInUserInfo.Branch.WorkingDate;

    this.loanApplicationHeader.CreatedOn = this.datePipe.transform(new Date(), "ddMMyyyy");

    //this.loanApplicationHeader.LoanCaseNo = (parseInt(this.loanApplicationHeader.LoanCaseNo) + 11).toString();


    this.isSaveApplicationHeaderInProgress = true;

    this.spinner.show();
    this._loanService.saveApplicationHeader(this.loanApplicationHeader)
      .pipe(
        finalize(() => {
          this.isSaveApplicationHeaderInProgress = false;
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {

        if (baseResponse.Success) {
          this.loanApplicationHeader.LoanAppID = baseResponse.Loan.ApplicationHeader.LoanAppID;
          this.LoanDetail.ApplicationHeader = this.loanApplicationHeader;
          this.LoanDetail.TranId = baseResponse.TranId;
          this.applicationCall.emit(this.LoanDetail);
          this.isSaveApplicationHeaderInProgress = false;
          const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        }
        else {
          this.isSaveApplicationHeaderInProgress = false;
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        }
      });
  }
}
