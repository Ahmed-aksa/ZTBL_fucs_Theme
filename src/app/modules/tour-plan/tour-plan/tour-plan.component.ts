import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { MatDialog} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LayoutUtilsService} from "../../../shared/services/layout-utils.service";
import { TourPlan } from '../Model/tour-plan.model';
import {TourPlanService} from "../Service/tour-plan.service";
import {CircleService} from "../../../shared/services/circle.service";
import {CommonService} from "../../../shared/services/common.service";
import {SlashDateFormats} from "../../../shared/models/slash-format.class";

@Component({
    selector: 'kt-loan-utilization',
    templateUrl: './tour-plan.component.html',
    styleUrls: ['./tour-plan.component.scss'],
    providers: [
        DatePipe,
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: SlashDateFormats }

    ],

})
export class TourPlanComponent implements OnInit {
    @Input() tourplan: any;
    @Input() flag: any;
    id;
    displayedColumns = ["VisitedDate","Purpose","Edit","Delete"]
    dataSource:[]=[];
    TourForm: FormGroup;
    loggedInUser: any;
    onAdd: boolean = false;
    hasFormErrors = false;
    minDate = new Date();
    sign;
    circle;
    VisitedDate;
    TourPlan = new TourPlan;
    isAdd:boolean=true;
    isUpdate:boolean=false;
    isTable:boolean=true;
    isSubmit:boolean=false;
    isAuthorize:boolean=false;
    isApproval:boolean=false;
    isView:boolean=false;
    readonly:boolean=false;

    constructor(
        private fb: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private userUtilsService: UserUtilsService,
        private datePipe: DatePipe,
        public dialog: MatDialog,
        private router: Router,
        private _circleService: CircleService,
        private tourPlanService:TourPlanService,
        private commonService:CommonService,
    ) {
        this.loggedInUser = userUtilsService.getUserDetails();
        if (this.router.getCurrentNavigation().extras.state !== undefined) {
            this.TourPlan = this.router.getCurrentNavigation().extras.state.example;
            this.flag = this.router.getCurrentNavigation().extras.state.flag;


        }
        else{
            this.isAdd=true;
            this.isUpdate=false;
        }
    }

    ngOnInit() {
        debugger
        this.createForm();
        this.setValues();
        this.setValuesForEdit();
    }




    setValuesForEdit(){
        if(this.TourPlan.TourPlanId){
            this.TourForm.controls['CircleId'].setValue(this.TourPlan.CircleId);
            this.TourForm.controls['VisitedDate'].setValue(this.commonService.stringToDate(this.TourPlan.VisitedDate));
            // this.isTable=false;
            this.isAdd=false;
            this.isUpdate=true;
            if(this.flag==2){
                this.isAdd=false;
                this.isUpdate=false;
                this.isSubmit=true;
                this.isApproval=true;
            }
            if(this.TourPlan["view"]=="1"){
                this.readonly=true;
                this.isView=true;
            }
        }
    }

    setValues(){
        var circleId=[], circleCode=[], name, ppno, circleName, circleNo, date, branch,zone;
        console.log(this.loggedInUser)
        name = this.loggedInUser.User.DisplayName;
        zone =this.loggedInUser.Zone.ZoneName;
        branch= this.loggedInUser.Branch.Name;
        ppno= this.loggedInUser.User.UserName;
        this.circle = this.loggedInUser.UserCircleMappings;
        if(this.circle.length==0){
            console.log("called");
            this.GetCircles()
        }
        this.TourForm.controls['ZoneName'].setValue(zone);
        this.TourForm.controls['BranchName'].setValue(branch);
        this.TourForm.controls['McoName'].setValue(name);
        this.TourForm.controls['PPNO'].setValue(ppno);
        this.TourForm.controls['CircleName'].setValue(circleName);
        this.TourForm.controls['CircleId'].setValue(circleNo);
    }


    createForm(){
        this.TourForm = this.fb.group({
            ZoneName:[],
            BranchName:[],
            McoName:[],
            PPNO:[],
            TourPlanId:[this.TourPlan.TourPlanId],
            CircleId:[this.TourPlan.CircleId],
            CircleName:[],
            ZoneId:[this.loggedInUser.User.ZoneId],
            UserId:[this.loggedInUser.User.UserId],
            BranchId:[this.loggedInUser.User.BranchId],
            VisitedDate:[this.TourPlan.VisitedDate],
            Purpose:[this.TourPlan.Purpose],
            Remarks:[this.TourPlan.Remarks],
            Status:[this.TourPlan.Status],
        })
        this.ApprovalMode();
    }

    ApprovalMode(){
        console.log(this.flag)
        if(this.flag=="2"){
            console.log("working")
            this.isView=true;
            this.TourForm.controls['Remarks'].setValidators(Validators.required);
        }
    }

    setVisitedDate() {
        debugger
        var VisitedDate = this.TourForm.controls.VisitedDate.value;
        if (VisitedDate._isAMomentObject == undefined) {
            try {
                var day = this.TourForm.controls.VisitedDate.value.getDate();
                var month = this.TourForm.controls.VisitedDate.value.getMonth() + 1;
                var year = this.TourForm.controls.VisitedDate.value.getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.TourForm.controls.VisitedDate.setValue(branchWorkingDate)
            } catch (e) {
            }
        }
        else {
            try {
                var day = this.TourForm.controls.VisitedDate.value.toDate().getDate();
                var month = this.TourForm.controls.VisitedDate.value.toDate().getMonth() + 1;
                var year = this.TourForm.controls.VisitedDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                VisitedDate = day + "" + month + "" + year;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.VisitedDate = VisitedDate;
                this.TourForm.controls.VisitedDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }

    reset(){
    }

    CheckEditStatus(tourPlan){
    }

    CheckDeleteStatus(tourPlan){
    }

    deleteList(tourPlan){

    }

    editList(tourPlan){
        this.TourPlan=new TourPlan();
        this.TourPlan = Object.assign(tourPlan);
        this.createForm();
        this.setValues();
        this.setValuesForEdit();
        this.isAdd=false;
        this.isUpdate=true;
        // this.isTable=false;
    }

    Update(){
        this.Add();

    }

    // delete(){}
    Add() {
        if (this.TourForm.invalid) {
            const controls = this.TourForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            this.hasFormErrors = true;
            return;
        }
        // this.customerForm.controls.Status.setValue("P");
        var v = JSON.stringify(this.TourForm.value)
        console.log("form values"+v)

        this.TourPlan = Object.assign(this.TourForm.value);
        this.TourPlan.VisitedDate=this.VisitedDate;
        this.TourPlan.Status="P";
        // if(this.flag==1)
        // {this.TourPlan.TourPlanId=this.id;
        // }
        debugger
        this.spinner.show();
        this.tourPlanService
            .createTourPlan(this.TourPlan)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe(
                (baseResponse) => {
                    if (baseResponse.Success) {
                        console.log(baseResponse)
                        this.isAdd=true;
                        this.isUpdate=false;

                        this.dataSource = baseResponse.TourPlan.TourPlans;
                        this.layoutUtilsService.alertElementSuccess(
                            "",
                            baseResponse.Message,
                            baseResponse.Code = null
                        );
                        if(this.flag){
                            this.router.navigate(['/tour-plan/search-tour-plan']);
                        }

                        debugger
                    } else {
                        debugger;
                        this.layoutUtilsService.alertElement(
                            "",
                            baseResponse.Message,
                            baseResponse.Code = null
                        );
                    }
                });
    }

    Submit()
    {
        console.log(this.dataSource);

    }

    hasError(controlName: string, errorName: string): boolean {
        return this.TourForm.controls[controlName].hasError(errorName);
    }

    ChanageTourStatus(value:string){

        this.TourPlan = Object.assign(this.TourForm.value);
        this.TourPlan.VisitedDate=this.VisitedDate;
        this.TourPlan.Status=value;

        console.log("tourplan"+this.TourPlan)
        debugger
        this.spinner.show();
        this.tourPlanService
            .ChanageTourStatus(this.TourPlan)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe(
                (baseResponse) => {
                    if (baseResponse.Success) {
                        this.layoutUtilsService.alertElementSuccess(
                            "",
                            baseResponse.Message,
                            baseResponse.Code = null
                        );
                        debugger
                    } else {
                        debugger;
                        this.layoutUtilsService.alertElement(
                            "",
                            baseResponse.Message,
                            baseResponse.Code = null
                        );
                    }
                });
    }

    ngOnDestroy(){
        this.isAdd=true;
        this.isUpdate=false;
    }

    GetCircles(){
        this._circleService
            .getCircles(this.loggedInUser.Branch)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe(
                (baseResponse) => {
                    if (baseResponse.Success) {
                        this.circle = baseResponse.Circles;
                        console.log(this.circle)
                    }
                });
    }
}
