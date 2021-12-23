import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {finalize} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateFormats, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {
    CorporateSuret,
    CorporateSurety,
    CurrentLoans,
    Loan,
    LoanDocumentCheckList,
    LoanPastPaid,
    LoanRefrences,
    LoanWitness,
    PersonalSureties
} from 'app/shared/models/Loan.model';
import {LoanService} from 'app/shared/services/loan.service';
import {CommonService} from 'app/shared/services/common.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from "../../../shared/services/lov.service";
import {UserUtilsService} from "../../../shared/services/users_utils.service";

@Component({
    selector: 'kt-cl-loan-witness',
    templateUrl: './cl-loan-witness.component.html',
    styleUrls: ['./cl-loan-witness.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ]
})
export class ClLoanWitnessComponent implements OnInit {

    @Input() loanDetail: Loan;
    loanDocumentsCheckList: any = [];
    loanRefrenceArray: LoanRefrences[] = [];
    editLoanRefrenceArray: LoanRefrences[] = [];
    EditableCnicReference;
    EditableCnicWitness;
    EditableCnicSureties;
    isSubmittedPersonalSuretiesForm= false;
    isSubmittedCorporateSuretiesForm= false;
    isSubmittedLoanRefrencesForm= false;
    isSubmittedLoanWitnessForm= false;
    isSubmittedLoanPastPaidForm= false;
    isSubmittedCurrentLoansForm= false;
    loanPersonalSuretiesArray: PersonalSureties[] = [];
    editLoanPersonalSuretiesArray: PersonalSureties[] = [];

    loanCorporateSuretyArray: CorporateSurety[] = [];
    editLoanCorporateSuretyArray: CorporateSuret[] = [];

    loanWitnessArray: LoanWitness[] = [];
    editLoanWitnessArray: LoanWitness[] = [];

    loanPastPaidArray: LoanPastPaid[] = [];
    editLoanPastPaidArray: LoanPastPaid[] = [];

    loanCurrentList: CurrentLoansGrid[] = [];
    editLoanCurrentList: CurrentLoans[] = [];
    status_lovs: any;
    funded_lovs: any;

    constructor
    (
        private formBuilder: FormBuilder,
        private _loanService: LoanService,
        private _common: CommonService,
        private spinner: NgxSpinnerService,
        private layoutUtilsService: LayoutUtilsService,
        public datepipe: DatePipe,
        private lovService: LovService,
        private userUtilsService: UserUtilsService,
    ) {

    }

    onCancel() {
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

        this.loadLovs();

    }

    /**********************************************************************************************************/
    /*                        Personal Sureties                                                               */
    /**********************************************************************************************************/
    personalSuretiesForm: FormGroup;
    personalSureties = new PersonalSureties();
    hasError(controlName: string, errorName: string): boolean {
        return this.personalSuretiesForm?.controls[controlName].hasError(errorName);
    }
    createPersonalSuretiesForm() {
        this.personalSuretiesForm = this.formBuilder.group({
            Cnic: [this.personalSureties.Cnic,Validators.required],
            FullName: [this.personalSureties.FullName,Validators.required],
            Percentage: [this.personalSureties.Percentage,Validators.required],
            Address: [this.personalSureties.Address,Validators.required],
            Phone: [this.personalSureties.Phone,Validators.required],
            AccountNo: [this.personalSureties.AccountNo,Validators.required],
            SourceofIncome: [this.personalSureties.SourceofIncome,Validators.required],
            AnnualIncome: [this.personalSureties.AnnualIncome,Validators.required],
            AssetValue: [this.personalSureties.AssetValue,Validators.required],
            PresentDues: [this.personalSureties.PresentDues,Validators.required],
            NetValue: [this.personalSureties.NetValue,Validators.required],
            PersonalSuretyID: [this.personalSureties.PersonalSuretyID]
        });

    }



    onSavePersonalSuretiesForm() {

        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
            return;
        }

        // this.isSubmittedPersonalSuretiesForm = true;

        if (this.personalSuretiesForm.invalid) {
            const controls = this.personalSuretiesForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.isSubmittedPersonalSuretiesForm = true;
            //this.spinner.hide();
            return;
        }else{
            this.isSubmittedPersonalSuretiesForm = false;
        }

        let duplicate_cnic = false;
        this.loanPersonalSuretiesArray.forEach((single_array) => {
            if (single_array.Cnic == this.personalSuretiesForm.value.Cnic) {
                if (this.EditableCnicSureties) {
                    if (this.EditableCnicSureties != single_array.Cnic) {
                        duplicate_cnic = true;

                    }
                } else
                    duplicate_cnic = true;

            }
        })
        if (duplicate_cnic) {
            this.layoutUtilsService.alertElementSuccess("Duplicate CNIC", "CNIC Already Exists");
            return;
        }
        this.personalSureties = Object.assign(this.personalSureties, this.personalSuretiesForm.getRawValue());
        this.personalSureties.SrNo = 0;
        delete this.personalSureties.SrNo;
        this.personalSureties.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
        if (this.personalSureties.PersonalSuretyID == null) {
            delete this.personalSureties.PersonalSuretyID
        }
        this.spinner.show();
        this._loanService.saveUpdatePersonalSureties(this.personalSureties, this.loanDetail.TranId)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Loan?.PersonalSuretiesList)
                this.loanPersonalSuretiesArray = baseResponse.Loan.PersonalSuretiesList;
            this.personalSuretiesForm.reset();
            this.EditableCnicSureties = null;
            this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        });
    }

    /**********************************************************************************************************/
    /*                        Corporate sureties                                                              */
    /**********************************************************************************************************/
    corporateSuretiesForm: FormGroup;
    corporateSureties = new CorporateSurety();
    hasErrorCorporateSuretiesForm(controlName: string, errorName: string): boolean {
        return this.corporateSuretiesForm?.controls[controlName].hasError(errorName);
    }
    createCorporateSuretiesForm() {
        this.corporateSuretiesForm = this.formBuilder.group({
            CompanyName: [this.corporateSureties.CompanyName,Validators.required],
            MemorandumDate: [this.corporateSureties.MemorandumDate,Validators.required],
            RefrenceNo: [this.corporateSureties.RefrenceNo,Validators.required],
            CorporateSuretyID: [this.corporateSureties.CorporateSuretyID]
        });
    }

    onSaveCorporateSuretiesForm() {

        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
            return;
        }

        if (this.corporateSuretiesForm.invalid) {
            const controls = this.corporateSuretiesForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.isSubmittedCorporateSuretiesForm = true;
            //this.spinner.hide();
            return;
        }else{
            this.isSubmittedCorporateSuretiesForm = false;
        }

        this.corporateSureties = Object.assign(this.corporateSureties, this.corporateSuretiesForm.getRawValue());
        this.corporateSureties.MemorandumDate = this.datepipe.transform(this.corporateSuretiesForm.value.MemorandumDate, "ddMMyyyy");

        //this.corporateSureties.LoanAppID = 0;
        this.corporateSureties.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
        //this.corporateSureties.SrNo = 0;


        if (this.corporateSureties.CorporateSuretyID == null) {
            delete this.corporateSureties.CorporateSuretyID;
        }
        this.spinner.show();
        this._loanService.saveUpdateCorporateSurety(this.corporateSureties, this.loanDetail.TranId)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Loan.CorporateSuretyList)
                this.loanCorporateSuretyArray = baseResponse.Loan.CorporateSuretyList;
            this.corporateSuretiesForm.reset()
            this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        });
    }

    /**********************************************************************************************************/
    /*                        Loan Refrences                                                                  */
    /**********************************************************************************************************/

    loanRefrencesForm: FormGroup;
    loanRefrences = new LoanRefrences();
    hasErrorLoanRefrencesForm(controlName: string, errorName: string): boolean {
        return this.loanRefrencesForm?.controls[controlName].hasError(errorName);
    }
    createLoanRefrencesForm() {
        this.loanRefrencesForm = this.formBuilder.group({
            Cnic: [this.loanRefrences.Cnic,Validators.required],
            Name: [this.loanRefrences.Name,Validators.required],
            Address: [this.loanRefrences.Address,Validators.required],
            Phone: [this.loanRefrences.Phone],
            Fax: [this.loanRefrences.Fax],
            Email: [this.loanRefrences.Email,Validators.email],
            Ntn: [this.loanRefrences.Ntn,Validators.required],
            ReferenceID: [this.loanRefrences.ReferenceID]
        });
    }

    onClearLoanRefrencesForm() {
        this.loanRefrencesForm.reset()
        this.EditableCnicReference = null;
        this.isSubmittedLoanRefrencesForm=false;
    }

    onClearLoanWitnessForm() {
        this.loanWitnessForm.reset()
        this.EditableCnicWitness = null;
        this.isSubmittedLoanWitnessForm=false;
    }

    onClearLoanSuretiesForm() {
        this.personalSuretiesForm.reset()
        this.isSubmittedPersonalSuretiesForm = false;
        this.EditableCnicSureties = null;
    }
    onClearCorporateSuretiesForm() {
        this.corporateSuretiesForm.reset()
        this.isSubmittedCorporateSuretiesForm=false;
    }
    onClearLoanPastPaidForm() {
        this.loanPastPaidForm.reset()
        this.isSubmittedLoanPastPaidForm=false;
    }
    onClearCurrentLoansForm() {
        this.currentLoansForm.reset()
        this.isSubmittedCurrentLoansForm=false;
    }



    onSaveLoanRefrencesForm() {
        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
            return;
        }

        if (this.loanRefrencesForm.invalid) {
            const controls = this.loanRefrencesForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.isSubmittedLoanRefrencesForm = true;
            //this.spinner.hide();
            return;
        }else{
            this.isSubmittedLoanRefrencesForm = false;
        }

        let duplicate_cnic = false;
        this.loanRefrenceArray.forEach((single_array) => {
            if (single_array.Cnic == this.loanRefrencesForm.value.Cnic) {
                if (this.EditableCnicReference) {
                    if (this.EditableCnicReference != single_array.Cnic) {
                        duplicate_cnic = true;

                    }
                } else
                    duplicate_cnic = true;

            }
        })
        if (duplicate_cnic) {
            this.layoutUtilsService.alertElementSuccess("Duplicate CNIC", "CNIC Already Exists");
            return;
        }
        this.loanRefrences = Object.assign(this.loanRefrences, this.loanRefrencesForm.getRawValue());
        this.loanRefrences.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
        //this.loanRefrences.SrNo = 0;

        if (this.loanRefrences.ReferenceID == null) {
            delete this.loanRefrences.ReferenceID;
        }
        this.spinner.show();
        this._loanService.saveUpdateReferences(this.loanRefrences, this.loanDetail.TranId)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Loan.LoanRefrencesList) {
                this.loanRefrenceArray = baseResponse.Loan.LoanRefrencesList
                this.loanRefrencesForm.reset()
                this.EditableCnicReference = null;
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }


        });
    }

    /**********************************************************************************************************/
    /*                        Loan Witness                                                                    */
    /**********************************************************************************************************/

    loanWitnessForm: FormGroup;
    loanWitness = new LoanWitness();
    hasErrorLoanWitnessForm(controlName: string, errorName: string): boolean {
        return this.loanWitnessForm?.controls[controlName].hasError(errorName);
    }
    createLoanWitnessForm() {
        this.loanWitnessForm = this.formBuilder.group({
            Cnic: [this.loanWitness.Cnic,Validators.required],
            WitnessName: [this.loanWitness.WitnessName,Validators.required],
            WitnessAddress: [this.loanWitness.WitnessAddress,Validators.required],
            WitnessesID: [this.loanWitness.WitnessesID]
        });
    }

    onSaveLoanWitnessForm() {
        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
            return;
        }

        if (this.loanWitnessForm.invalid) {
            const controls = this.loanWitnessForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.isSubmittedLoanWitnessForm = true;
            //this.spinner.hide();
            return;
        }else{
            this.isSubmittedLoanWitnessForm = false;
        }

        let duplicate_cnic = false;
        this.loanWitnessArray.forEach((single_array) => {
            if (single_array.Cnic == this.loanWitnessForm.value.Cnic) {
                if (this.EditableCnicWitness) {
                    if (this.EditableCnicWitness != single_array.Cnic) {
                        duplicate_cnic = true;

                    }
                } else
                    duplicate_cnic = true;

            }
        })
        if (duplicate_cnic) {
            this.layoutUtilsService.alertElementSuccess("Duplicate CNIC", "CNIC Already Exists");
            return;
        }

        this.loanWitness = Object.assign(this.loanWitness, this.loanWitnessForm.getRawValue());
        //this.loanWitness.WitnessesID = 0;
        //this.loanWitness.LoanAppID = 0;
        this.loanWitness.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
        //this.loanWitness.SrNo = 0;

        if (this.loanWitness.WitnessesID == null) {
            delete this.loanWitness.WitnessesID;
        }
        this.spinner.show();
        this._loanService.SaveUpdateWitnesses(this.loanWitness, this.loanDetail.TranId)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Loan.LoanWitnessList) {
                this.loanWitnessArray = baseResponse.Loan.LoanWitnessList;
                this.loanWitnessForm.reset();
                this.EditableCnicWitness = null;
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
            } else {

                this.layoutUtilsService.alertElement('', baseResponse.Message);
            }

        });
    }

    /**********************************************************************************************************/
    /*                        Loan Past Paid                                                                  */
    /**********************************************************************************************************/

    loanPastPaidForm: FormGroup;
    loanPastPaid = new LoanPastPaid();
    hasErrorLoanPastPaidForm(controlName: string, errorName: string): boolean {
        return this.loanPastPaidForm?.controls[controlName].hasError(errorName);
    }
    createLoanPastPaidForm() {
        this.loanPastPaidForm = this.formBuilder.group({
            BankName: [this.loanPastPaid.BankName,Validators.required],
            AmountToPaid: [this.loanPastPaid.AmountToPaid],
            DueDate: [this.loanPastPaid.DueDate,Validators.required],
            LastPaidDate: [this.loanPastPaid.LastPaidDate,Validators.required],
            PaidLoanID: [this.loanPastPaid?.PaidLoanID]
        });
    }


    onSaveLoanPastPaidForm() {

        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
            return;
        }

        if (this.loanPastPaidForm.invalid) {
            const controls = this.loanPastPaidForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.isSubmittedLoanPastPaidForm = true;
            //this.spinner.hide();
            return;
        }else{
            this.isSubmittedLoanPastPaidForm = false;
        }

        this.loanPastPaid = Object.assign(this.loanPastPaid, this.loanPastPaidForm.getRawValue());
        this.loanPastPaid.DueDate = this.datepipe.transform(this.loanPastPaidForm.value.DueDate, "ddMMyyyy");
        this.loanPastPaid.LastPaidDate = this.datepipe.transform(this.loanPastPaidForm.value.LastPaidDate, "ddMMyyyy");

        this.loanPastPaid.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
        if (this.loanPastPaid.PaidLoanID == null) {
            delete this.loanPastPaid.PaidLoanID;
        }
        this.spinner.show();
        this._loanService.SaveUpdatePastPaidLoans(this.loanPastPaid, this.loanDetail.TranId)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Loan.LoanPastPaidList) {
                this.loanPastPaidArray = baseResponse.Loan.LoanPastPaidList;
            }
            this.loanPastPaidForm.reset();

            this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        });
    }

    /**********************************************************************************************************/
    /*                        Current Loans                                                                  */
    /**********************************************************************************************************/

    currentLoansForm: FormGroup;
    currentLoans = new CurrentLoans();
    hasErrorCurrentLoansForm(controlName: string, errorName: string): boolean {
        return this.currentLoansForm?.controls[controlName].hasError(errorName);
    }
    createCurrentLoansForm() {
        this.currentLoansForm = this.formBuilder.group({
            PurposeDetail: [this.currentLoans.PurposeDetail,Validators.required],
            BankName: [this.currentLoans.BankName,Validators.required],
            TotalDebit: [this.currentLoans.TotalDebit,Validators.required],
            FundNonfundFlag: [this.currentLoans.FundNonfundFlag,Validators.required],
            GurenteeDetail: [this.currentLoans.GurenteeDetail,Validators.required],
            Status: [this.currentLoans.Status,Validators.required],
            DateDebitAcheive: [this.currentLoans.DateDebitAcheive,Validators.required],
            AmountToPaid: [this.currentLoans.AmountToPaid,Validators.required],
            DueDate: [this.currentLoans.DueDate,Validators.required],
            CurrentLoanID: [this.currentLoans.CurrentLoanID],
        });
    }

    /**********************************************************************************************************/
    /*                        Get Data                                                                        */

    /**********************************************************************************************************/

    getPersonalSuretiesForm() {
    }

    getCorporateSuretiesForm() {
    }

    getLoanRefrencesForm() {
    }

    getLoanWitnessForm() {
    }

    getLoanPastPaidForm() {
    }

    getCurrentLoansForm() {
    }


    onSaveCurrentLoansForm() {

        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
            return;
        }

        if (this.currentLoansForm.invalid) {
            const controls = this.currentLoansForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.isSubmittedCurrentLoansForm = true;
            //this.spinner.hide();
            return;
        }else{
            this.isSubmittedCurrentLoansForm = false;
        }

        this.currentLoans = Object.assign(this.currentLoans, this.currentLoansForm.getRawValue());

        //this.currentLoans.CurrentLoanID = 0;
        //this.currentLoans.LoanAppID = 0;
        this.currentLoans.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
        this.currentLoans.DateDebitAcheive = this.datepipe.transform(this.currentLoansForm.value.DateDebitAcheive, "ddMMyyyy");
        this.currentLoans.DueDate = this.datepipe.transform(this.currentLoansForm.value.DueDate, "ddMMyyyy");
        this.currentLoans.PurposeID = 8;
        this.currentLoans.BranchID = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle().Branch.BranchId;
        //this.currentLoans.Status = "";

        if (this.currentLoans.CurrentLoanID == null) {
            delete this.currentLoans.CurrentLoanID;
        }
        this.spinner.show();
        this._loanService.saveUpdateCurrentLoans(this.currentLoans, this.loanDetail.TranId)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Loan.CurrentLoansList)
                this.loanCurrentList = baseResponse.Loan.CurrentLoansList;
            this.currentLoansForm.reset()
            this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        });
    }


    /**********************************************************************************************************/
    /*                        Documents Attached                                                              */
    /**********************************************************************************************************/


    //CheckListForm: FormGroup;
    loanDocumentCheckListArray: LoanDocumentCheckList[] = [];
    today = new Date();


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
                        this.setCheckBoxFirstTime(this.loanDocumentsCheckList)
                    }
                });
        } else {
            this.layoutUtilsService.alertMessage("", "Loan details not found");
        }

    }

    setUnsetDocumentCheckBox(docObj) {

        this.loanDetail.ApplicationHeader.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
        if (docObj.checked) {
            var obj = new LoanDocumentCheckList();
            obj.DocumentID = docObj.source.value;
            obj.is_checked = true;
            obj.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
            this.loanDocumentCheckListArray.push(obj)
        } else {
            var docIndex = this.loanDocumentCheckListArray.findIndex(x => x.DocumentID == docObj.source.value);
            this.loanDocumentCheckListArray.splice(docIndex, 1)
        }

    }
    setCheckBoxFirstTime(docObj) {
        this.loanDocumentCheckListArray=[]
        this.loanDetail.ApplicationHeader.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    for(let i=0;i<docObj?.length;i++){
    if (docObj[i].isAttached) {
        var obj = new LoanDocumentCheckList();
        obj.DocumentID = docObj[i].DocumentID;
        obj.is_checked = true;
        obj.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
        this.loanDocumentCheckListArray.push(obj)
    }
}


    }

    CheckAttached(val) {
        return val;
    }

    saveCheckList() {
        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
            return;
        }
        if (this.loanDocumentCheckListArray?.length == 0) {
            var Message = 'Please attach atleast one document';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        //this.loanDetail = new Loan();
        //this.loanDetail.ApplicationHeader = new LoanApplicationHeader();
        // let final_checklist = []
        // this.loanDocumentsCheckList.forEach((single_checklist: any) => {
        //     if (single_checklist.is_checked == true) {
        //         final_checklist.push(single_checklist);
        //     }
        // })
        this.loanDetail.ApplicationHeader.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
        this.spinner.show();
        this._loanService.saveCheckList(this.loanDocumentCheckListArray, this.loanDetail.TranId)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
if(baseResponse.Success==true){
    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
}
else{
    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
}

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
                grid.SourceofIncome = item.SourceofIncome;
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
        delete CurrentLoanID.PurposeID;
        delete CurrentLoanID.BranchID
        delete CurrentLoanID.FundNonfundFlagName
        delete CurrentLoanID.StatusName
        if (CurrentLoanID.GurenteeDetail == undefined) {
            CurrentLoanID.GurenteeDetail = "";
        }
        CurrentLoanID = this.deleteInvalid(CurrentLoanID);

        this.currentLoansForm.setValue(CurrentLoanID);
        this.currentLoansForm.controls["DateDebitAcheive"].setValue(this._common.stringToDate(CurrentLoanID.DateDebitAcheive))
        this.currentLoansForm.controls["DueDate"].setValue(this._common.stringToDate(CurrentLoanID.DueDate))
    }

    onEditLoanWitnessArray(WitnessesID) {
        delete WitnessesID.branchId;
        WitnessesID = this.deleteInvalid(WitnessesID);
        this.loanWitnessForm.setValue(WitnessesID);
        this.EditableCnicWitness = WitnessesID.Cnic;
    }

    onEditLoanPastPaidArray(data
                                :
                                any
    ) {
        data = this.deleteInvalid(data);
        this.loanPastPaidForm.setValue(data);
        this.loanPastPaidForm.controls["DueDate"].setValue(this._common.stringToDate(data.DueDate));
        this.loanPastPaidForm.controls["LastPaidDate"].setValue(this._common.stringToDate(data.LastPaidDate));
    }

    onEditLoanCorporateSuretyArray(data
                                       :
                                       any
    ) {
        delete data.MemoDate
        data = this.deleteInvalid(data);
        this.corporateSuretiesForm.setValue(data);
        this.corporateSuretiesForm.controls["MemorandumDate"].setValue(this.convertDate(data.MemorandumDate));
    }

    onEditPersonalSureties(PersonalSuretyID) {
        PersonalSuretyID = this.deleteInvalid(PersonalSuretyID);
        this.personalSuretiesForm.setValue(PersonalSuretyID);
        this.EditableCnicSureties = PersonalSuretyID.Cnic;
    }

    onEditRefrence(ReferenceID) {
        ReferenceID = this.deleteInvalid(ReferenceID);
        this.loanRefrencesForm.setValue(ReferenceID);
        this.EditableCnicReference = ReferenceID.Cnic;
    }

    submitLoanApplication() {

        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
            return;
        }


        //this.loanDetail = new Loan();
        //this.loanDetail.ApplicationHeader = new LoanApplicationHeader();

        this.loanDetail.ApplicationHeader.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
        this.spinner.show();
        this._loanService.submitLoanApplication(this.loanDetail.ApplicationHeader, this.loanDetail.TranId)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {
if(baseResponse.Success==true){
    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
}
else{
    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
}

        });

    }


    async loadLovs() {
        this.status_lovs = await this.lovService.CallLovAPI({TagName: 'CurrentLoanStatus'})
        this.funded_lovs = await this.lovService.CallLovAPI({TagName: 'Facility'})
    }

    private convertDate(date) {
        var dateParts = date.split("-");
        return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    }

    private deleteInvalid(data) {
        delete data.LoanAppID;
        delete data.SrNo;
        return data;
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
    FundNonfundFlagName: string;
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
    StatusName: string;
    PurposeDetail: string;
}
