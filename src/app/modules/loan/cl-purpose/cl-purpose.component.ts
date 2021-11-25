import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

// RXJS
import {finalize} from 'rxjs/operators';

import {DatePipe} from '@angular/common';

import {NgxSpinnerService} from 'ngx-spinner';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateFormats, Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {GlConfigrationsDetail, Loan, LoanApplicationPurpose} from 'app/shared/models/Loan.model';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {MatDialog} from '@angular/material/dialog';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {LoanService} from 'app/shared/services/loan.service';
import {LovService} from 'app/shared/services/lov.service';
import {ClGlSchemeCropConfigurationComponent} from '../cl-gl-scheme-crop-configuration/cl-gl-scheme-crop-configuration.component';

@Component({
    selector: 'kt-cl-purpose',
    templateUrl: './cl-purpose.component.html',
    styleUrls: ['./cl-purpose.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}
    ]
})
export class ClPurposeComponent implements OnInit {

    //Global Variables
    //@Input() childMessage: string;

    @Input() loanDetail: Loan;

    purposeForm: FormGroup;
    public loanApplicationPurpose = new LoanApplicationPurpose();

    loanPurpose: LoanApplicationPurpose[] = [];


    editLoanApplicationPurpose: LoanApplicationPurpose[] = [];

    public glConfigrationsDetail = new GlConfigrationsDetail();

    today = new Date();
    hasFormErrors = false;
    MarkupCalcReadOnly: boolean;
    isCheckedEquity: boolean;
    LoggedInUserInfo: BaseResponseModel;

    //Lovs
    public LovCall = new Lov();
    public MakeCapacity: any;
    public MakeCapacitySelected: any;

    public MarkupCalcMode: any;
    public MarkupCalcModeSelected: any;

    public CultivatedUnits: any;
    public CultivatedUnitsSelected: any;

    public Facility: any;
    public FacilitySelected: any;


    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private userUtilsService: UserUtilsService,
        private _loanService: LoanService,
        private _lovService: LovService,
        private cdRef: ChangeDetectorRef,
        private spinner: NgxSpinnerService
    ) {
    }
    ngOnInit() {
        this.spinner.show();
        this.isCheckedEquity = false;
        this.MarkupCalcReadOnly = true;
        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

        this.createForm();
        this.LoadLovs();
        this.spinner.hide();
    }

    //-------------------------------Form Level Functions-------------------------------//
    createForm() {
        this.purposeForm = this.formBuilder.group({
            GlSubID: [this.loanApplicationPurpose.GlSubID, [Validators.required]],
            SchemeID: [this.loanApplicationPurpose.SchemeID],
            MarkupCalcMode: [this.loanApplicationPurpose.MarkupCalcMode, [Validators.required]],
            CropID: [this.loanApplicationPurpose.CropID],
            BwrAgreeInsurancePrem:['',[Validators.required]],
            CultivatedArea: [this.loanApplicationPurpose.CultivatedArea],
            RequiredItem: [this.loanApplicationPurpose.RequiredItem],
            Quantity: [this.loanApplicationPurpose.Quantity],
            FundNonFund: [this.loanApplicationPurpose.FundNonFund],
            TotalEstimatedCost: [this.loanApplicationPurpose.TotalEstimatedCost, [Validators.required]],
            AmountInHand: [this.loanApplicationPurpose.AmountInHand],
            AmountRequired: [this.loanApplicationPurpose.AmountRequired, [Validators.required]],
            NecessitiesDetail: [this.loanApplicationPurpose.NecessitiesDetail, [Validators.required]]
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.purposeForm.controls[controlName].hasError(errorName);
    }


    // Load Lovs
    async LoadLovs() {

        this.Facility = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Facility})
        this.Facility.LOVs = this._lovService.SortLovs(this.Facility.LOVs);
        this.Facility = this.Facility.LOVs;
        //MarkupCalcMode

        this.MarkupCalcMode = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.MarkupCalcMode})
        this.MarkupCalcMode.LOVs = this._lovService.SortLovs(this.MarkupCalcMode.LOVs);
        this.MarkupCalcMode = this.MarkupCalcMode.LOVs;
        this.purposeForm.controls['MarkupCalcMode'].setValue(this.MarkupCalcMode[0].Id);

        this.MakeCapacity = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.MakeCapacity})
        this.MakeCapacity.LOVs = this._lovService.SortLovs(this.MakeCapacity.LOVs);
        this.MakeCapacity = this.MakeCapacity.LOVs;
        this.MakeCapacitySelected = this.MakeCapacity;

        this.CultivatedUnits = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Units})
        this.CultivatedUnits.LOVs = this._lovService.SortLovs(this.CultivatedUnits.LOVs);
        this.CultivatedUnits = this.CultivatedUnits.LOVs;

    }


    searchCapacity(capacityId) {
        capacityId = capacityId.toLowerCase();
        if (capacityId != null && capacityId != undefined && capacityId != "")
            this.MakeCapacitySelected = this.MakeCapacity.filter(x => x.Name.toLowerCase().indexOf(capacityId) > -1);
        else
            this.MakeCapacitySelected = this.MakeCapacity;
    }

    validateCapacityOnFocusOut() {
        if (this.MakeCapacitySelected.length == 0)
            this.MakeCapacitySelected = this.MakeCapacity;
    }

    loadAppPurposeDataOnUpdate(appPurposeData) {

        this.editLoanApplicationPurpose = appPurposeData

        if (appPurposeData.length != 0)     {

            var tempArray: LoanApplicationPurposeGrid[] = [];
            appPurposeData.forEach(function (item, key) {

                var grid = new LoanApplicationPurposeGrid();

                grid.FundNonFund = item.FundNonFund;
                grid.BwrAgreeInsurancePrem = item.BwrAgreeInsurancePrem;
                grid.MarkupCalcMode = item.MarkupCalcMode;
                grid.LoanAppID = item.LoanAppID;
                grid.CropID = item.CropID;
                grid.CultivatedArea = item.CultivatedArea;
                grid.Unit = item.Unit;
                grid.SchemeID = item.SchemeID;
                grid.DevProdID = item.DevProdID;
                grid.RequiredItem = item.RequiredItem;
                grid.GlSubID = item.GlSubID;
                grid.LoanAppID = item.LoanAppID;
                grid.AmountRequired = item.AmountRequired;
                grid.NecessitiesDetail = item.NecessitiesDetail;
                grid.TotalEstimatedCost = item.TotalEstimatedCost;
                grid.Quantity = item.Quantity;
                grid.AmountInHand = item.AmountInHand;

                tempArray.push(grid);

            });
            this.loanPurpose = tempArray;
        }

    }


    onEditPurpose(GlSubID) {

        this.editLoanApplicationPurpose


        for (var i = 0; i < this.editLoanApplicationPurpose.length; i++) {

            if (this.editLoanApplicationPurpose[i].GlSubID == GlSubID) {
                if (this.editLoanApplicationPurpose[i] != null, this.editLoanApplicationPurpose[i] != undefined) {
                    if (this.editLoanApplicationPurpose[i].GlSubID != null, this.editLoanApplicationPurpose[i].GlSubID != undefined) {
                        this.purposeForm.controls["GlSubID"].setValue(this.editLoanApplicationPurpose[i].GlSubID);
                    }
                    if (this.editLoanApplicationPurpose[i].FundNonFund != null, this.editLoanApplicationPurpose[i].FundNonFund != "", this.editLoanApplicationPurpose[i].FundNonFund != undefined) {
                        //this.purposeForm.controls["FundNonFund"].setValue(this.editLoanApplicationPurpose[i].FundNonFund);
                        this.Facility
                    }
                    if (this.editLoanApplicationPurpose[i].AmountInHand != null, this.editLoanApplicationPurpose[i].AmountInHand != undefined) {
                        this.purposeForm.controls["AmountInHand"].setValue(this.editLoanApplicationPurpose[i].AmountInHand);
                    }
                    if (this.editLoanApplicationPurpose[i].AmountRequired != null, this.editLoanApplicationPurpose[i].AmountRequired != undefined) {
                        this.purposeForm.controls["AmountRequired"].setValue(this.editLoanApplicationPurpose[i].AmountRequired);
                    }
                    if (this.editLoanApplicationPurpose[i].CultivatedArea != null, this.editLoanApplicationPurpose[i].CultivatedArea != undefined) {
                        this.purposeForm.controls["CultivatedArea"].setValue(this.editLoanApplicationPurpose[i].CultivatedArea);
                    }
                    if (this.editLoanApplicationPurpose[i].CropID != null, this.editLoanApplicationPurpose[i].CropID != undefined) {
                        this.purposeForm.controls["CropID"].setValue(this.editLoanApplicationPurpose[i].CropID);
                    }
                    if (this.editLoanApplicationPurpose[i].SchemeID != null, this.editLoanApplicationPurpose[i].SchemeID != undefined) {
                        this.purposeForm.controls["SchemeID"].setValue(this.editLoanApplicationPurpose[i].SchemeID);
                    }
                    if (this.editLoanApplicationPurpose[i].TotalEstimatedCost != null, this.editLoanApplicationPurpose[i].TotalEstimatedCost != undefined) {
                        this.purposeForm.controls["TotalEstimatedCost"].setValue(this.editLoanApplicationPurpose[i].TotalEstimatedCost);
                    }
                    if (this.editLoanApplicationPurpose[i].Quantity != null, this.editLoanApplicationPurpose[i].Quantity != undefined) {
                        this.purposeForm.controls["Quantity"].setValue(this.editLoanApplicationPurpose[i].Quantity);
                    }
                    this.LoadLovs();

                    if (this.editLoanApplicationPurpose[i].SchemeID != null, this.editLoanApplicationPurpose[i].SchemeID != undefined) {
                        this.purposeForm.controls["RequiredItem"].setValue(this.editLoanApplicationPurpose[i].SchemeID);

                    }
                    //this.purposeForm.controls["FundNonFund"].setValue(this.editLoanApplicationPurpose[i].FundNonFund);
                    if (this.editLoanApplicationPurpose[i].FundNonFund != null, this.editLoanApplicationPurpose[i].FundNonFund != undefined) {
                        var devProdFlag = this.Facility.filter(x => x.Name == this.editLoanApplicationPurpose[i].FundNonFund); //[0].Id;
                        console.log(devProdFlag)
                        if (devProdFlag.length > 0) {
                            this.purposeForm.controls["FundNonFund"].setValue(devProdFlag[0].Id);
                        }
                    }
                }
            }
        }

    }

    changeRadio(val)
    {
        // this.
        // this.purposeForm.controls.

    }
    onDeletePurpose(GlSubID) {

        const _title = 'Confirmation';
        const _description = 'Do you really want to continue?';
        const _waitDesciption = '';
        const _deleteMessage = ``;

        const dialogRef = this.layoutUtilsService.AlertElementConfirmation(_title, _description, _waitDesciption);


        dialogRef.afterClosed().subscribe(res => {
            debugger
            if (!res) {
                return;
            }

            if (this.loanPurpose.length == 0) {
                return false;
            } else {
                if (GlSubID == null || GlSubID == undefined || GlSubID == "") {
                    this.cdRef.detectChanges();
                    return true;
                } else {
                    this.spinner.show();
                    this._loanService.deletePurpose(GlSubID)
                        .pipe(
                            finalize(() => {
                                this.spinner.hide();
                            })
                        )
                        .subscribe(baseResponse => {
                            const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                        })
                }


            }


        })


    }

    onClearSavePurpose() {
        this.purposeForm.controls["GlSubID"].setValue("");
        this.purposeForm.controls["SchemeID"].setValue("");
        this.purposeForm.controls["MarkupCalcMode"].setValue("");
        this.purposeForm.controls["CropID"].setValue("");
        this.purposeForm.controls["CultivatedArea"].setValue("");
        this.purposeForm.controls["RequiredItem"].setValue("");
        this.purposeForm.controls["Quantity"].setValue("");
        this.purposeForm.controls["FundNonFund"].setValue("");
        this.purposeForm.controls["TotalEstimatedCost"].setValue("");
        this.purposeForm.controls["AmountInHand"].setValue("");
        this.purposeForm.controls["AmountRequired"].setValue("");
        this.purposeForm.controls["NecessitiesDetail"].setValue("");
    }

    onSavePurpose() {
        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
            return;
        }

        this.hasFormErrors = false;
        if (this.purposeForm.invalid) {
            const controls = this.purposeForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }


        this.loanApplicationPurpose.AmountRequired = parseInt(this.purposeForm.controls["AmountRequired"].value);
        this.loanApplicationPurpose.AmountInHand = parseInt(this.purposeForm.controls["AmountInHand"].value);
        this.loanApplicationPurpose.TotalEstimatedCost = parseInt(this.purposeForm.controls["TotalEstimatedCost"].value);
        if (this.purposeForm.controls["FundNonFund"].value == null || this.purposeForm.controls["FundNonFund"].value == undefined) {
            this.purposeForm.controls["FundNonFund"].setValue("");
        }

        if (this.purposeForm.controls["AmountInHand"].value == null || this.purposeForm.controls["AmountInHand"].value == undefined) {
            this.purposeForm.controls["AmountInHand"].setValue("0");
        }

        if (this.purposeForm.controls["CropID"].value == null || this.purposeForm.controls["CropID"].value == undefined) {
            this.purposeForm.controls["CropID"].setValue("0");
        }

        if (this.purposeForm.controls["CultivatedArea"].value == null || this.purposeForm.controls["CultivatedArea"].value == undefined) {
            this.purposeForm.controls["CultivatedArea"].setValue("0");
        }

        if (this.purposeForm.controls["Quantity"].value == null || this.purposeForm.controls["Quantity"].value == undefined) {
            this.purposeForm.controls["Quantity"].setValue("0");
        }

        if (this.purposeForm.controls["RequiredItem"].value == null || this.purposeForm.controls["RequiredItem"].value == undefined) {
            this.purposeForm.controls["RequiredItem"].setValue("0");
        }
        if (this.purposeForm.controls["SchemeID"].value == null || this.purposeForm.controls["SchemeID"].value == undefined) {
            this.purposeForm.controls["SchemeID"].setValue("0");
        }
        this.loanApplicationPurpose = Object.assign(this.loanApplicationPurpose, this.purposeForm.getRawValue());
        if (this.isCheckedEquity == true) {
            var MarketPrice = this.loanApplicationPurpose.TotalEstimatedCost;
            var SumEquityLoan = 0;
            SumEquityLoan = this.loanApplicationPurpose.AmountRequired + this.loanApplicationPurpose.AmountInHand;

            if (MarketPrice != SumEquityLoan) {
                this.layoutUtilsService.alertMessage("", "Market Price Must be equal to sum of Equity and Loan Applied");
                return

            }
        }

        // if (this.isCheckedEquity == false) {
        //   var MarketPriceValue = this.loanApplicationPurpose.TotalEstimatedCost;
        //   var LoanAppliedValue = this.loanApplicationPurpose.AmountRequired;
        //   if (MarketPriceValue != LoanAppliedValue) {
        //     this.layoutUtilsService.alertMessage("", "Market Price Must be equal to Loan Applied");
        //     return
        //   }
        // }

        this.loanApplicationPurpose.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
        //this.loanApplicationPurpose.LoanAppID = 0;
        this.spinner.show();
        this._loanService.saveLoanApplicationPurpose(this.loanApplicationPurpose, this.loanDetail.TranId)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }
            });
    }

    GlschemeCropConfiguration() {
        this.loanApplicationPurpose = Object.assign(this.loanApplicationPurpose, this.purposeForm.getRawValue());
        const dialogRef = this.dialog.open(ClGlSchemeCropConfigurationComponent, {
            data: {glConfigrationsDetail: this.loanApplicationPurpose.GlSubID},
            disableClose: true,
            panelClass: ['w-full','h-screen','max-w-full','max-h-full']
        });
        dialogRef.afterClosed().subscribe(res => {

            console.log("res" + res)
            if (!res) {
                return;
            }
            this.purposeForm.controls.GlSubID.setValue(res.data);
        });

    }

}


export class LoanApplicationPurposeGrid {
    FundNonFund: string;
    BwrAgreeInsurancePrem: string;
    MarkupCalcMode: number;
    CropID: number;
    CultivatedArea: number;
    Unit: number;
    NecessitiesDetail: string;
    TotalEstimatedCost: number;
    Quantity: number;
    AmountInHand: number;
    AmountRequired: number;
    LoanAppID: number;
    RequiredItem: number;
    GlSubID: number;
    DevProdID: number;
    SchemeID: number;
}
