/* eslint-disable one-var */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable arrow-parens */
/* eslint-disable curly */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable eol-last */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/member-ordering */
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BaseRequestModel} from 'app/shared/models/base_request.model';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {Branch} from 'app/shared/models/branch.model';
import {ReschedulingList} from 'app/shared/models/Loan.model';
import {
    DateFormats,
    Lov,
    LovConfigurationKey,
} from 'app/shared/classes/lov.class';
import {LovService} from 'app/shared/services/lov.service';
import {CircleService} from 'app/shared/services/circle.service';
import {ReschedulingService} from '../service/rescheduling.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {CommonService} from '../../../shared/services/common.service';
import {finalize} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

@Component({
    selector: 'app-request-for-rl',
    templateUrl: './request-for-rl.component.html',
    styleUrls: ['./request-for-rl.component.scss'],
    providers: [
        DatePipe,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        {provide: MAT_DATE_FORMATS, useValue: DateFormats},
    ],
})
export class RequestForRlComponent implements OnInit {
    request = new BaseRequestModel();
    today = new Date();

    RfrlForm: FormGroup;
    LoggedInUserInfo: BaseResponseModel;
    errorShow: boolean;
    hasFormErrors = false;
    Field: boolean = false;
    Table: boolean = false;
    AddTable: boolean;
    checked: boolean = false;
    tableArr: any;
    idx: any;
    pidx: any;

    zone: any;
    branch: any;


    response: any = [];
    checkedArr: ReschedulingList[] = [];
    newAdd: ReschedulingList[] = [];
    graceMonthsSelect: boolean = false;

    select: Selection[] = [
        {value: '13', viewValue: '13'},
        {value: '14', viewValue: '14'},
        {value: '15', viewValue: '15'},
        {value: '16', viewValue: '16'},
        {value: '17', viewValue: '17'},
        {value: '18', viewValue: '18'},
        {value: '19', viewValue: '19'},
        {value: '20', viewValue: '20'},
        {value: '21', viewValue: '21'},
        {value: '22', viewValue: '22'},
        {value: '23', viewValue: '23'},
        {value: '24', viewValue: '24'},
    ];

    //Request Category inventory
    RequestTypes: any = [];
    SelectedRequestType: any = [];

    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    public Zone: any;

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();
    final_branch: any;
    final_zone: any;
    public LovCall = new Lov();
    public ReschedulingList = new ReschedulingList();

    constructor(
        private fb: FormBuilder,
        private _lovService: LovService,
        private _circleService: CircleService,
        private cdRef: ChangeDetectorRef,
        private _reschedulingService: ReschedulingService,
        private userUtilsService: UserUtilsService,
        private spinner: NgxSpinnerService,
        private layoutUtilsService: LayoutUtilsService,
        private _common: CommonService,
        private datePipe: DatePipe
    ) {
        this.AddTable = false;
    }

    ngOnInit() {

        //
        this.create();
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        //
        this.getRequestTypes();

        if (this.LoggedInUserInfo.Branch.WorkingDate) {
            let dateString = this.LoggedInUserInfo.Branch.WorkingDate;
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));
            this.today = new Date(year, month - 1, day);
        } else {
            let dateString = '11012021';
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));
            this.today = new Date(year, month - 1, day);
        }


    }


    create() {
        this.RfrlForm = this.fb.group({
            Cnic: ['', Validators.required],
            EffectiveReqDate: ['', Validators.required],
            Remarks: ['', Validators.required],
            RequestCategory: ['', Validators.required],
            GraceMonths: ['', Validators.required],
            MPpno: ['', Validators.required],
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.RfrlForm.controls[controlName].hasError(errorName);
    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    //-------------------------------Request Type Core Functions-------------------------------//
    async getRequestTypes() {
        this.RequestTypes = await this._lovService.CallLovAPI(
            (this.LovCall = {TagName: LovConfigurationKey.RequestCategory})
        );
        this.SelectedRequestType = this.RequestTypes.LOVs;

    }


    find() {
        this.errorShow = false;
        this.hasFormErrors = false;

        if (this.RfrlForm.invalid) {
            const controls = this.RfrlForm.controls;
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }

        if (
            this.RfrlForm.value == '' &&
            this.RfrlForm.value == undefined &&
            this.RfrlForm.value == null
        ) {
            this.Field = true;
            this.Table = false;
        }

        this.spinner.show();
        this.ReschedulingList = Object.assign(
            this.ReschedulingList,
            this.RfrlForm.getRawValue()
        );

        this._reschedulingService
            .GetRescheduling(
                this.ReschedulingList,
                this.branch,
                this.zone
            )
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    // ngOnInit(): void {

                    // }
                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    console.log(
                        'BaseResponse of Get Reschedule',
                        baseResponse.Loan.ReschedulingList
                    );
                    this.Table = true;
                    this.Field = false;
                    this.response = baseResponse.Loan.ReschedulingList;
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                    this.Field = true;
                    this.Table = false;
                }
            });
    }

    onChange(id: ReschedulingList, event, index) {
        //

        this.idx = index;
        var ind = index;
        let prev_i, prevData;

        if (prev_i == undefined || prev_i != ind) {
            prev_i = ind;
            this.pidx = prev_i;
        }

        if (event.checked == true && this.checkedArr.length == 0) {
            this.checkedArr.push(id);


            this.AddTable = false;
        } else if (this.checkedArr.length != 0 && prev_i == index) {
            this.tableArr = this.checkedArr;
        } else {
            for (var i = 0; this.checkedArr.length > i; i++) {
                if (this.checkedArr[i].LoanAppID == id.LoanAppID) {
                    this.checkedArr.splice(i);

                }
            }
        }
    }

    onSelectionChange(e) {
        
        if (this.RfrlForm.controls.RequestCategory.value == '2' && e.value == '2') {
            this.graceMonthsSelect = true;
            this.RfrlForm.get('GraceMonths').setValidators([
                Validators.required,
            ]);
            this.RfrlForm.get('GraceMonths').updateValueAndValidity();
        } else {
            this.graceMonthsSelect = false;
            this.RfrlForm.controls['GraceMonths'].setValue('');
            this.RfrlForm.get('GraceMonths').clearValidators();
            this.RfrlForm.get('GraceMonths').updateValueAndValidity();
        }
    }

    Add() {

        if (this.checkedArr.length > 0) {
            this.AddTable = true;
            this.checked = false;

            this.tableArr = this.checkedArr;
        } else {
            this.AddTable = false;
        }
    }

    submitData() {
        this.spinner.show();
        this.request = new BaseRequestModel();
        let shantoo = this.RfrlForm.controls.EffectiveReqDate.value;

        //this.RfrlForm.controls["EffectiveReqDate"].setValue(this.datePipe.transform(shantoo._d, "ddMMyyyy"))
        let newDate = this.datePipe.transform(shantoo._d, 'ddMMyyyy');

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        for (var i = 0; this, this.checkedArr.length > i; i++) {
            this.checkedArr[i].ManagerPPNo =
                this.RfrlForm.controls['MPpno'].value;

            this.checkedArr[i].EffectiveReqDate = newDate;
            this.checkedArr[i].Remarks =
                this.RfrlForm.controls['Remarks'].value;
            this.checkedArr[i].RequestCategory =
                this.RfrlForm.controls['RequestCategory'].value;
            this.checkedArr[i].Cnic = this.RfrlForm.controls['Cnic'].value;
            this.checkedArr[i].McoPPNO = userInfo.User.UserName;
        }

        this._reschedulingService
            .AddReschedulLoanInstallment(this.checkedArr)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    // window.location.reload();
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message
                    );
                }
            });
    }

    deleteRow(index: any) {
        this.checkedArr.splice(index);
    }

    cancelData() {
        for (var i = 0; this.checkedArr.length > i; i++) {
            this.checkedArr.splice(i);
        }

    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
    }
}

export interface Selection {
    value: string;
    viewValue: string;
}

export class ReschedulingGrid {
    CustomerID: string;
    LoanAppID: number;
    LoanDisbID: number;
    BranchCode: string;
    Cnic: string;
    LoanCaseNo: string;
    GlSubCode: string;
    OsMarkup: number;
    CustomerName: string;
    FatherName: string;
    PermanentAddress: string;
    GlSubname: string;
    MajorBorrower: string;
    GlSubID: number;
    EffectiveReqDate: string;
    UserID: string;
    GraceMonths: number;
    BranchID: string;
    Remarks: string;
    ID: string;
}
