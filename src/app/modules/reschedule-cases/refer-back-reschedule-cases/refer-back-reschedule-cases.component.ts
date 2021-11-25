/* eslint-disable eol-last */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable curly */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {DateFormats, Lov, LovConfigurationKey} from "../../../shared/classes/lov.class";
import {NgxSpinnerService} from "ngx-spinner";
import {LovService} from "../../../shared/services/lov.service";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs/operators";
import {ReschedulingService} from "../service/rescheduling.service";
import {Loan} from "../../../shared/models/Loan.model";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {CircleService} from "../../../shared/services/circle.service";

@Component({
  selector: 'app-refer-back-reschedule-cases',
  templateUrl: './refer-back-reschedule-cases.component.html',
  styleUrls: ['./refer-back-reschedule-cases.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class ReferBackRescheduleCasesComponent implements OnInit, AfterViewInit {

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
    referbackForm: FormGroup;
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
allowSubmit: boolean = false;
maxDate = new Date();

branch = null;
zone = null;

itemsPerPage = 10; //you could use your specified
totalItems: number | any;
pageIndex = 1;
dv: number | any; //use later

OffSet: any;

matTableLenght: boolean;
private loading: boolean;

constructor(
    private spinner: NgxSpinnerService,
    private _reschedulingService: ReschedulingService,
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
    private _circleService: CircleService,
    private _lovService: LovService,
    private activatedRoute: ActivatedRoute
) {
    // this.getLoanStatus();
}

ngOnInit() {
    // this.getLoanStatus();

    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
    this.createForm();
    this.getLoanStatus();

    if(this.zone){
        setTimeout(() => this.find(), 1000);
    }


    // this.spinner.show();
    //
    // this.loadData();
    // this.spinner.hide();
}

getRow(rob) {
    //
    this.loanResch = rob;

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

    async getLoanStatus() {
        this.LoanStatus = await this._lovService.CallLovAPI(
            (this.LovCall = { TagName: LovConfigurationKey.RescheduleStatus })
        );
        this.SelectedLoanStatus = this.LoanStatus.LOVs.reverse();
        this.referbackForm.controls["Status"].setValue(this.SelectedLoanStatus ? this.SelectedLoanStatus[3].Id : "");


    }

    createForm(){
        this.referbackForm = this.fb.group({
            TrDate: [''],
            Lcno: [''],
            Status: ['']
        });
    }

    find() {

        this.spinner.show();
        this.search = Object.assign(this.referbackForm.getRawValue());


        this._reschedulingService
            .RescheduleSearch(this.search, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                this.dataSource = null;
                this.ELEMENT_DATA = [];
                if (baseResponse.Success === true) {
                    this.allowSubmit = true;
                    this.loading = false;
                    this.Mydata = baseResponse.Loan.ReschedulingSearch;

                    for (let data in this.Mydata) {
                        this.ELEMENT_DATA.push({
                            LoanReschID: this.Mydata[data].LoanReshID,
                            remarks: this.Mydata[data].Remarks,
                            branch: this.Mydata[data].OrgUnitName,
                            transactionDate: this.Mydata[data].WorkingDate,
                            loanApp: this.Mydata[data].LoanCaseNo,
                            glDescription: this.Mydata[data].GlDesc,
                            status: this.Mydata[data].StatusName,
                            scheme: this.Mydata[data].SchemeCode,
                            oldDate: this.Mydata[data].LastDueDate,
                            acStatus: this.Mydata[data].DisbStatusName, submit: false
                        });
                    }

                    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);


                    if (this.dataSource.data.length > 0)
                        this.matTableLenght = true;
                    else this.matTableLenght = false;

                    this.dv = this.dataSource.filteredData;

                    this.totalItems = this.dataSource.filteredData.length;
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                    //
                    //
                } else {
                    this.allowSubmit = false;
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message
                    );
                }
                this.loading = false;
            });
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
                this.allowSubmit = true;
                this.Mydata = baseResponse.Loan.ReschedulingSearch;
                for (let data in this.Mydata) {
                    this.ELEMENT_DATA.push({
                        branch: "",
                        submit: false,
                        transactionDate: this.Mydata[data].OrgUnitName,
                        loanApp: this.Mydata[data].LoanCaseNo,
                        glDescription: this.Mydata[data].GlDesc,
                        status: this.Mydata[data].StatusName,
                        scheme: this.Mydata[data].SchemeCode,
                        oldDate: this.Mydata[data].LastDueDate,
                        acStatus: this.Mydata[data].DisbStatusName,
                        LoanReschID: this.Mydata[data].LoanReshID,
                        remarks: this.Mydata[data].Remarks
                    });
                }



                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);


                if (this.dataSource.data.length > 0) this.matTableLenght = true;
                else this.matTableLenght = false;

                this.dv = this.dataSource.filteredData;

                this.totalItems = this.dataSource.filteredData.length;
                this.OffSet = this.pageIndex;
                this.dataSource = this.dv.slice(0, this.itemsPerPage);

            } else {
                this.dataSource = null;
                this.allowSubmit = false;
                this.layoutUtilsService.alertElement(
                    "",
                    baseResponse.Message
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

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
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
                    baseResponse.Message
                );
            }
        });
}

    ngAfterViewInit(){
        if(this.zone){
            setTimeout(() => this.find(), 1000);
        }
    }
}

interface ReferBack {
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
