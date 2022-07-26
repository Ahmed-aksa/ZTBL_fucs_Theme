import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
//PDF MAKER
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

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

    table_1: any;
    table_2: any;
    table_3: any;
    total_table2: any;

    response: any;

    public reports = new Bufrication();

    title = 'htmltopdf';

    @ViewChild('pdfTable') pdfTable: ElementRef;

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
      this.currentYear = date?._d?.getFullYear();
      this.lastYear = date?._d?.getFullYear()-1;
      this.showTable = false;
  }

  find(){
      //this.showTable = true;

      if (this.reportForm.invalid) {
          this.toastr.error("Please Enter Required values");
          this.reportForm.markAllAsTouched();
          return;
      }

      this.reports = Object.assign(this.reports, this.reportForm.value);
      this.reports.ReportsNo = "35";
      this.reports.WorkingDate = this.datePipe.transform(this.reports.WorkingDate, 'ddMMyyyy');
      //this.reports.ReportFormatType = "2";


      this.spinner.show();
      this._reports.reportDynamic(this.reports)
          .pipe(
              finalize(() => {
                  this.loaded = true;
                  this.loading = false;
                  this.spinner.hide();
              })
          )
          .subscribe((baseResponse: any) => {
              if (baseResponse.Success === true) {

                  this.showTable = true;  //Set After API Integrated
                  //this.controlReset();
                  this.response = JSON.parse(baseResponse?.Resp)
                  this.table_1 = this.response?.dataTable
                  this.table_2 = this.response?.dataTable2
                  this.table_3 = this.response?.dataTable3
                  console.log(this.response)
                  //window.open(baseResponse.ReportsFilterCustom.FilePath, 'Download');
              } else {
                  this.layoutUtilsService.alertElement("", baseResponse.Message);
              }
          })
  }

  printReport(){
      //
      // var printContents = document.getElementById('table').innerHTML;
      // var originalContents = document.body.innerHTML;
      // document.body.innerHTML = printContents;
      // window.print();
      // document.body.innerHTML = originalContents;
      //window.close();
      const doc = new jsPDF();

      const pdfTable = this.pdfTable.nativeElement;

      var html = htmlToPdfmake(pdfTable.innerHTML);

      // const documentDefinition = {
      //     info: {
      //         title: 'Zone_Branch_Wise_Recovery_Report',
      //         author: 'Ztbl',
      //         subject: 'Zone_Branch_Wise_Recovery_Report',
      //         keywords: 'Zone_Branch_Wise_Recovery_Report'
      //     },
      //     content: html
      // };
      const documentDefinition = {
          content: html
      };

      //pdfMake.createPdf(documentDefinition).open();
      pdfMake.createPdf(documentDefinition).download('Zone_Branch_Wise_Recovery_Report.pdf');
  }

}
