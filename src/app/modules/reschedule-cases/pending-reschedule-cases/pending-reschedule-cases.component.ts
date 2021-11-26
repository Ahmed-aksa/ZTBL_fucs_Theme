/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {DateFormats, Lov, LovConfigurationKey} from '../../../shared/classes/lov.class';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel } from '../../../shared/models/base_response.model';
import { finalize } from 'rxjs/operators';
import { ReschedulingService } from '../service/rescheduling.service';
import { LayoutUtilsService } from '../../../shared/services/layout_utils.service';
import { Loan } from '../../../shared/models/Loan.model';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {CircleService} from '../../../shared/services/circle.service';
import {LovService} from '../../../shared/services/lov.service';

@Component({
    selector: 'app-pending-reschedule-cases',
    templateUrl: './pending-reschedule-cases.component.html',
    styleUrls: ['./pending-reschedule-cases.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class PendingRescheduleCasesComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'Branch',
        'TransactionDate',
        'LoanApp',
        'GlDescription',
        'Status',
        'Scheme',
        'OldDate',
        'AcStatus',
        'View',
        'Submit',
    ];

    dataSource: MatTableDataSource<Pending>;
    ELEMENT_DATA: Pending[] = [];
    Mydata: any;
    //Loan Status inventory
    loanResch: any;
    allowSubmit: boolean = false;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    dv: number | any; //use later
    LoggedInUserInfo: BaseResponseModel;
    OffSet: any;
    maxDate = new Date();

    pendingForm: FormGroup;

    branch = null;
    zone = null;

    matTableLenght: boolean;

    LoanStatus: any = [];
    loanStatus: any = [];
    SelectedLoanStatus: any = [];
    public LovCall = new Lov();
    public search = new Loan();
    LoanTypes: any = [];
    private rcSearch: any;
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
    ) {}

    ngOnInit() {
      this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
      this.createForm();
        this.getLoanStatus();

        if(this.LoggedInUserInfo.Branch.WorkingDate){
            let dateString = this.LoggedInUserInfo.Branch.WorkingDate;
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));
            this.maxDate = new Date(year, month - 1, day);
        }
        else{
            let dateString = '11012021';
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));
            this.maxDate = new Date(year, month - 1, day);}
    }

    find() {
        this.spinner.show();
        this.search = Object.assign(this.pendingForm.getRawValue());
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
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
                this.loading = false;
            });
    }



    createForm(){
        this.pendingForm = this.fb.group({
            TrDate: [''],
            Lcno: [''],
            Status: ['']
        });
    }

    async getLoanStatus() {
        this.LoanStatus = await this._lovService.CallLovAPI(
            (this.LovCall = { TagName: LovConfigurationKey.RescheduleStatus })
        );
        this.SelectedLoanStatus = this.LoanStatus.LOVs.reverse();
        this.pendingForm.controls['Status'].setValue(this.SelectedLoanStatus ? this.SelectedLoanStatus[0].Id : '');


    }



    getRow(rob) {
        this.loanResch = rob;
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
                    this.layoutUtilsService.alertElementSuccess(
                        '',
                        baseResponse.Message
                    );
                    this.router.navigateByUrl('/journal-voucher/form');
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
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

    editPen(updateLoan) {

        this.router.navigate(
            [
                '../make-reschedule',
                {
                    LnTransactionID: updateLoan.loanApp,
                    loanReschID: updateLoan.LoanReschID,
                },
            ],
            { relativeTo: this.activatedRoute }
        );
    }

    ngAfterViewInit(){
        if(this.zone){
            setTimeout(() => this.find(), 1000);
        }
    }
}

interface Pending {
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
