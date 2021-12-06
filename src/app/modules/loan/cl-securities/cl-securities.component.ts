import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateFormats, Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';
import { Loan, LoanSecurities } from 'app/shared/models/Loan.model';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from 'app/shared/services/loan.service';
import { LovService } from 'app/shared/services/lov.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { MatSelectChange } from '@angular/material/select';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'kt-cl-securities',
  templateUrl: './cl-securities.component.html',
  styleUrls: ['./cl-securities.component.scss'],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }

  ]
})
export class ClSecuritiesComponent implements OnInit {


  @Input() loanDetail: Loan;

  customerLandList: any = [];
  public LovCall = new Lov();
  LoggedInUserInfo: BaseResponseModel;
  LoanSecuritiesForm: FormGroup;
  public loanSecurities = new LoanSecurities();
  loanSecuritiesArray :  LoanSecurities[] = [];
  editLoanSecuritiesArray: LoanSecurities[] = [];


  //Loan Type inventory
  SecurityTypes: any = [];
  securityType: any = [];
  SelectedSecurityType: any = [];

  //Loan Type inventory
  areaQuantity: any = [];
  areaQuantities: any = [];
  SelectedAreaQuantities: any = [];

  hasFormErrors = false;

  isSecuritiesFormInProgress: boolean;
  currentSelectedSecurityType: string;
  currentUpdateSecurityRecordId: number;

  constructor(
    private _loanService: LoanService,
    private _cdf: ChangeDetectorRef,
    private _lovService: LovService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.isSecuritiesFormInProgress = false
    this.currentUpdateSecurityRecordId = 0;
    this.createForm();
    //this.getCustomerLand();
    this.getSecurityType();
    this.getAreaQuantity();
  }


  async getSecurityType() {
    this.SecurityTypes = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.SecurityType })

    this.SelectedSecurityType = this.SecurityTypes.LOVs;


  }

    checkBOX(IsAttached){
      if(IsAttached==true){
          return true;
      }
      else{
          return false;
      }

    }

    IfDisabledBOX(IsAttached){
      if(IsAttached==true){
          return true
      }else if(IsAttached==false){
          return false
      }else{
          return true
      }

    }
    newARR=[];
    onChang(custLand,i){
        debugger
        if(custLand.IsAttached==true){
            return
        }
      for(let i=0;i<this.newARR?.length;i++){
          if(this.newARR[i].PassbookNo==custLand.PassbookNo){
        this.newARR[i].ID="-1";
        this.newARR.splice(i,1)
              return
          }
      }
        custLand.ID="0";
        this.newARR.push(custLand);

    }

  searchSecurityType(securityTypeId) {
    securityTypeId = securityTypeId.toLowerCase();
    if (securityTypeId != null && securityTypeId != undefined && securityTypeId != "")
      this.SelectedSecurityType = this.SecurityTypes.LOVs.filter(x => x.Name.toLowerCase().indexOf(securityTypeId) > -1);
    else
      this.SelectedSecurityType = this.SecurityTypes.LOVs;
  }
  validateSecurityTypeOnFocusOut() {

    if (this.SelectedSecurityType.length == 0)
      this.SelectedSecurityType = this.SecurityTypes.LOVs;
  }
  setSecurityTypeValue(event: MatSelectChange) {
    this.currentSelectedSecurityType = event.source.triggerValue;``
  }

  async getAreaQuantity() {
    this.areaQuantities = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Quantity })

    this.SelectedAreaQuantities = this.areaQuantities.LOVs;

  }
  searchAreaQuantit(areaId) {
    areaId = areaId.toLowerCase();
    if (areaId != null && areaId != undefined && areaId != "")
      this.SelectedAreaQuantities = this.areaQuantities.filter(x => x.Name.toLowerCase().indexOf(areaId) > -1);
    else
      this.SelectedAreaQuantities = this.areaQuantities;
  }
  validateAreaQuantitOnFocusOut() {
    if (this.SelectedAreaQuantities.length == 0)
      this.SelectedAreaQuantities = this.areaQuantities;
  }

  createForm() {
    this.LoanSecuritiesForm = this.formBuilder.group({
      CollTypeID: [this.loanSecurities.CollTypeID], // security type
      BasisofMutation: [this.loanSecurities.BasisofMutation],
      QuantityUnit: [this.loanSecurities.QuantityUnit, [Validators.required]], //quantity area
      Quantity:  [this.loanSecurities.Quantity], //quantity area
      UnitPrice: [this.loanSecurities.UnitPrice, [Validators.required]], // unit price
      AppSecurityID: [],

    });
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.LoanSecuritiesForm.controls[controlName].hasError(errorName);
  }

  loadAppSecuritiesDataOnUpdate(appSecuritiesData) {


    this.editLoanSecuritiesArray = appSecuritiesData



    var tempCustomerArray: SecuritiesGrid[] = [];
    if (appSecuritiesData.length != 0) {
    appSecuritiesData.forEach(function (item, key) {

      var grid = new SecuritiesGrid();

      grid.EnteredBy = item.EnteredBy
      grid.CollTypeID = item.CollTypeID;
      grid.QuantityUnit = item.QuantityUnit;
      grid.Remarks = item.Remarks;
      grid.BasisofMutation = item.BasisofMutation;
      grid.AppSecurityID = item.AppSecurityID;
      grid.LoanAppID = item.LoanAppID;
      grid.UnitPrice = item.UnitPrice;
      grid.PludgedValue = item.PludgedValue;
      grid.MaxCreditLimit = item.MaxCreditLimit;
      grid.Quantity = item.Quantity;
      grid.EnteredDate = item.EnteredDate;
      grid.SecurityType = item.SecurityType;
      grid.SecurityTypeName = item.SecurityTypeName;
      grid.OrgUnitID = item.OrgUnitID;
      tempCustomerArray.push(grid);


    });
    }

    this.loanSecuritiesArray = tempCustomerArray;
  }

  getCustomerLand() {

    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }


    this._loanService.getCustomerLand(this.loanDetail.ApplicationHeader.LoanAppID)
      .pipe(
        finalize(() => {
        })
      ).subscribe(baseResponse => {
        if (baseResponse.Success) {
          this.customerLandList = baseResponse.Loan.CustomersLoanLands;

          this._cdf.detectChanges();
        }
        //else
        //  this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });
  }

  attachCustomerLandtoLoan() {



    if (this.newARR?.length > 0) {
      this.spinner.show();
      debugger
      this._loanService.attachCustomersLand(this.newARR, this.loanDetail.TranId)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
      ).subscribe(baseResponse => {

          if (baseResponse.Success) {
              this.customerLandList = baseResponse.Loan.CustomersLoanLands;
              this.newARR=[];
            this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
          }
          else {
            this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
          }
        });
    }
    else {
      this.layoutUtilsService.alertMessage("", "Please make changes before attaching");
    }
  }

  onSaveLoanSecurities() {
        debugger

    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }

    this.hasFormErrors = false;
    if (this.LoanSecuritiesForm.invalid) {
      const controls = this.LoanSecuritiesForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    this.loanSecurities = Object.assign(this.loanSecurities, this.LoanSecuritiesForm.getRawValue());

    this.loanSecurities.Quantity = parseInt(this.LoanSecuritiesForm.controls["Quantity"].value);
    this.loanSecurities.UnitPrice = parseInt(this.LoanSecuritiesForm.controls["UnitPrice"].value);

    this.loanSecurities.PludgedValue = this.loanSecurities.Quantity * this.loanSecurities.UnitPrice;
//    if (this.loanSecurities.MaxCreditLimit = null, this.loanSecurities.MaxCreditLimit = undefined
//    ) {
//      this.loanSecurities.MaxCreditLimit = 0;
//}

    this.loanSecurities.Remarks = "";
    this.loanSecurities.AppSecurityID = this.currentUpdateSecurityRecordId;
    if(this.LoanSecuritiesForm.controls["AppSecurityID"].value>0){
        this.loanSecurities.AppSecurityID=this.LoanSecuritiesForm.controls["AppSecurityID"].value;
    }
    debugger
    this.loanSecurities.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    //this.loanSecurities.LoanAppID = 0;
    this.loanSecurities.BasisofMutation = "PIU";
    this.loanSecurities.EnteredDate = this.datePipe.transform(new Date(), "ddMMyyyy");

    this.loanSecurities.SecurityType = this.currentSelectedSecurityType


    this.spinner.show();
    this.isSecuritiesFormInProgress = true;
debugger
    this._loanService.saveLoanSecurities(this.loanSecurities, this.loanDetail.TranId)
      .pipe(
        finalize(() => {
          this.isSecuritiesFormInProgress = false;
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {

        if (baseResponse.Success) {

          this.isSecuritiesFormInProgress = false;
          var loanGrid = new LoanSecurities();
          // loanGrid.AppSecurityID =
          // loanGrid.AppSecurityID = this.loanSecurities.AppSecurityID;
          // loanGrid.BasisofMutation = this.loanSecurities.BasisofMutation;
          // loanGrid.CollTypeID = this.loanSecurities.CollTypeID;
          // loanGrid.EnteredDate = this.loanSecurities.EnteredDate;
          // loanGrid.LoanAppID = this.loanSecurities.LoanAppID;
          // loanGrid.MaxCreditLimit = this.loanSecurities.MaxCreditLimit;
          // loanGrid.PludgedValue = this.loanSecurities.PludgedValue;
          // loanGrid.Quantity = this.loanSecurities.Quantity;
          // loanGrid.QuantityUnit = this.loanSecurities.QuantityUnit;
          // loanGrid.Remarks = this.loanSecurities.Remarks;
          // loanGrid.SecurityType = this.loanSecurities.SecurityType;
          // loanGrid.UnitPrice = this.loanSecurities.UnitPrice;
            this.loanSecuritiesArray=[];
          this.loanSecuritiesArray = baseResponse.Loan["LoanSecuritiesList"];

          this._cdf.detectChanges();
          this.LoanSecuritiesForm.controls["CollTypeID"].setValue("");
          this.LoanSecuritiesForm.controls["Quantity"].setValue("");
          this.LoanSecuritiesForm.controls["QuantityUnit"].setValue("");
          this.LoanSecuritiesForm.controls["UnitPrice"].setValue("");
          this.LoanSecuritiesForm.controls["AppSecurityID"].setValue("");
          Object.keys(this.LoanSecuritiesForm.controls).forEach(key => {
            this.LoanSecuritiesForm.get(key).markAsUntouched();
          });
          const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
            this.LoanSecuritiesForm.markAsUntouched();
        }
        else {
          //this.isSaveApplicationHeaderInProgress = false;
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code)
        }
      });

  }

  clearLoanSecuritiesForm() {
    this.LoanSecuritiesForm.controls["CollTypeID"].setValue("");
    this.LoanSecuritiesForm.controls["Quantity"].setValue("");
    this.LoanSecuritiesForm.controls["QuantityUnit"].setValue("");
    this.LoanSecuritiesForm.controls["UnitPrice"].setValue("");
      this.LoanSecuritiesForm.controls["AppSecurityID"].setValue("");
    Object.keys(this.LoanSecuritiesForm.controls).forEach(key => {
      this.LoanSecuritiesForm.get(key).markAsUntouched();
    });
  }

  showUpdateSecuritiesForm(loan) {
        debugger
        this.LoanSecuritiesForm.controls["Quantity"].setValue(loan.Quantity);
        this.LoanSecuritiesForm.controls["UnitPrice"].setValue(loan.UnitPrice);
        this.loanSecurities.MaxCreditLimit = loan?.MaxCreditLimit;
          this.LoanSecuritiesForm.controls["CollTypeID"].setValue(loan?.CollTypeID);
          this.LoanSecuritiesForm.controls["AppSecurityID"].setValue(loan?.AppSecurityID);
          this.LoanSecuritiesForm.controls["QuantityUnit"].setValue(loan?.QuantityUnit);

  }
}
export class SecuritiesGrid {
  CollTypeID: number;
  QuantityUnit: number;
  Remarks: string;
  BasisofMutation: string;
  UnitPrice: number;
  AppSecurityID: number;
  LoanAppID: number;
  PludgedValue: number;
  MaxCreditLimit: number;
  Quantity: number;
  EnteredDate: string;
  SecurityType: string;
  EnteredBy: string;
  OrgUnitID: string;
    SecurityTypeName:string;
}
