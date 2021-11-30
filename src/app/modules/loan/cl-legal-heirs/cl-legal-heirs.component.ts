import {DatePipe} from '@angular/common';
import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatSelectChange} from '@angular/material/select';
import {DateFormats, Lov, LovConfigurationKey, MaskEnum} from 'app/shared/classes/lov.class';
import {LoanApplicationLegalHeirs} from 'app/shared/models/loan-application-header.model';
import {CustomersLoanApp, Loan} from 'app/shared/models/Loan.model';
import {CommonService} from 'app/shared/services/common.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LoanService} from 'app/shared/services/loan.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {of} from 'rxjs';
import {finalize} from 'rxjs/operators';


@Component({
    selector: 'kt-cl-legal-heirs',
    templateUrl: './cl-legal-heirs.component.html',
    styleUrls: ['./cl-legal-heirs.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ]
})
export class ClLegalHeirsComponent implements OnInit {
    @Input() loanDetail: Loan;
    legalHeirsForm: FormGroup;
    public legalHeirs = new LoanApplicationLegalHeirs();
    legalHeirsArray: LoanApplicationLegalHeirs[] = [];
    public RelationshipLov: any;
    public LovCall = new Lov();
    public GenderLov: any;
    public SelectedCustomersList: any = [];
    currentSelectedRelationship: string;

    public maskEnums = MaskEnum;
    today = new Date();
    containers = [];

    constructor(
        private formBuilder: FormBuilder,
        private _cdf: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private userUtilsService: UserUtilsService,
        private _loanService: LoanService,
        private datePipe: DatePipe,
        private _common: CommonService,
        private cdRef: ChangeDetectorRef,
        private _lovService: LovService,
        private spinner: NgxSpinnerService
    ) {

    }

    ngOnInit() {
        this.spinner.show();
        this.createForm();
        this.LoadLovs();
        this.spinner.hide();

    }

    add() {
        this.containers.push(this.containers.length);
    }

    createForm() {
        this.legalHeirsForm = this.formBuilder.group({
            CustomerID: [this.legalHeirs.CustomerID, [Validators.required]],
            LegalHeirsName: [this.legalHeirs.LegalHeirsName, [Validators.required]],
            Cnic: [this.legalHeirs.Cnic, [Validators.required]],
            RelationID: [this.legalHeirs.RelationID, [Validators.required]],
            Dob: [this.legalHeirs.Dob, [Validators.required]],
            PhoneCell: [this.legalHeirs.PhoneCell, [Validators.required, Validators.maxLength(11)]],
            PhoneOff: [this.legalHeirs.PhoneOff],
            Gender: [this.legalHeirs.Gender, [Validators.required]],
            CustomerName: [this.legalHeirs.CustomerName]
        });
    }

    loadCustomers(CustomersLoanAppList) {

        this.loanDetail.CustomersLoanList = JSON.parse(localStorage.getItem('customer_loan_list'));
        if (this.loanDetail != null) {
            if (this.loanDetail.CustomersLoanList.length > 0) {
                this.SelectedCustomersList = this.loanDetail.CustomersLoanList;
            }
        }
    }

    async LoadLovs() {

        var tempArray = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Relationship})
        this.RelationshipLov = tempArray.LOVs;
        this.GenderLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Gender});
        this.GenderLov = this._lovService.SortLovs(this.GenderLov.LOVs);
    }


    loadAppLegalHeirsDataOnUpdate(appLegalHeirsData, appCustomersLoanAppList) {

        this.legalHeirs = appLegalHeirsData


        var tempCustomerArray: LegalHiersGrid[] = [];


        for (var i = 0; i < appLegalHeirsData.length; i++) {

            var grid = new LegalHiersGrid();
            grid.UserID = appLegalHeirsData[i].ID;
            grid.ID = appLegalHeirsData[i].ID;
            grid.CustomerName = appLegalHeirsData[i].CustomerName;
            grid.CustomerID = appLegalHeirsData[i].CustomerID;
            grid.LegalHeirsName = appLegalHeirsData[i].LegalHeirsName;
            grid.Cnic = appLegalHeirsData[i].Cnic;
            grid.PhoneCell = appLegalHeirsData[i].PhoneCell;
            grid.Dob = appLegalHeirsData[i].Dob;
            var devProdFlag = this.RelationshipLov?.filter(x => x.Id == appLegalHeirsData[i].RelationID)
            if (devProdFlag?.length > 0) {
                grid.Relation = devProdFlag[0].Description;
            }

            tempCustomerArray.push(grid);

        }

        this.legalHeirsArray = tempCustomerArray;

    }

    setRelationshipValue(event: MatSelectChange) {
        this.currentSelectedRelationship = event.source.triggerValue;
    }

    onClearLegalHeirsForm() {


        this.legalHeirsForm.controls["CustomerID"].setValue("");
        this.legalHeirsForm.controls["Cnic"].setValue("");
        this.legalHeirsForm.controls["LegalHeirsName"].setValue("");
        this.legalHeirsForm.controls["Dob"].setValue("");
        this.legalHeirsForm.controls["RelationID"].setValue("");
        this.legalHeirsForm.controls["PhoneOff"].setValue("");
        this.legalHeirsForm.controls["PhoneCell"].setValue("");
        this.legalHeirsForm.controls["Gender"].setValue("");
        const controls = this.legalHeirsForm.controls;
        Object.keys(controls).forEach(controlName =>
            controls[controlName].markAsUntouched()
        );
    }

    onChange(val) {

        this.legalHeirsForm.controls.CustomerName.setValue(val.CustomerName)
    }

    onSaveLegalHeirsForm() {


        //if (this.loanDetail == null || this.loanDetail == undefined) {
        //  this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
        //  return;
        //}

        if (this.legalHeirsForm.invalid) {
            const controls = this.legalHeirsForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            return;
        }

        var duplicateCustomer = this.legalHeirsArray.filter(x => x.Cnic == this.legalHeirsForm.controls['Cnic'].value)[0];
        if (duplicateCustomer != undefined && duplicateCustomer != null) {
            this.layoutUtilsService.alertElement("", "Customer CNIC Already Added", "Duplicate Cutomer");
            return;
        }


        //this.legalHeirs = Object.assign(this.legalHeirs, this.legalHeirsForm.getRawValue());
        this.legalHeirs.UserID = "0";
        //this.legalHeirs.LoanAppID = 0;
        this.legalHeirs.DobTxt = this.datePipe.transform(this.legalHeirs.Dob, "dd-MM-yyyy");
        this.legalHeirs.Dob = this.datePipe.transform(this.legalHeirs.Dob, "ddMMyyyy");
        this.legalHeirsForm.controls["Dob"].setValue(this.datePipe.transform(this.legalHeirsForm.value.Dob, "ddMMyyyy"))


        this.legalHeirs = Object.assign(this.legalHeirsForm.value, this.legalHeirsForm.getRawValue());
        var arr = this.loanDetail.ApplicationHeader.LoanAppID;

        this.spinner.show();
        this._loanService.saveLoanApplicationLegalHeirs(this.legalHeirs, this.loanDetail.TranId, arr)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe(baseResponse => {

            if (baseResponse.Success) {

                this.legalHeirs = this.legalHeirsForm.value;
                var legalHeirsGrid = new LoanApplicationLegalHeirs();

                legalHeirsGrid.CustomerID = this.legalHeirs.CustomerID;
                legalHeirsGrid.CustomerName = this.legalHeirs.CustomerName;
                legalHeirsGrid.LegalHeirsName = this.legalHeirs.LegalHeirsName;
                legalHeirsGrid.Cnic = this.legalHeirs.Cnic;
                legalHeirsGrid.RelationID = this.legalHeirs.RelationID;
                legalHeirsGrid.Dob = this.legalHeirs.Dob;
                legalHeirsGrid.DobTxt = this.legalHeirs.DobTxt;
                legalHeirsGrid.PhoneCell = this.legalHeirs.PhoneCell;
                legalHeirsGrid.PhoneOff = this.legalHeirs.PhoneOff;
                legalHeirsGrid.Gender = this.legalHeirs.Gender;
                legalHeirsGrid.Relation = this.currentSelectedRelationship;
                legalHeirsGrid.UserID = baseResponse.Loan.LoanApplicationLegalHeirs.ID;

                this.legalHeirsArray.push(legalHeirsGrid);
                this.legalHeirsForm.reset();
                this.legalHeirsForm.markAsPristine();
                this.legalHeirsForm.markAsUntouched();
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
            } else {
                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
            }
        });
    }

    onDeleteLegalHeirs(legalHeir, index) {

        const _title = 'Confirmation';
        const _description = 'Do you really want to continue?';
        const _waitDesciption = '';
        const _deleteMessage = ``;
        this.legalHeirs.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;

        const dialogRef = this.layoutUtilsService.AlertElementConfirmation(_title, _description, _waitDesciption);
        dialogRef.afterClosed().subscribe(res => {

            debugger;
            if (!res) {
                return;
            }

            if (this.legalHeirsArray.length == 0) {
                return false;
            } else {
                if (legalHeir == null || legalHeir == undefined || legalHeir == "") {
                    return true;
                } else {
                    this.spinner.show();
                    this._loanService.deleteLegalHeirs(legalHeir, this.legalHeirs.LoanAppID)
                        .pipe(
                            finalize(() => {
                                this.spinner.hide();
                            })
                        )
                        .subscribe(baseResponse => {
                            if (baseResponse.Success === true) {

                                this.legalHeirsArray.splice(index, 1);

                                this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);

                            }

                        })

                }


            }


        })
    }

}


export class LegalHiersGrid {
    UserID: string;
    LegalHeirsName: string;
    PhoneRes: string;
    PhoneOff: string;
    PhoneCell: string;
    Cnic: string;
    Dob: string;
    DobTxt: string;
    Gender: string;
    RelationID: number;
    Relation: string;
    LoanAppID: number;
    CustomerID: string;
    CustomerName: string;
    ID: string
}
