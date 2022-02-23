import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LoanService} from 'app/shared/services/loan.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {ViewMapsComponent} from "../../../shared/component/view-map/view-map.component";
import {CalculateDbrComponent} from "../calculate-dbr/calculate-dbr.component";
import {LoanDbr, SearchLoanDbr} from "../../../shared/models/Loan.model";
import {Activity} from "../../../shared/models/activity.model";
import {UserUtilsService} from "../../../shared/services/users_utils.service";

@Component({
    selector: 'kt-save-orr',
    templateUrl: './save-orr.component.html',
    styles: []
})
export class SaveOrrComponent implements OnInit {
    Orrapplied: boolean = false;
    public LnTransactionID: string;
    public Lcno: string;
    ORRForm: FormGroup;
    Cib: any[] = [];
    MarketReputation: any[] = [];
    ApplicationORR: any[] = [];
    CustomerORR: any[] = [];
    GlProposalORR: any[] = [];
    ApplicationHeader;
    SoilIrrigation: any[] = [];
    LandOwnership: any[] = [];
    AvailabilityMarket: any[] = [];
    NetIncome: any[] = [];
    hasFormErrors = false;
    dataFetched = false;
    showFinalOrrTable = false;
    submitted = false;
    submitArray;

    dataSourcee = new LoanDbr();
    DBRForm: FormGroup;
    isReadOnly:boolean=true;
    totalDBRIncome:number=0;
    totalDBRLiabilities:number=0;
    DBR:number=0;
    Flag;
    currentActivity: Activity

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _loanService: LoanService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private fb: FormBuilder,
        private userUtilService: UserUtilsService,
        private cdRef: ChangeDetectorRef,) {
    }

    ngOnInit() {
        this.currentActivity = this.userUtilService.getActivity('Save ORR')
        this.Flag = this.route.snapshot.params['Flag'];
        if(this.Flag==1){
            this.isReadOnly=false;
        }
        this.createForm();
        this.createFormm();
        this.getORRDropDowns();
    }

    ngAfterViewInit() {
        this.LnTransactionID = this.route.snapshot.params['LnTransactionID'];
        this.Lcno = this.route.snapshot.params['Lcno'];
        if ((this.LnTransactionID != undefined && this.LnTransactionID != null) && (this.Lcno != undefined && this.Lcno != null)) {
            this.getORRDropDownByAppID();
            this.searchLoanDbr();
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

    saveLoanDbr() {
        if (this.Orrapplied === false) {
            var Message = 'Please check ORR Applied before submitting';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        this.spinner.show();
        let loanDBR;
        let tranId = 0;
        this._loanService
            .saveLoanDbr(this.dataSourcee, tranId)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                }))
            .subscribe((baseResponse: BaseResponseModel) => {

                    if (baseResponse.Success === true) {
                        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                        this.cdRef.detectChanges();
                    } else {

                        this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                    }
                },
                (error) => {

                    this.layoutUtilsService.alertElementSuccess("", "Error Occured While Processing Request", "500");

                })
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

                    this.ApplicationHeader = baseResponse.Loan.ApplicationHeader;
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

    getOrrRequestForSubmit() {
        var ORR = {
            OrrSubmitList: this.submitArray,
            // LoanAppGLDALList: this.GlProposalORR,
            // LoanAppORRID: 0,
            // SoilTypeORRID: this.ORRForm.controls.SoilTypeORRID.value,
            // LandOwnershipORRID: this.ORRForm.controls.LandOwnershipORRID.value,
            // MarketAvailabilityORRID: this.ORRForm.controls.MarketAvailabilityORRID.value,
            // NetIncodeORRID: this.ORRForm.controls.NetIncodeORRID.value,
            // LoanAppID: this.LnTransactionID,
            // RepaymentBehaviorORRID: 55,
        };

        return ORR;
    }

    goToPendingList() {
        this.router.navigate(['../orr-list'], {relativeTo: this.activatedRoute});
    }

    SaveOrSubmit() {

        for (let i = 0; i < this.CustomerORR?.length; i++) {
            if (!this.CustomerORR[i]?.EcibORRID) {
                var Message = 'Please select CIB Report against CNIC ' + this.CustomerORR[i].Cnic;
                this.layoutUtilsService.alertElement(
                    '',
                    Message,
                    null
                );
                return;
            }
        }

        for (let i = 0; i < this.CustomerORR?.length; i++) {
            if (!this.CustomerORR[i]?.DefaultDays) {
                // this.CustomerORR[i]["DefaultDays"]=0;
                var Message = 'Please Enter default days against CNIC ' + this.CustomerORR[i].Cnic;
                this.layoutUtilsService.alertElement(
                    '',
                    Message,
                    null
                );
                return;
            }
        }

        for (let i = 0; i < this.CustomerORR?.length; i++) {
            if (!this.CustomerORR[i]?.Experience) {
                var Message = 'Please Enter Experience against CNIC ' + this.CustomerORR[i].Cnic;
                this.layoutUtilsService.alertElement(
                    '',
                    Message,
                    null
                );
                return;
            }
        }

        for (let i = 0; i < this.CustomerORR?.length; i++) {
            if (!this.CustomerORR[i]?.MarketReputationORRID) {
                var Message = 'Please select Market Reputation against CNIC' + this.CustomerORR[i].Cnic;
                this.layoutUtilsService.alertElement(
                    '',
                    Message,
                    null
                );
                return;
            }
        }

        for (let i = 0; i < this.GlProposalORR?.length; i++) {
            if (this.GlProposalORR[i]?.RecommendedAmount == 0 || this.GlProposalORR[i]?.RecommendedAmount == "") {
                var Message = 'Please Enter recommended amount';
                this.layoutUtilsService.alertElement(
                    '',
                    Message,
                    null
                );
                return;
            }
        }


        if (this.showFinalOrrTable === true) {
            this.Submit();
        } else {
            this.Save();
        }
    }

    calculateDBR() {
let data={
    LnTransactionID:  this.LnTransactionID,
    Lcno: this.Lcno
};
        const dialogRef = this.dialog.open(CalculateDbrComponent, {
            panelClass: ['h-screen', 'max-w-full', 'max-h-full'],
            width: '100%',
            data: data,
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
        });
    }


    Submit() {

        if (this.Orrapplied === false) {
            var Message = 'Please check ORR Applied before submitting';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

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
        var request = this.getOrrRequestForSubmit();
        this._loanService
            .submitOrr(request)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    // this.router.navigate(
                    //     ['../calculte-dbr',
                    //         { LnTransactionID: this.LnTransactionID, Lcno: this.Lcno,Flag:"1" }],
                    //     { relativeTo: this.activatedRoute }
                    // );
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });
    }

    getValue(DefaultDays){
        if(DefaultDays){
            return DefaultDays;
        }else{
            return 0;
        }

    }

    Save() {

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
                    this.submitArray = baseResponse?.Loan?.ORR["OrrSubmitList"];

                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });
    }

    togglePage() {
        for (let i = 0; i < this.CustomerORR?.length; i++) {
            if (!this.CustomerORR[i]?.EcibORRID) {
                var Message = 'Please select CIB Report against CNIC ' + this.CustomerORR[i].Cnic;
                this.layoutUtilsService.alertElement(
                    '',
                    Message,
                    null
                );
                return;
            }
        }

        for (let i = 0; i < this.CustomerORR?.length; i++) {
            if (!this.CustomerORR[i]?.DefaultDays) {
                // this.CustomerORR[i]["DefaultDays"]=0;
                var Message = 'Please Enter default days against CNIC ' + this.CustomerORR[i].Cnic;
                this.layoutUtilsService.alertElement(
                    '',
                    Message,
                    null
                );
                return;
            }
        }

        for (let i = 0; i < this.CustomerORR?.length; i++) {
            if (!this.CustomerORR[i]?.Experience) {
                var Message = 'Please Enter Experience against CNIC ' + this.CustomerORR[i].Cnic;
                this.layoutUtilsService.alertElement(
                    '',
                    Message,
                    null
                );
                return;
            }
        }

        for (let i = 0; i < this.CustomerORR?.length; i++) {
            if (!this.CustomerORR[i]?.MarketReputationORRID) {
                var Message = 'Please select Market Reputation against CNIC' + this.CustomerORR[i].Cnic;
                this.layoutUtilsService.alertElement(
                    '',
                    Message,
                    null
                );
                return;
            }
        }

        for (let i = 0; i < this.GlProposalORR?.length; i++) {
            if (this.GlProposalORR[i]?.RecommendedAmount == 0 || this.GlProposalORR[i]?.RecommendedAmount == "") {
                var Message = 'Please Enter recommended amount';
                this.layoutUtilsService.alertElement(
                    '',
                    Message,
                    null
                );
                return;
            }
        }

        this.Orrapplied = false;
        this.showFinalOrrTable = !this.showFinalOrrTable;
    }

    //Calculate DBR Start
    createFormm(){
        this.DBRForm = this.fb.group({
            Liabilites: [this.totalDBRLiabilities],
            Income: [this.totalDBRIncome],
            DBR: [this.DBR],
        });
    }
    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    searchLoanDbr() {

        this.spinner.show();
        let loanFilter = new SearchLoanDbr();
        loanFilter.LoanAppID = Number(this.LnTransactionID)//20201642051;


        this._loanService
            .searchLoanDbr(loanFilter)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                }))
            .subscribe((baseResponse: BaseResponseModel) => {

                    if (baseResponse.Success === true) {
                        this.dataSourcee = baseResponse.Loan.DBR;
                        this.dataSourcee.LoanAppID = Number(this.LnTransactionID);
                        this.cdRef.detectChanges();
                        this.DototalIncome();
                        this.DototalLiabilities();

                    } else {

                        this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                    }
                },
                (error) => {

                    this.layoutUtilsService.alertElementSuccess("", "Error Occured While Processing Request", "500");

                })

    }
    onIncomeChange(e) {

        let index = this.dataSourcee.DBRIncomeList.findIndex(inc => inc.ID === e.srcElement.id);
        this.dataSourcee.DBRIncomeList[index].Value = e.srcElement.value;

        this.DototalIncome()
    }
    onLiabChange(e) {

        let index = this.dataSourcee.DBRLiabilitiesList.findIndex(inc => inc.ID === e.srcElement.id);
        this.dataSourcee.DBRLiabilitiesList[index].Value = e.srcElement.value;


        this.DototalLiabilities();

    }
    DototalLiabilities(){
        this.totalDBRLiabilities=0;
        for(let i=0;i<this.dataSourcee.DBRLiabilitiesList.length;i++){
            if(this.dataSourcee.DBRLiabilitiesList[i].Value){
                this.totalDBRLiabilities = this.totalDBRLiabilities + Number(this.dataSourcee.DBRLiabilitiesList[i].Value);
            }

        }
            this.DBRForm.controls["Liabilites"].setValue(this.totalDBRLiabilities)
        this.DototalDBR()
    }
    DototalIncome(){

        this.totalDBRIncome=0;
        for(let i=0;i<this.dataSourcee.DBRIncomeList.length;i++){
            if(this.dataSourcee.DBRIncomeList[i].Value){
                this.totalDBRIncome = this.totalDBRIncome + Number(this.dataSourcee.DBRIncomeList[i].Value);
            }
        }
            this.DBRForm.controls["Income"].setValue(this.totalDBRIncome)
        this.DototalDBR()
    }
    DototalDBR(){
        this.DBR=0;
        // if after decimal values are not required
        // this.DBR =  Math.round((this.totalDBRLiabilities / this.totalDBRIncome)*100)
        this.DBR = (this.totalDBRLiabilities / this.totalDBRIncome)*100
        this.DBRForm.controls["DBR"].setValue(this.DBR.toFixed(2))
    }
    //Calculate DBR End
}
