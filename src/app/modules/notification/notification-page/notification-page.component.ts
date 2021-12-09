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
    nBl;
    nUv;
    nLDef;

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
                  this.nLd = this.response.LoaneeMightBecomeDafaulter

              } else {
                  this.layoutUtilsService.alertElement("", baseResponse.Message);

              }
          })
   }

   click(number){
      if(number == 1){}
      else if(number == 2){
          this.router.navigateByUrl('/notifications/due-payments');
      }
      else if(number == 5){
          this.router.navigateByUrl('/notifications/loan-defaulters');
      }
      else if(number == 7){
          this.router.navigateByUrl('/notifications/cnic-expiry-loaner');
      }
   }

}
