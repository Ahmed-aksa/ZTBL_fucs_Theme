import { Component, OnInit } from '@angular/core';
import {finalize} from "rxjs/operators";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {MatTableDataSource} from "@angular/material/table";
import {NotificationService} from "../service/notification.service";
import {NgxSpinnerService} from "ngx-spinner";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss']
})
export class NotificationPageComponent implements OnInit {

    nRcn;
    nDpi;
    nPcl;
    nIlt;
    nLd;
    nDc;
    nCel;
    nDn;
    nLn;
    nBl;
    nUv;
    nLDef;
    nFvc;

    response;


  constructor(
      private _notification: NotificationService,
      private spinner: NgxSpinnerService,
      private router: Router,
      private layoutUtilsService: LayoutUtilsService
  ) { }

  ngOnInit(): void {
      this.getNotificationCount()
  }


  getNotificationCount(){
      this.spinner.show();
      this._notification.notificationStatus()
          .pipe(
              finalize(() => {
                  this.spinner.hide();
              })
          )
          .subscribe((baseResponse: BaseResponseModel) => {
              if (baseResponse.Success === true) {
                  this.response = baseResponse.Notification.NotificationSummary;
                  this.nCel = this.response.CnicExpiryOfLoanee;
                  this.nDpi = this.response.LoaneePaymentInstallment;
                  this.nLd = this.response.LoaneeMightBecomeDafaulter;
                  this.nPcl = this.response.CustomerLeadsCount;
                  this.nIlt = this.response.SamNplLoansCount;
                  this.nFvc = this.response.FenceVoilationCount;
              } else {
                  this.layoutUtilsService.alertElement("", baseResponse.Message);

              }
          })
   }

   click(number){
      if(number == 1){
          this.router.navigateByUrl('/notifications/demand-notices');
      }
      else if(number == 2){
          this.router.navigateByUrl('/notifications/due-payments');
      }
      else if(number == 3){
          this.router.navigateByUrl('/notifications/possible-customer-leads');
      }else if(number == 4){
          this.router.navigateByUrl('/notifications/intimate-loaners-text');
      }
      else if(number == 5){
          this.router.navigateByUrl('/notifications/loan-defaulters');
      }
      else if(number == 7){
          this.router.navigateByUrl('/notifications/cnic-expiry-loaner');
      }
      else if(number == 8){
          this.router.navigateByUrl('/notifications/legal-notices');
      }
      else if(number == 9){
          this.router.navigateByUrl('/notifications/upcoming-tour-plan');
      }
      else if(number == 12){
          this.router.navigateByUrl('/notifications/get-fence-violation');
      }
   }

}
