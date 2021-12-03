import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { LoanDbr, SearchLoanDbr } from 'app/shared/models/Loan.model';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LoanService } from 'app/shared/services/loan.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'kt-calculate-dbr',
  templateUrl: './calculate-dbr.component.html',
  styleUrls: ['./calculate-dbr.component.scss']
})
export class CalculateDbrComponent implements OnInit {
  dataSource = new LoanDbr();
  public LnTransactionID: string;
  public Lcno: string;

  constructor(private route: ActivatedRoute,
    private _loanService: LoanService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

      this.LnTransactionID = this.route.snapshot.params['LnTransactionID'];
      this.Lcno = this.route.snapshot.params['Lcno'];
      if ((this.LnTransactionID != undefined && this.LnTransactionID != null) && (this.Lcno != undefined && this.Lcno != null)) {
          this.searchLoanDbr();

  }


}

  onIncomeChange(e) {
    let index = this.dataSource.DBRIncomeList.findIndex(inc => inc.ID === e.srcElement.id);
    this.dataSource.DBRIncomeList[index].Value = e.srcElement.value;
  }
  onLiabChange(e) {
    let index = this.dataSource.DBRLiabilitiesList.findIndex(inc => inc.ID === e.srcElement.id);
    this.dataSource.DBRLiabilitiesList[index].Value = e.srcElement.value;
  }

  //checkAdult(id) {
  //  return  >= 18;
  //}
  saveLoanDbr() {
    this.spinner.show();
    let loanDBR;
    let tranId=0;
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
        }
        else {

          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }
      },
        (error) => {

          this.layoutUtilsService.alertElementSuccess("", "Error Occured While Processing Request", "500");

        })
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
        }
        else {

          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }
      },
        (error) => {

          this.layoutUtilsService.alertElementSuccess("", "Error Occured While Processing Request", "500");

        })

  }

}
