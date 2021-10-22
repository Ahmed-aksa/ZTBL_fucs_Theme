/* eslint-disable curly */
/* eslint-disable guard-for-in */
/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable arrow-parens */
/* eslint-disable no-debugger */
/* eslint-disable prefer-const */
/* eslint-disable eol-last */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Lov } from 'app/shared/classes/lov.class';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { Loan } from 'app/shared/models/loan-application-header.model';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { ReschedulingService } from '../service/rescheduling.service';

@Component({
  selector: 'app-pending-reschedule-cases',
  templateUrl: './pending-reschedule-cases.component.html',
  styleUrls: ['./pending-reschedule-cases.component.scss']
})
export class PendingRescheduleCasesComponent implements OnInit {
  displayedColumns = ['Branch', 'TransactionDate', 'LoanApp', 'GlDescription', 'Status', 'Scheme', 'OldDate','AcStatus', 'View', 'Submit'];

  dataSource : MatTableDataSource<Pending>;
  ELEMENT_DATA: Pending[] = [];
  Mydata: any;
  //Loan Status inventory
  loanResch: any;
  //pagination
  itemsPerPage = 10; //you could use your specified
  totalItems: number | any;
  pageIndex = 1;
  dv: number | any; //use later

  OffSet: any;

  matTableLenght: boolean;

  LoanStatus: any = [];
  loanStatus: any = [];
  SelectedLoanStatus: any = [];
  public LovCall = new Lov();
  public search = new Loan();
  LoanTypes: any = [];
  constructor(
    private spinner: NgxSpinnerService,
    private _reschedulingService: ReschedulingService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.spinner.hide();
    this.loadData();
  }


  loadData(){
    this.search.LcNo = "";
    this.search.Appdt = "";
    this.search.Status = "1";
    this._reschedulingService
      .RescheduleSearch(this.search)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        if (baseResponse.Success === true) {
          this.Mydata = baseResponse.Loan.ReschedulingSearch;
          console.log(this.Mydata)
          debugger;
          for (let data in this.Mydata) {
            this.ELEMENT_DATA.push({
              branch: this.Mydata[data].OrgUnitName,
              transactionDate: this.Mydata[data].WorkingDate,
              loanApp: this.Mydata[data].LoanCaseNo,
              glDescription: this.Mydata[data].GlDesc,
              status: this.Mydata[data].StatusName,
              scheme: this.Mydata[data].SchemeCode,
              oldDate: this.Mydata[data].LastDueDate,
              acStatus: this.Mydata[data].DisbStatusName,
              submit: this.Mydata[data].EnteredDate,
              LoanReschID: this.Mydata[data].LoanReshID,
              remarks: this.Mydata[data].Remarks,
            });
          }

          debugger;
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          console.log(this.dataSource)
          
          if (this.dataSource.data.length > 0)
            this.matTableLenght = true;
          else
            this.matTableLenght = false;
          
          this.dv = this.dataSource.filteredData;
          debugger;
          this.totalItems = this.dataSource.filteredData.length;
          this.OffSet = this.pageIndex;
          this.dataSource = this.dv.slice(0, this.itemsPerPage);

        } else {
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
        }
      });
  }

  getRow(rob){
    //console.log(rob);
    this.loanResch = rob;
    console.log(this.loanResch)
  }

  SubmitData(){
    this.spinner.show();
    
    debugger;
    this._reschedulingService
      .SubmitRescheduleData(this.loanResch)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        if (baseResponse.Success === true) {
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
          this.router.navigateByUrl("/journal-voucher/form");
        } else {
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
        }
      });
  }


  paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
    this.itemsPerPage = pageSize;
    this.pageIndex = pageIndex;
    this.OffSet = pageIndex;
    //this.SearchJvData();
    //this.dv.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
    this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
  }

  editPen(updateLoan){
    debugger;
    console.log(updateLoan);
    this.router.navigate(
      [
        "../make-reschedule",
        {
          LnTransactionID: updateLoan.loanApp,
          loanReschID: updateLoan.LoanReschID,
        },
      ],
      { relativeTo: this.activatedRoute }
    );
  }

}

interface Pending{
  branch: string;
  transactionDate: string;
  loanApp: string;
  glDescription: string;
  status: string;
  scheme: string;
  oldDate: string;
  acStatus: string;
  submit: boolean;
  LoanReschID: string;
  remarks: string;
}