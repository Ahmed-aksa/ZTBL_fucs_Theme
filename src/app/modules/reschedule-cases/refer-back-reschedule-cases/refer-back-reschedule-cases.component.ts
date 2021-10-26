/* eslint-disable eol-last */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable curly */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Lov} from "../../../shared/classes/lov.class";
import {NgxSpinnerService} from "ngx-spinner";
import {LovService} from "../../../shared/services/lov.service";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs/operators";
import {ReschedulingService} from "../service/rescheduling.service";
import {Loan} from "../../../shared/models/Loan.model";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import { UserUtilsService } from 'app/shared/services/users_utils.service';

@Component({
  selector: 'app-refer-back-reschedule-cases',
  templateUrl: './refer-back-reschedule-cases.component.html',
  styleUrls: ['./refer-back-reschedule-cases.component.scss']
})
export class ReferBackRescheduleCasesComponent implements OnInit {

  displayedColumns = [
    "TransactionDate",
    "LoanApp",
    "GlDescription",
    "Status",
    "Scheme",
    "OldDate",
    "AcStatus",
    "View",
    "Submit",
];
dataSource: MatTableDataSource<ReferBack>;
LoggedInUserInfo: BaseResponseModel;
ELEMENT_DATA: ReferBack[] = [];
Mydata: any;
loanResch: any;
//Loan Status inventory
LoanStatus: any = [];
loanStatus: any = [];
SelectedLoanStatus: any = [];
public LovCall = new Lov();
public search = new Loan();
LoanTypes: any = [];

branch = null;
zone = null;

itemsPerPage = 10; //you could use your specified
totalItems: number | any;
pageIndex = 1;
dv: number | any; //use later

OffSet: any;

matTableLenght: boolean;

constructor(
    private spinner: NgxSpinnerService,
    private _reschedulingService: ReschedulingService,
    private cdRef: ChangeDetectorRef,
    private userUtilsService: UserUtilsService,
    private layoutUtilsService: LayoutUtilsService,
    private _lovService: LovService,
    private router: Router,
    private activatedRoute: ActivatedRoute
) {
    // this.getLoanStatus();
}

ngOnInit() {
    // this.getLoanStatus();

    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();


        //-------------------------------Loading Circle-------------------------------//
        if (this.LoggedInUserInfo.Branch && this.LoggedInUserInfo.Branch.BranchCode != null) {
          this.branch = this.LoggedInUserInfo.Branch;
          this.zone = this.LoggedInUserInfo.Zone;
        }

    this.spinner.show();

    this.loadData();
    this.spinner.hide();
}

getRow(rob) {
    //console.log(rob);
    this.loanResch = rob;
    console.log(this.loanResch);
}
editRefer(updateLoan) {
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

loadData() {
    this.search.LcNo = "";
    this.search.Appdt = "";
    this.search.Status = "4";
    this._reschedulingService
        .RescheduleSearch(this.search, this.branch, this.zone)
        .pipe(
            finalize(() => {
                this.spinner.hide();

                this.cdRef.detectChanges();
            })
        )
        .subscribe((baseResponse: BaseResponseModel) => {

            if (baseResponse.Success === true) {
                this.Mydata = baseResponse.Loan.ReschedulingSearch;
                for (let data in this.Mydata) {
                    this.ELEMENT_DATA.push({
                        transactionDate: this.Mydata[data].OrgUnitName,
                        loanApp: this.Mydata[data].LoanCaseNo,
                        glDescription: this.Mydata[data].GlDesc,
                        status: this.Mydata[data].StatusName,
                        scheme: this.Mydata[data].SchemeCode,
                        oldDate: this.Mydata[data].LastDueDate,
                        acStatus: this.Mydata[data].DisbStatusName,
                        LoanReschID: this.Mydata[data].LoanReshID,
                        remarks: this.Mydata[data].Remarks,
                    });
                }



                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
                console.log(this.dataSource)

                if (this.dataSource.data.length > 0) this.matTableLenght = true;
                else this.matTableLenght = false;

                this.dv = this.dataSource.filteredData;

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

paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
    this.itemsPerPage = pageSize;
    this.pageIndex = pageIndex;
    this.OffSet = pageIndex;
    //this.SearchJvData();
    //this.dv.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
    this.dataSource = this.dv.slice(
        pageIndex * this.itemsPerPage - this.itemsPerPage,
        pageIndex * this.itemsPerPage
    ); //slice is used to get limited amount of data from APi
}

SubmitData() {
    this.spinner.show();


    this._reschedulingService
        .SubmitRescheduleData(this.loanResch, this.branch, this.zone)
        .pipe(
            finalize(() => {
                this.spinner.hide();

                this.cdRef.detectChanges();
            })
        )
        .subscribe((baseResponse: BaseResponseModel) => {

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
}

interface ReferBack {
// branch: string;
transactionDate: string;
loanApp: string;
glDescription: string;
status: string;
scheme: string;
oldDate: string;
acStatus: string;
// submit: boolean;
LoanReschID: string;
remarks: string;
}