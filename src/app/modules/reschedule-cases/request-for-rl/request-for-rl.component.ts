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
import {DatePipe} from '@angular/common';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {DateFormats, Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {BaseRequestModel} from 'app/shared/models/base_request.model';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {Branch} from 'app/shared/models/branch.model';
import {ReschedulingList} from 'app/shared/models/loan-application-header.model';
import {Zone} from 'app/shared/models/zone.model';
import {CircleService} from 'app/shared/services/circle.service';
import {CommonService} from 'app/shared/services/common.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {ReschedulingService} from '../service/rescheduling.service';

@Component({
    selector: 'app-request-for-rl',
    templateUrl: './request-for-rl.component.html',
    styleUrls: ['./request-for-rl.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

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

    response: any = [];
    checkedArr: ReschedulingList[] = [];
    newAdd: ReschedulingList[] = [];
    graceMonthsSelect: boolean = false;

    select: Selection[] = [
        {value: "13", viewValue: "13"},
        {value: "14", viewValue: "14"},
        {value: "15", viewValue: "15"},
        {value: "16", viewValue: "16"},
        {value: "17", viewValue: "17"},
        {value: "18", viewValue: "18"},
        {value: "19", viewValue: "19"},
        {value: "20", viewValue: "20"},
        {value: "21", viewValue: "21"},
        {value: "22", viewValue: "22"},
        {value: "23", viewValue: "23"},
        {value: "24", viewValue: "24"},
    ];


    //Request Category inventory
    RequestTypes: any = [];
    RequestType: any = [];
    SelectedRequestType: any = [];

    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();

    selected_z;
    selected_b;

    public LovCall = new Lov();
    public ReschedulingList = new ReschedulingList();

    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;

    loaded = false;

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
        private datePipe: DatePipe,
    ) {
        this.AddTable = false;
    }

    ngOnInit() {
        this.create();

        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

        if (this.LoggedInUserInfo.Branch != null) {

            this.Branches = this.LoggedInUserInfo.Branch;
            this.SelectedBranches = this.Branches;

            this.Zone = this.LoggedInUserInfo.Zone;
            this.SelectedZones = this.Zone;

            this.selected_z = this.SelectedZones.ZoneId
            this.selected_b = this.SelectedBranches.BranchCode
            console.log(this.SelectedZones)
            this.RfrlForm.controls["Zone"].setValue(this.SelectedZones.ZoneName);
            this.RfrlForm.controls["Branch"].setValue(this.SelectedBranches.Name);

        } else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
            this.spinner.show();

            this.userUtilsService.getZone().subscribe((data: any) => {
                this.Zone = data.Zones;
                this.SelectedZones = this.Zone;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();

            });
        }

        this.getRequestTypes();

        // this.RfrlForm.controls[Zone].value = this.LoggedInUserInfo.Zone.ZoneName;
        // this.RfrlForm.controls.Branch.value = this.LoggedInUserInfo.Branch.Name

    }

    create() {
        this.RfrlForm = this.fb.group({
            Zone: [null, Validators.required],
            Branch: [null, Validators.required],
            Cnic: ["", Validators.required],
            EffectiveReqDate: ["", Validators.required],
            Remarks: ["", Validators.required],
            RequestCategory: ["", Validators.required],
            GraceMonths: ["", Validators.required],
            MPpno: ["", Validators.required],
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
        console.log(this.SelectedRequestType)
        debugger;
    }

    find() {
        debugger;

        this.errorShow = false;
        this.hasFormErrors = false;


        if (this.RfrlForm.invalid) {
            const controls = this.RfrlForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }

        if (this.RfrlForm.value == '' && this.RfrlForm.value == undefined && this.RfrlForm.value == null) {
            this.Field = true;
            this.Table = false;
        }
        // else{
        //   this.Table = true;
        // }


        this.spinner.show();
        this.ReschedulingList = Object.assign(
            this.ReschedulingList,
            this.RfrlForm.getRawValue()
        );

        console.log(this.ReschedulingList)
        this._reschedulingService
            .GetRescheduling(this.ReschedulingList)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                debugger;
                if (baseResponse.Success === true) {
                    console.log(
                        "BaseResponse of Get Reschedule",
                        baseResponse.Loan.ReschedulingList
                    );
                    this.Table = true;
                    this.Field = false;
                    this.response = baseResponse.Loan.ReschedulingList;

                    // this.RfrlForm.controls["Cnic"].setValue('');
                    //   this.RfrlForm.controls["EffectiveReqDate"].setValue('');
                    //   this.RfrlForm.controls["Remarks"].setValue('');
                    //   this.RfrlForm.controls["RequestCategory"].setValue('');
                    //   this.RfrlForm.controls["MPpno"].setValue('');

                    //   this.RfrlForm.get('Cnic').markAsPristine();
                    //   this.RfrlForm.get('Cnic').markAsUntouched();
                    //   this.RfrlForm.get('EffectiveReqDate').markAsUntouched();
                    //    this.RfrlForm.get('EffectiveReqDate').markAsPristine();
                    //    this.RfrlForm.get('Remarks').markAsUntouched();
                    //    this.RfrlForm.get('Remarks').markAsPristine();
                    //    this.RfrlForm.get('RequestCategory').markAsUntouched();
                    //    this.RfrlForm.get('RequestCategory').markAsPristine();
                    //    this.RfrlForm.get('MPpno').markAsUntouched();
                    //    this.RfrlForm.get('MPpno').markAsPristine();
                } else {
                    this.layoutUtilsService.alertElement(
                        "",
                        baseResponse.Message,
                        baseResponse.Code
                    );
                    this.Field = true;
                    this.Table = false;
                }
            });
    }

    onChange(id: ReschedulingList, event, index) {
        //console.log(index)
        debugger;
        this.idx = index;
        var ind = index
        let prev_i, prevData;

        if (prev_i == undefined || prev_i != ind) {
            prev_i = ind;
            this.pidx = prev_i;
        }

        if (event.checked == true && this.checkedArr.length == 0) {
            debugger;
            this.checkedArr.push(id);
            console.log("checked array data", this.checkedArr);

            this.AddTable = false;

        } else if (this.checkedArr.length != 0 && prev_i == index) {

            this.tableArr = this.checkedArr
        } else {
            for (var i = 0; this.checkedArr.length > i; i++) {
                if (this.checkedArr[i].LoanAppID == id.LoanAppID) {
                    this.checkedArr.splice(i);
                    console.log("remove array data", this.checkedArr);
                }
            }

        }
    }

    onSelectionChange(e) {
        debugger
        console.log(e.value)
        if (this.RfrlForm.controls.RequestCategory.value && e.value != '3') {
            this.graceMonthsSelect = false;
            this.RfrlForm.controls["GraceMonths"].setValue('');
            this.RfrlForm.get('GraceMonths').clearValidators();
            this.RfrlForm.get('GraceMonths').updateValueAndValidity();
        } else {
            this.graceMonthsSelect = true
            this.RfrlForm.get('GraceMonths').setValidators([Validators.required]);
            this.RfrlForm.get('GraceMonths').updateValueAndValidity();
        }
    }

    Add() {
        debugger;


        console.log(this.checkedArr);
        if (this.checkedArr.length > 0) {

            this.AddTable = true;
            this.checked = false

            // if(this.tableArr.length != 0){
            //   alert("SELECTED RECORD ALREADY EXISTS PLEASE CHANGE")
            // }

            this.tableArr = this.checkedArr;
            //this.checkedArr.length = 0;
        } else {
            //alert("SELECTED RECORD ALREADY EXISTS PLEASE CHANGE")
            this.AddTable = false;
        }
    }

    submitData() {
        this.spinner.show();
        this.request = new BaseRequestModel();
        let shantoo = this.RfrlForm.controls.EffectiveReqDate.value;
        console.log(shantoo._d)
        //this.RfrlForm.controls["EffectiveReqDate"].setValue(this.datePipe.transform(shantoo._d, "ddMMyyyy"))
        let newDate = this.datePipe.transform(shantoo._d, "ddMMyyyy");
        console.log(newDate)
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        for (var i = 0; this, this.checkedArr.length > i; i++) {
            this.checkedArr[i].ManagerPPNo = this.RfrlForm.controls["MPpno"].value

            this.checkedArr[i].EffectiveReqDate = newDate
            this.checkedArr[i].Remarks = this.RfrlForm.controls["Remarks"].value
            this.checkedArr[i].RequestCategory = this.RfrlForm.controls["RequestCategory"].value
            this.checkedArr[i].Cnic = this.RfrlForm.controls["Cnic"].value
            this.checkedArr[i].McoPPNO = userInfo.User.UserName
        }
        debugger;
        this._reschedulingService
            .AddReschedulLoanInstallment(this.checkedArr)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                debugger;
                if (baseResponse.Success === true) {
                } else {
                    this.layoutUtilsService.alertElement(
                        "",
                        baseResponse.Message,
                        baseResponse.Code
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
        console.log(this.checkedArr)
    }

    changeBranch(changedValue) {

        let changedBranch = null;
        if (changedValue.has('value')) {
            changedBranch = {Branch: {BranchCode: changedValue.value}}
        } else {
            changedBranch = {Branch: {BranchCode: changedValue}}

        }
    }

}

export interface Selection {
    value: string;
    viewValue: string;
}
