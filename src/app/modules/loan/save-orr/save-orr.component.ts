import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LoanService } from 'app/shared/services/loan.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'kt-save-orr',
  templateUrl: './save-orr.component.html',
  styles: []
})
export class SaveOrrComponent implements OnInit {

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
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _loanService: LoanService,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService, ) { }

  ngOnInit() {

    this.ORRForm = this.formBuilder.group({
      SoilTypeORRID: ['', [Validators.required]],
      LandOwnershipORRID: ['', [Validators.required]],
      MarketAvailabilityORRID: ['', [Validators.required]],
      NetIncodeORRID: ['', [Validators.required]],

    });
    this.getORRDropDowns();
    this.getORRDropDownByAppID();
  }

  getORRDropDownByAppID() {

    this.spinner.show();

    this._loanService
      .getORRDropDownByAppID("")
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
        }
        else {
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
        }
        else {
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
    var pgl = [];
    this.GlProposalORR.forEach(obj => {
      pgl.push({
        Remarks: "ok",
        LoanAppGlOrrID: obj.LoanAppGlORRID,
        GlID:0,
        PurposalID:0,
        SubPurposalID:0,
        GL: obj.GL,
        ProdID: obj.ProdID,
        DevID: 0,
        LoanAppID: obj.LoanAppID,      
        RecommendedAmount: obj.AmountRecommended
      });
    });

    var customers = [];
    this.CustomerORR.forEach(obj => {
      customers.push({
        Cnic: obj.Cnic,
        CustomerName: obj.CustomerName,
        LoanAppCustORRID: obj.LoanAppCustORRID,
        MajorBorrower: obj.MajorBorrower,
        Dob: obj.Dob,
        CustomerAgeOrrID: obj.CustAgeORR,
        EcibORRID: obj.EcibORRID,
        DefaultDays: obj.DefaultDays,
        ExperienceOrrID: obj.ExperienceORRID,
        MarketReputatinORRID: obj.MarketReputatinORRID,
        ENTERED_BY: "B-1562",
        LoanAppID:"2016727398"
      });
    });

    var ORR = {
      LoanAppCustomerORRDALList: customers,
      LoanAppGLDALList: pgl,
      LoanAppORRID:0,
      SoilTypeORRID: this.ORRForm.controls.SoilTypeORRID.value,
      LandOwnershipORRID: this.ORRForm.controls.LandOwnershipORRID.value,
      MarketAvailabilityORRID: this.ORRForm.controls.MarketAvailabilityORRID.value,
      NetIncodeORRID: this.ORRForm.controls.NetIncodeORRID.value,
      LoanAppID: 2016727398,
      RepaymentBehaviorORRID: 55,
    };

    return ORR;
  }

  goToPendingList() {  
    this.router.navigate(['../orr-list'], { relativeTo: this.activatedRoute });
  }

  save() {

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
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }

      });
  }

  togglePage() {
    this.showFinalOrrTable = !this.showFinalOrrTable;
  }
}
