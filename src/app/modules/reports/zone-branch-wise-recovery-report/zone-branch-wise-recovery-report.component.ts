import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Bufrication} from "../class/reports";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";
import {finalize} from "rxjs/operators";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LovService} from "../../../shared/services/lov.service";
import {ReportsService} from "../service/reports.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {BaseResponseModel} from "../../../shared/models/base_response.model";

@Component({
    selector: 'app-zone-branch-wise-recovery-report',
    templateUrl: './zone-branch-wise-recovery-report.component.html',
    styleUrls: ['./zone-branch-wise-recovery-report.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})

export class ZoneBranchWiseRecoveryReportComponent implements OnInit {
    reportForm: FormGroup
    currentTime = new Date()
    currentYear;
    lastYear;
    showTable = false;

    loaded = true;
    LoggedInUserInfo: BaseResponseModel;
    statusLov: any;
    loading = false;

    public reports = new Bufrication();
  constructor(
      private fb: FormBuilder,
      private userUtilsService: UserUtilsService,
      private _lovService: LovService,
      private datePipe: DatePipe,
      private _bufrication: ReportsService,
      private layoutUtilsService: LayoutUtilsService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      private _reports: ReportsService,
      private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
      this.reportForm = this.fb.group({
          WorkingDate: [null, Validators.required]
      })

  }

  setDate(){
      const date = this.reportForm.controls.WorkingDate.value;
      console.log(this.currentTime)
      console.log(date)
      this.currentYear = date?._d?.getFullYear();
      this.lastYear = date?._d?.getFullYear()-1;
  }

  find(){
      this.showTable = true;

      // if (this.reportForm.invalid) {
      //     this.toastr.error("Please Enter Required values");
      //     this.reportForm.markAllAsTouched();
      //     return;
      // }
      //
      // this.reports = Object.assign(this.reports, this.reportForm.value);
      // this.reports.ReportsNo = "35";
      // //this.reports.ReportFormatType = "2";
      //
      //
      // this.spinner.show();
      // this._reports.reportDynamic(this.reports)
      //     .pipe(
      //         finalize(() => {
      //             this.loaded = true;
      //             this.loading = false;
      //             this.spinner.hide();
      //         })
      //     )
      //     .subscribe((baseResponse: any) => {
      //         if (baseResponse.Success === true) {
      //             //this.showTable = true;  Set After API Integrated
      //             //this.controlReset();
      //             //window.open(baseResponse.ReportsFilterCustom.FilePath, 'Download');
      //         } else {
      //             this.layoutUtilsService.alertElement("", baseResponse.Message);
      //         }
      //     })
  }

  printReport(){
      window.print();
  }

}
