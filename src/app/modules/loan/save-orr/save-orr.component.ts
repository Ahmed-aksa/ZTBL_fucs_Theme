import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LoanService} from 'app/shared/services/loan.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'kt-save-orr',
    templateUrl: './save-orr.component.html',
    styles: []
})
export class SaveOrrComponent implements OnInit {
    public LnTransactionID: string;
    public Lcno: string;
    ORRForm: FormGroup;
    Cib: any[] = [];
    MarketReputation: any[] = [];
    ApplicationORR: any[] = [];
    CustomerORR: any[] = [];
    GlProposalORR: any[] = [];

    SoilIrrigation: any[] = [];
    LandOwnership: any[] = [];
    AvailabilityMarket: any[] = [];
    NetIncome: any[] = [];
    hasFormErrors = false;
    dataFetched = false;
    showFinalOrrTable = false;
    submitted = false;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _loanService: LoanService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,) {
    }

    ngOnInit() {

        this.createForm();
        this.getORRDropDowns();
    }

    ngAfterViewInit() {
        this.LnTransactionID = this.route.snapshot.params['LnTransactionID'];
        this.Lcno = this.route.snapshot.params['Lcno'];
        if ((this.LnTransactionID != undefined && this.LnTransactionID != null) && (this.Lcno != undefined && this.Lcno != null)) {
            this.getORRDropDownByAppID();
        }
    }

    createForm() {
        this.ORRForm = this.formBuilder.group({
            SoilTypeORRID: ['', [Validators.required]],
            LandOwnershipORRID: ['', [Validators.required]],
            MarketAvailabilityORRID: ['', [Validators.required]],
            NetIncodeORRID: ['', [Validators.required]],

        });
    }

    getORRDropDownByAppID() {
        this.spinner.show();

        this._loanService
            .getORRDropDownByAppID(this.LnTransactionID, this.Lcno)
            .pipe(
                finalize(() => {
                    this.dataFetched = true;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    this.Cib = baseResponse.Loan.ORR.Cib;
                    this.MarketReputation = baseResponse.Loan.ORR.MarketReputation;
                    this.ApplicationORR = baseResponse.Loan.ORR.ApplicationORR;
                    this.CustomerORR = baseResponse.Loan.ORR.CustomerORR;
                    this.GlProposalORR = baseResponse.Loan.ORR.GlProposalORR;
                    this.ORRForm.controls.SoilTypeORRID.setValue(this.ApplicationORR[0]?.SoilTypeORRID);
                    this.ORRForm.controls.LandOwnershipORRID.setValue(this.ApplicationORR[0]?.LandOwnershipORRID);
                    this.ORRForm.controls.MarketAvailabilityORRID.setValue(this.ApplicationORR[0]?.MarketAvailbilityORRID);
                    this.ORRForm.controls.NetIncodeORRID.setValue(this.ApplicationORR[0]?.NetIncomeORRID);
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });
    }

    getORRDropDowns() {

        this.spinner.show();

        this._loanService
            .getORRDropDowns()
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    this.SoilIrrigation = baseResponse.Loan.ORR.SoilIrrigation;
                    this.LandOwnership = baseResponse.Loan.ORR.LandOwnership;
                    this.AvailabilityMarket = baseResponse.Loan.ORR.AvailabilityMarket;
                    this.NetIncome = baseResponse.Loan.ORR.NetIncome;
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });
    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.ORRForm.controls[controlName].hasError(errorName);
    }

    getOrrRequest() {
        var ORR = {
            LoanAppCustomerORRDALList: this.CustomerORR,
            LoanAppGLDALList: this.GlProposalORR,
            LoanAppORRID: 0,
            SoilTypeORRID: this.ORRForm.controls.SoilTypeORRID.value,
            LandOwnershipORRID: this.ORRForm.controls.LandOwnershipORRID.value,
            MarketAvailabilityORRID: this.ORRForm.controls.MarketAvailabilityORRID.value,
            NetIncodeORRID: this.ORRForm.controls.NetIncodeORRID.value,
            LoanAppID: this.LnTransactionID,
            RepaymentBehaviorORRID: 55,
        };

        return ORR;
    }

    goToPendingList() {
        this.router.navigate(['../orr-list'], {relativeTo: this.activatedRoute});
    }

    SaveOrSubmit() {

        if(this.showFinalOrrTable){
            this.Save();
        }else{
            this.Submit();
        }
    }
    Submit(){}

    Save(){

        this.hasFormErrors = false;
        if (this.ORRForm.invalid) {
            const controls = this.ORRForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }


        this.spinner.show();
        this.submitted = true;
        var request = this.getOrrRequest();
        this._loanService
            .saveOrr(request)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });
    }

    togglePage() {
        this.showFinalOrrTable = !this.showFinalOrrTable;
    }
}
