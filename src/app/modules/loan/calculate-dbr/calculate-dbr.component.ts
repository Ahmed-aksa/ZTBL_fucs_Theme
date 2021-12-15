import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LoanDbr, SearchLoanDbr} from 'app/shared/models/Loan.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LoanService} from 'app/shared/services/loan.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
    selector: 'kt-calculate-dbr',
    templateUrl: './calculate-dbr.component.html',
    styleUrls: ['./calculate-dbr.component.scss']
})
export class CalculateDbrComponent implements OnInit {
    dataSource = new LoanDbr();
    public LnTransactionID: string;
    public Lcno: string;
    DBRForm: FormGroup;
    ApplicationHeader;

    totalDBRIncome:number=0;
    totalDBRLiabilities:number=0;
    DBR:number=0;
    constructor(private route: ActivatedRoute,
                private _loanService: LoanService,
                private cdRef: ChangeDetectorRef,
                private layoutUtilsService: LayoutUtilsService,
                private spinner: NgxSpinnerService,
                private fb: FormBuilder,) {
    }

    ngOnInit() {
       this.createForm()
    }
    createForm(){
        this.DBRForm = this.fb.group({
            Liabilites: [this.totalDBRLiabilities],
            Income: [this.totalDBRIncome],
            DBR: [this.DBR],
        });
    }
    ngAfterViewInit() {

        this.LnTransactionID = this.route.snapshot.params['LnTransactionID'];
        this.Lcno = this.route.snapshot.params['Lcno'];
        if ((this.LnTransactionID != undefined && this.LnTransactionID != null) && (this.Lcno != undefined && this.Lcno != null)) {
            this.getORRDropDownByAppID();
            this.searchLoanDbr();

        }
    }

    onIncomeChange(e) {
        let index = this.dataSource.DBRIncomeList.findIndex(inc => inc.ID === e.srcElement.id);
        this.dataSource.DBRIncomeList[index].Value = e.srcElement.value;

        this.DototalIncome()
    }
    onLiabChange(e) {
        let index = this.dataSource.DBRLiabilitiesList.findIndex(inc => inc.ID === e.srcElement.id);
        this.dataSource.DBRLiabilitiesList[index].Value = e.srcElement.value;


        this.DototalLiabilities();

    }
    DototalLiabilities(){
        this.totalDBRLiabilities=0;
        for(let i=0;i<this.dataSource.DBRLiabilitiesList.length;i++){
            if(this.dataSource.DBRLiabilitiesList[i].Value){
                this.totalDBRLiabilities = this.totalDBRLiabilities + Number(this.dataSource.DBRLiabilitiesList[i].Value);
            }

        }
        this.DBRForm.controls["Liabilites"].setValue(this.totalDBRLiabilities)
        this.DototalDBR()
    }
    DototalIncome(){
        this.totalDBRIncome=0;
        for(let i=0;i<this.dataSource.DBRIncomeList.length;i++){
            if(this.dataSource.DBRIncomeList[i].Value){
                this.totalDBRIncome = this.totalDBRIncome + Number(this.dataSource.DBRIncomeList[i].Value);
            }
        }
        if(this.totalDBRIncome){

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


    //checkAdult(id) {
    //  return  >= 18;
    //}
    saveLoanDbr() {
        this.spinner.show();
        let loanDBR;
        let tranId = 0;
        this._loanService
            .saveLoanDbr(this.dataSource, tranId)
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
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    this.ApplicationHeader = baseResponse.Loan.ApplicationHeader;
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

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
        debugger
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
                        this.dataSource = baseResponse.Loan.DBR;
                        this.dataSource.LoanAppID = Number(this.LnTransactionID);
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

}
