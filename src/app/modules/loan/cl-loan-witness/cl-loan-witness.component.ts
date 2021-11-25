import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateFormats } from 'app/shared/classes/lov.class';
import { CorporateSuret, CorporateSurety, CurrentLoans, Loan, LoanDocumentCheckList, LoanPastPaid, LoanRefrences, LoanWitness, PersonalSureties } from 'app/shared/models/Loan.model';
import { LoanService } from 'app/shared/services/loan.service';
import { CommonService } from 'app/shared/services/common.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
@Component({
  selector: 'kt-cl-loan-witness',
  templateUrl: './cl-loan-witness.component.html',
  styleUrls: ['./cl-loan-witness.component.scss'],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }

  ]
})
export class ClLoanWitnessComponent implements OnInit {

  @Input() loanDetail: Loan;
  loanDocumentsCheckList: any = [];
  loanRefrenceArray: LoanRefrences[] = [];
  editLoanRefrenceArray: LoanRefrences[] = [];

  loanPersonalSuretiesArray: PersonalSureties[] = [];
  editLoanPersonalSuretiesArray: PersonalSureties[] = [];

  loanCorporateSuretyArray: CorporateSurety[] = [];
  editLoanCorporateSuretyArray: CorporateSuret[] = [];

  loanWitnessArray: LoanWitness[] = [];
  editLoanWitnessArray: LoanWitness[] = [];

  loanPastPaidArray: LoanPastPaid[] = [];
  editLoanPastPaidArray: LoanPastPaid[] = [];

  loanCurrentList: CurrentLoans[] = [];
  editLoanCurrentList: CurrentLoans[] = [];

  constructor
    (
    private formBuilder: FormBuilder,
    private _loanService: LoanService,
    private _common: CommonService,
    private spinner: NgxSpinnerService,
    private layoutUtilsService: LayoutUtilsService,
    public datepipe: DatePipe
  ) {

  }

  ngOnInit() {

      

    this.getPersonalSuretiesForm();
    this.getCorporateSuretiesForm();
    this.getLoanRefrencesForm();
    this.getLoanWitnessForm();
    this.getLoanPastPaidForm();
    this.getCurrentLoansForm();

    this.createPersonalSuretiesForm();
    this.createCorporateSuretiesForm();
    this.createLoanRefrencesForm();
    this.createLoanWitnessForm();
    this.createLoanPastPaidForm();
    this.createCurrentLoansForm();

  }

  /**********************************************************************************************************/
  /*                        Personal Sureties                                                               */
  /**********************************************************************************************************/
  personalSuretiesForm: FormGroup;
  personalSureties = new PersonalSureties();

  createPersonalSuretiesForm() {
    this.personalSuretiesForm = this.formBuilder.group({
      Cnic: [this.personalSureties.Cnic],
      FullName: [this.personalSureties.FullName],
      Percentage: [this.personalSureties.Percentage],
      Address: [this.personalSureties.Address],
      Phone: [this.personalSureties.Phone],
      AccountNo: [this.personalSureties.AccountNo],
      SourceofIncome: [this.personalSureties.SourceofIncome],
      AnnualIncome: [this.personalSureties.AnnualIncome],
      AssetValue: [this.personalSureties.AssetValue],
      PresentDues: [this.personalSureties.PresentDues],
      NetValue: [this.personalSureties.NetValue]
    });
  }

  onSavePersonalSuretiesForm() {

    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }

    this.personalSureties = Object.assign(this.personalSureties, this.personalSuretiesForm.getRawValue());
    //this.personalSureties.LoanAppID = 0;
    this.personalSureties.SrNo = 0;
    this.personalSureties.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    this.spinner.show();
    this._loanService.saveUpdatePersonalSureties(this.personalSureties, this.loanDetail.TranId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
    ).subscribe(baseResponse => {

        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
      });
  }

/**********************************************************************************************************/
/*                        Corporate sureties                                                              */
/**********************************************************************************************************/
  corporateSuretiesForm: FormGroup;
  corporateSureties = new CorporateSurety();

  createCorporateSuretiesForm() {
    this.corporateSuretiesForm = this.formBuilder.group({
      CompanyName: [this.corporateSureties.CompanyName],
      MemorandumDate: [this.corporateSureties.MemorandumDate],
      RefrenceNo: [this.corporateSureties.RefrenceNo]
    });
  }

  onSaveCorporateSuretiesForm() {

    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }

    this.corporateSureties = Object.assign(this.corporateSureties, this.corporateSuretiesForm.getRawValue());
    //this.corporateSureties.LoanAppID = 0;
    this.corporateSureties.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    //this.corporateSureties.SrNo = 0;
    this.spinner.show();
    this._loanService.saveUpdateCorporateSurety(this.corporateSureties, this.loanDetail.TranId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
    ).subscribe(baseResponse => {

        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
      });
  }

/**********************************************************************************************************/
/*                        Loan Refrences                                                                  */
/**********************************************************************************************************/

  loanRefrencesForm: FormGroup;
  loanRefrences = new LoanRefrences();

  createLoanRefrencesForm() {
    this.loanRefrencesForm = this.formBuilder.group({
      Cnic: [this.loanRefrences.Cnic],
      Name: [this.loanRefrences.Name],
      Address: [this.loanRefrences.Address],
      Phone: [this.loanRefrences.Phone],
      Fax: [this.loanRefrences.Fax],
      Email: [this.loanRefrences.Email],
      Ntn: [this.loanRefrences.Ntn]
    });
  }

  onSaveLoanRefrencesForm() {

    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }
    //if (this.editLoanRefrenceArray != null, this.editLoanRefrenceArray != undefined) {
    //  this.loanRefrences.ReferenceID = this.editLoanRefrenceArray[2].ReferenceID;
    //  this.loanRefrences.SrNo = this.editLoanRefrenceArray[2].SrNo;

    //}

    this.loanRefrences = Object.assign(this.loanRefrences, this.loanRefrencesForm.getRawValue());
    //this.loanRefrences.ReferenceID = 0;
    //this.loanRefrences.LoanAppID = 0;
    this.loanRefrences.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    //this.loanRefrences.SrNo = 0;
    this.spinner.show();
    this._loanService.saveUpdateReferences(this.loanRefrences, this.loanDetail.TranId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
    ).subscribe(baseResponse => {

        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
      });
  }

/**********************************************************************************************************/
/*                        Loan Witness                                                                    */
/**********************************************************************************************************/

  loanWitnessForm: FormGroup;
  loanWitness = new LoanWitness();

  createLoanWitnessForm() {
    this.loanWitnessForm = this.formBuilder.group({
      Cnic: [this.loanWitness.Cnic],
      WitnessName: [this.loanWitness.WitnessName],
      WitnessAddress: [this.loanWitness.WitnessAddress]
    });
  }

  onSaveLoanWitnessForm() {

    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }

    this.loanWitness = Object.assign(this.loanWitness, this.loanWitnessForm.getRawValue());
    //this.loanWitness.WitnessesID = 0;
    //this.loanWitness.LoanAppID = 0;
    this.loanWitness.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    //this.loanWitness.SrNo = 0;
    this.spinner.show();
    this._loanService.SaveUpdateWitnesses(this.loanWitness, this.loanDetail.TranId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
    ).subscribe(baseResponse => {

        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
      });
  }

/**********************************************************************************************************/
/*                        Loan Past Paid                                                                  */
/**********************************************************************************************************/

  loanPastPaidForm: FormGroup;
  loanPastPaid = new LoanPastPaid();

  createLoanPastPaidForm() {
    this.loanPastPaidForm = this.formBuilder.group({
      BankName: [this.loanPastPaid.BankName],
      AmountToPaid: [this.loanPastPaid.AmountToPaid],
      DueDate: [this.loanPastPaid.DueDate],
      LastPaidDate: [this.loanPastPaid.LastPaidDate],
    });
  }


  onSaveLoanPastPaidForm() {

    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }


    this.loanPastPaid = Object.assign(this.loanPastPaid, this.loanPastPaidForm.getRawValue());
    //this.loanPastPaid.PaidLoanID = 0;
    //this.loanPastPaid.LoanAppID = 0;
    this.loanPastPaid.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    this.spinner.show();
    this._loanService.SaveUpdatePastPaidLoans(this.loanPastPaid, this.loanDetail.TranId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
    ).subscribe(baseResponse => {

        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
      });
  }

/**********************************************************************************************************/
/*                        Current Loans                                                                  */
/**********************************************************************************************************/

  currentLoansForm: FormGroup;
  currentLoans = new CurrentLoans();

  createCurrentLoansForm() {
    this.currentLoansForm = this.formBuilder.group({
      PurposeDetail: [this.currentLoans.PurposeDetail],
      BankName: [this.currentLoans.BankName],
      TotalDebit: [this.currentLoans.TotalDebit],
      FundNonfundFlag: [this.currentLoans.FundNonfundFlag],
      DateDebitAcheive: [this.currentLoans.DateDebitAcheive],
      AmountToPaid: [this.currentLoans.AmountToPaid],
      DueDate: [this.currentLoans.DueDate]
    });
  }

    /**********************************************************************************************************/
    /*                        Get Data                                                                        */
    /**********************************************************************************************************/

    getPersonalSuretiesForm(){}
    getCorporateSuretiesForm(){}
    getLoanRefrencesForm(){}
    getLoanWitnessForm(){}
    getLoanPastPaidForm(){}
    getCurrentLoansForm(){}




  onSaveCurrentLoansForm() {

    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }


    this.currentLoans = Object.assign(this.currentLoans, this.currentLoansForm.getRawValue());
    //this.currentLoans.CurrentLoanID = 0;
    //this.currentLoans.LoanAppID = 0;
    this.currentLoans.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;

    this.currentLoans.GurenteeDetail = "";
    this.currentLoans.PurposeID = 8;
    this.currentLoans.BranchID = 10;
    //this.currentLoans.Status = "";
    this.spinner.show();
    this._loanService.saveUpdateCurrentLoans(this.currentLoans, this.loanDetail.TranId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
    ).subscribe(baseResponse => {

        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
      });
  }


/**********************************************************************************************************/
/*                        Documents Attached                                                              */
/**********************************************************************************************************/


  //CheckListForm: FormGroup;
  loanDocumentCheckListArray: LoanDocumentCheckList[] = [];


  getCheckList() {

    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }


    //this.loanDetail = new Loan();
    //this.loanDetail.ApplicationHeader = new LoanApplicationHeader();

    this.loanDetail.ApplicationHeader.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    
    this.spinner.show();
    if (this.loanDetail != null) {
      this.loanDetail.ApplicationHeader
      this._loanService.getCheckList(this.loanDetail.ApplicationHeader, this.loanDetail.TranId)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe(baseResponse => {

          
          if (baseResponse.Success) {
            this.loanDocumentsCheckList = baseResponse.Loan.LoanDocumentCheckList;
          }
        });
    }
    else {
      this.layoutUtilsService.alertMessage("", "Loan details not found");
    }

  }

  setUnsetDocumentCheckBox(docObj) {

    //this.loanDetail = new Loan();
    //this.loanDetail.ApplicationHeader = new LoanApplicationHeader();

    this.loanDetail.ApplicationHeader.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;

    if (docObj.checked) {
      var obj = new LoanDocumentCheckList();
      obj.AppDocID = docObj.source.value;
      obj.ChecklistID = 0;
      obj.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
      this.loanDocumentCheckListArray.push(obj)
    }
    else {
      var docIndex = this.loanDocumentCheckListArray.findIndex(x => x.AppDocID == docObj.source.value);
      this.loanDocumentCheckListArray.splice(docIndex, 1)
    }

  }

  saveCheckList() {

    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }

    //this.loanDetail = new Loan();
    //this.loanDetail.ApplicationHeader = new LoanApplicationHeader();

    this.loanDetail.ApplicationHeader.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    this.spinner.show();
    //const selectedCheckListIds =
    this._loanService.saveCheckList(this.loanDocumentCheckListArray, this.loanDetail.TranId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
    ).subscribe(baseResponse => {

      
      this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
    });
  }


  loadAppWitnessDataOnUpdate(appPersonalSureties, appReferences, appCorporateSureties, appLoanPastPaidList, appLoanWitnessList, appCurrentLoansList) {

    this.editLoanRefrenceArray = appCorporateSureties;
    this.editLoanPersonalSuretiesArray = appPersonalSureties;
    this.editLoanCorporateSuretyArray = appReferences;
    this.editLoanWitnessArray = appLoanWitnessList;
    this.editLoanPastPaidArray = appLoanPastPaidList;
    this.editLoanCurrentList = appCurrentLoansList;

    if (appLoanPastPaidList.length != 0) {
      var tempCustomerArr: LoanPastPaidGrid[] = [];
      appLoanPastPaidList.forEach(function (item, key) {

        var grid = new LoanPastPaidGrid();
        grid.PaidLoanID = item.PaidLoanID;
        grid.BankName = item.BankName;
        grid.LoanAppID = item.LoanAppID;
        grid.AmountToPaid = item.AmountToPaid;
        grid.LastPaidDate = item.LastPaidDate;
        grid.DueDate = item.DueDate;
        tempCustomerArr.push(grid);
      });
      this.loanPastPaidArray = tempCustomerArr;

    }

    if (appLoanWitnessList.length != 0) {

      var tempCustomerArra: LoanWitnessGrid[] = [];
      appLoanWitnessList.forEach(function (item, key) {

        var grid = new LoanWitnessGrid();

        grid.WitnessesID = item.WitnessesID;
        grid.SrNo = item.SrNo;
        grid.LoanAppID = item.LoanAppID;
        grid.Cnic = item.Cnic;
        grid.WitnessName = item.WitnessName;
        grid.WitnessAddress = item.WitnessAddress;
        grid.branchId = item.branchId
        tempCustomerArra.push(grid);
      });
      this.loanWitnessArray = tempCustomerArra;
    }

    if (appCorporateSureties.length != 0) {
    var tempCustomerArray: ReferenceGrid[] = [];

    appCorporateSureties.forEach(function (item, key) {

      var grid = new ReferenceGrid();

      grid.ReferenceID = item.ReferenceID;
      grid.Name = item.Name;
      grid.Address = item.Address;
      grid.LoanAppID = item.LoanAppID;
      grid.Cnic = item.Cnic;
      grid.Phone = item.Phone;
      grid.SrNo = item.SrNo;
      grid.Ntn = item.Ntn;
      grid.Email = item.Email;
      grid.Fax = item.Fax;

      tempCustomerArray.push(grid);

    });

      this.loanRefrenceArray = tempCustomerArray;
    }

    if (appPersonalSureties.length != 0) {

      var tempArray: PersonalSuretiesGrid[] = [];
      appPersonalSureties.forEach(function (item, key) {

        var grid = new PersonalSuretiesGrid();

        grid.PersonalSuretyID = item.PersonalSuretyID;
        grid.FullName = item.FullName;
        grid.Address = item.Address;
        grid.LoanAppID = item.LoanAppID;
        grid.Cnic = item.Cnic;
        grid.Phone = item.Phone;
        grid.SrNo = item.SrNo;
        grid.Percentage = item.Percentage;
        grid.AccountNo = item.AccountNo;
        grid.AnnualIncome = item.AnnualIncome;
        grid.AssetValue = item.AssetValue;
        grid.PresentDues = item.PresentDues;
        grid.NetValue = item.NetValue;

        tempArray.push(grid);

      });
      this.loanPersonalSuretiesArray = tempArray;
    }

    if (appReferences.length != 0) {
      var temperorayArray: CorporateSuretyGrid[] = [];
      appReferences.forEach((item, key) => {

        var grid = new CorporateSuretyGrid();

        grid.CompanyName = item.CompanyName;
        grid.MemorandumDate = item.MemorandumDate.toString()
        grid.RefrenceNo = item.RefrenceNo;
        grid.SrNo = item.SrNo;
        grid.LoanAppID = item.LoanAppID;
        grid.CorporateSuretyID = item.CorporateSuretyID

        temperorayArray.push(grid);


      });

      this.loanCorporateSuretyArray = temperorayArray;
    }

    if (appCurrentLoansList.length != 0) {

      var temperorayArr: CurrentLoansGrid[] = [];
      appCurrentLoansList.forEach((item, key) => {

        var currentGrid = new CurrentLoansGrid();

        currentGrid.FundNonfundFlag = item.FundNonfundFlag;
        currentGrid.CurrentLoanID = item.CurrentLoanID
        currentGrid.BankName = item.BankName;
        currentGrid.TotalDebit = item.TotalDebit;
        currentGrid.GurenteeDetail = item.GurenteeDetail;
        currentGrid.DateDebitAcheive = item.DateDebitAcheive;
        currentGrid.AmountToPaid = item.AmountToPaid
        currentGrid.DueDate = item.DueDate;
        currentGrid.PurposeID = item.PurposeID;
        currentGrid.LoanAppID = item.LoanAppID;
        currentGrid.BranchID = item.BranchID
        currentGrid.Status = item.Status;
        currentGrid.PurposeDetail = item.PurposeDetail;

        temperorayArr.push(currentGrid);

      });

      this.loanCurrentList = temperorayArr;

    }
  }


  onEditLoanCurrentList(CurrentLoanID) {

    for (var i = 0; i < this.editLoanCurrentList.length; i++) {
      if (this.editLoanCurrentList[i].CurrentLoanID == CurrentLoanID) {
        this.currentLoansForm.controls["BankName"].setValue(this.editLoanCurrentList[i].BankName)
        this.currentLoansForm.controls["PurposeDetail"].setValue(this.editLoanCurrentList[i].PurposeDetail)
        this.currentLoansForm.controls["TotalDebit"].setValue(this.editLoanCurrentList[i].TotalDebit)
        this.currentLoansForm.controls["FundNonfundFlag"].setValue(this.editLoanCurrentList[i].GurenteeDetail)
        this.currentLoansForm.controls["DateDebitAcheive"].setValue(this.editLoanCurrentList[i].DateDebitAcheive)
        this.currentLoansForm.controls["AmountToPaid"].setValue(this.editLoanCurrentList[i].AmountToPaid)
        this.currentLoansForm.controls["DueDate"].setValue(this.editLoanCurrentList[i].DueDate)

        this.currentLoans.CurrentLoanID = this.editLoanCurrentList[i].CurrentLoanID
        this.currentLoans.Status = this.editLoanCurrentList[i].Status;

      }
    }
  }

  onEditLoanWitnessArray(WitnessesID) {
    for (var i = 0; i < this.editLoanWitnessArray.length; i++) {
      if (this.editLoanWitnessArray[i].WitnessesID == WitnessesID) {
        this.loanWitnessForm.controls["Cnic"].setValue(this.editLoanWitnessArray[i].Cnic);
        this.loanWitnessForm.controls["WitnessName"].setValue(this.editLoanWitnessArray[i].WitnessName);
        this.loanWitnessForm.controls["WitnessAddress"].setValue(this.editLoanWitnessArray[i].WitnessAddress);

        this.loanWitness.WitnessesID = this.editLoanWitnessArray[i].WitnessesID
      }
    }
  }

  onEditLoanPastPaidArray(PaidLoanID) {

    for (var i = 0; i < this.editLoanPastPaidArray.length; i++) {
      if (this.editLoanPastPaidArray[i].PaidLoanID == PaidLoanID) {
        this.loanPastPaidForm.controls["BankName"].setValue(this.editLoanPastPaidArray[i].BankName);
        this.loanPastPaidForm.controls["AmountToPaid"].setValue(this.editLoanPastPaidArray[i].AmountToPaid);
        this.loanPastPaidForm.controls["DueDate"].setValue(this._common.stringToDate(this.editLoanPastPaidArray[i].DueDate));
        this.loanPastPaidForm.controls["LastPaidDate"].setValue(this._common.stringToDate(this.editLoanPastPaidArray[i].LastPaidDate));

        this.loanPastPaid.PaidLoanID = this.editLoanPastPaidArray[i].PaidLoanID
      }
    }
  }

  onEditLoanCorporateSuretyArray(RefrenceNo) {

    for (var i = 0; i < this.editLoanCorporateSuretyArray.length; i++) {

      if (this.editLoanCorporateSuretyArray[i].CorporateSuretyID == RefrenceNo) {
        this.corporateSuretiesForm.controls["CompanyName"].setValue(this.editLoanCorporateSuretyArray[i].CompanyName);
        var date = this.editLoanCorporateSuretyArray[i].MemorandumDate
        let latest_date = this.datepipe.transform(date, 'yyyy-MM-dd');
        this.corporateSuretiesForm.controls["MemorandumDate"].setValue(latest_date);
        this.corporateSuretiesForm.controls["RefrenceNo"].setValue(this.editLoanCorporateSuretyArray[i].RefrenceNo);
        this.corporateSureties.CorporateSuretyID = this.editLoanCorporateSuretyArray[i].CorporateSuretyID

      }
    }
  }

  onEditPersonalSureties(PersonalSuretyID) {

    for (var i = 0; i < this.editLoanPersonalSuretiesArray.length; i++) {

      if (this.editLoanPersonalSuretiesArray[i].PersonalSuretyID == PersonalSuretyID) {
      //Personal Sureties Form

        this.personalSuretiesForm.controls["Cnic"].setValue(this.editLoanPersonalSuretiesArray[i].Cnic);

      this.personalSuretiesForm.controls["FullName"].setValue(this.editLoanPersonalSuretiesArray[i].FullName);
      this.personalSuretiesForm.controls["Percentage"].setValue(this.editLoanPersonalSuretiesArray[i].Percentage);
      this.personalSuretiesForm.controls["Address"].setValue(this.editLoanPersonalSuretiesArray[i].Address);
      this.personalSuretiesForm.controls["Phone"].setValue(this.editLoanPersonalSuretiesArray[i].Phone);
      this.personalSuretiesForm.controls["AccountNo"].setValue(this.editLoanPersonalSuretiesArray[i].AccountNo);
      this.personalSuretiesForm.controls["SourceofIncome"].setValue(this.editLoanPersonalSuretiesArray[i].SourceofIncome);
      this.personalSuretiesForm.controls["AnnualIncome"].setValue(this.editLoanPersonalSuretiesArray[i].AnnualIncome);
      this.personalSuretiesForm.controls["AssetValue"].setValue(this.editLoanPersonalSuretiesArray[i].AssetValue);
      this.personalSuretiesForm.controls["PresentDues"].setValue(this.editLoanPersonalSuretiesArray[i].PresentDues);
        this.personalSuretiesForm.controls["NetValue"].setValue(this.editLoanPersonalSuretiesArray[i].NetValue);
        this.personalSureties.PersonalSuretyID = this.editLoanPersonalSuretiesArray[i].PersonalSuretyID
      }
    }
  }

  onEditRefrence(ReferenceID) {

    for (var i = 0; i < this.editLoanRefrenceArray.length; i++) {

      if (this.editLoanRefrenceArray[i].ReferenceID == ReferenceID) {

        this.loanRefrencesForm.controls["Cnic"].setValue(this.editLoanRefrenceArray[i].Cnic);
        this.loanRefrencesForm.controls["Address"].setValue(this.editLoanRefrenceArray[i].Address);
        this.loanRefrencesForm.controls["Name"].setValue(this.editLoanRefrenceArray[i].Name);
        this.loanRefrencesForm.controls["Phone"].setValue(this.editLoanRefrenceArray[i].Phone);
        this.loanRefrencesForm.controls["Fax"].setValue(this.editLoanRefrenceArray[i].Fax);
        this.loanRefrencesForm.controls["Email"].setValue(this.editLoanRefrenceArray[i].Email);
        this.loanRefrencesForm.controls["Ntn"].setValue(this.editLoanRefrenceArray[i].Ntn);
        this.loanRefrences.ReferenceID = this.editLoanRefrenceArray[i].ReferenceID
        this.loanRefrences.SrNo = this.editLoanRefrenceArray[i].LoanAppID



      }
    }
  }

  submitLoanApplication() {

    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }



    //this.loanDetail = new Loan();
    //this.loanDetail.ApplicationHeader = new LoanApplicationHeader();

    this.loanDetail.ApplicationHeader.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;

    this._loanService.submitLoanApplication(this.loanDetail.ApplicationHeader, this.loanDetail.TranId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      ).subscribe(baseResponse => {

        
        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
      });

  }

}
export class LoanPastPaidGrid {
  PaidLoanID: number;
  BankName: string;
  AmountToPaid: number;
  DueDate: string;
  LastPaidDate: string;
  LoanAppID: number;
}
export class LoanWitnessGrid {
  WitnessesID: number;
  LoanAppID: number;
  SrNo: number;
  Cnic: string;
  WitnessName: string;
  WitnessAddress: string;
  branchId: string;
}
export class CorporateSuretyGrid {
  CompanyName: string;
  MemorandumDate: string;
  RefrenceNo: string;
  SrNo: number;
  LoanAppID: number;
  CorporateSuretyID: number;
}
export class PersonalSuretiesGrid {
  PersonalSuretyID: number;
  FullName: string;
  Percentage: string;
  Address: string;
  AccountNo: string;
  SourceofIncome: string;
  AnnualIncome: number;
  AssetValue: number;
  PresentDues: number;
  NetValue: number;
  LoanAppID: number;
  Cnic: string;
  Phone: string;
  SrNo: number;
}
export class ReferenceGrid {
  ReferenceID: number;
  Name: string;
  Address: string;
  LoanAppID: number;
  Cnic: string;
  Phone: string;
  SrNo: number;
  Ntn: string;
  Fax: string;
  Email: string;
}
export class CurrentLoansGrid {
  FundNonfundFlag: string;
  CurrentLoanID: number;
  BankName: string;
  TotalDebit: number;
  GurenteeDetail: string;
  DateDebitAcheive: string;
  AmountToPaid: number;
  DueDate: string;
  PurposeID: number;
  LoanAppID: number;
  BranchID: number;
  Status: string;
  PurposeDetail: string;
}
