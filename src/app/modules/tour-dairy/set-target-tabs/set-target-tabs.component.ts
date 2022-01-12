import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateFormats} from '../../../shared/classes/lov.class';
import {UserUtilsService} from '../../../shared/services/users_utils.service';
import {LayoutUtilsService} from '../../../shared/services/layout_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../shared/services/common.service';
import {finalize} from 'rxjs/operators';
import {BaseResponseModel} from '../../../shared/models/base_response.model';
import {BankTarget, Target} from "../set-target/Models/set-target.model";
import {SetTargetService} from "../set-target/Services/set-target.service";

class SetTarget {
    Id: number;
    Name: string;
    DisbursmentAmount: string;
}

class TargetData{
    UserID;
    AssignedTarget;
    Heading;
    TagName;
    Targets;
    BankTargets?:[];
}

class TargetDuration {
    LovId: number;
    Id: string;
    Name: string;
}

@Component({
    selector: 'app-set-target-tabs',
    templateUrl: './set-target-tabs.component.html',
    styleUrls: ['./set-target-tabs.component.scss'],
    providers: [
        DatePipe,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        {provide: MAT_DATE_FORMATS, useValue: DateFormats},
        {
            provide: MatDialogRef,
            useValue: {},
        },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {},
        },
    ],
})
export class SetTargetTabsComponent implements OnInit {

    @Input() UserID: any;
    @Input() multiple;
    @Input() dateDuration;
    @Input() TargetData=new TargetData;
    Label="";
    Labels=[];
    targetForm: FormGroup;
    private array = [];
    totals: any = [];
    AssignedTarget: any = [];
    AssignedTargetToSave: any = [];
    assignedTarget;
    ShowassignedTarget:Array<any>=[];
    value: any;
    visible: any = true;
    viewerOpen = false;
    heading;
    totalLength = [];
    public newValue;
    public newBankValue;
    public setTarget = new SetTarget();
    public target: Target[] = [];
    public TargetDuration: TargetDuration[] = [];
    targets: Target[] = [];
    bankTargets: BankTarget[] = [];
    headings = [];
    public previous = new SetTarget();
    LoggedInUserInfo: BaseResponseModel;
    Duration: any;
    ishidden = false;
    isChild = false;
    isfind = false;
    gridHeight: string;
    branch: any;
    zone: any;
    circle: any;
    isBankTarget: boolean = false;
    TagName;
    Multiple;
    AssignedTargetHeading;
    userGroup: any = [];
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userUtilsService: UserUtilsService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private _setTarget: SetTargetService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private _common: CommonService
    ) {
        router.events.subscribe((val: any) => {
            if (val.url == '/set-targettomer/customers') {
            }
        });
    }

    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    ngOnInit(): void {
        debugger
        this.userGroup = JSON.parse(localStorage.getItem("ZTBLUser"))?.User?.userGroup
        this.GetTragetDuration();
        this.createForm();
        this.UserID;
        this.TargetData;
        if(this.multiple==true){
            this.isChild = true;

            // this.Multiple=this.TargetData.Targets;
            // this.Label = this.TargetData?.Heading["Name"];
            this.targetForm.controls.Duration.setValue(this.dateDuration)
            this.headings = this.TargetData?.Heading;
            this.targets = this.TargetData?.Targets;
            this.assignedTarget = this.TargetData?.AssignedTarget;
            if (this.TargetData?.AssignedTarget) {
                this.ShowassignedTarget = Object.values(this.TargetData.AssignedTarget);
                this.isBankTarget = false;
            } else {
                this.isBankTarget = true;
            }
            if (this.TargetData?.TagName) {
                this.TagName=this.TargetData?.TagName
            }
            this.assignedTargetHeadingsData = this.TargetData?.AssignedTarget;

            this.bankTargets = this.TargetData?.BankTargets;
            debugger
            this.Heading();

            this.ishidden = true;
        }



    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    GetTragetDuration() {
        this._setTarget
            .GetTragetDuration(this.zone, this.branch, this.circle)
            .pipe(finalize(() => {
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.TargetDuration = baseResponse.Target.TargetDuration;
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
    }

    assignedTargetHeadingsData

    GetTargets(value: any) {
        if (!value) {
            var Message = 'Please select Target';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }
        this.ishidden = false;

        this.spinner.show();
        this._setTarget
            .GetTargets(value, this.zone, this.branch, this.circle, this.UserID)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    debugger
                    this.dateDuration=this.targetForm.controls.Duration.value;
                    this.Multiple=baseResponse?.Targets;
                    this.headings = baseResponse?.Targets[0]?.Heading;
                    this.targets = baseResponse?.Targets[0]?.Targets;
                    // this.previous = Object.assign(this.targets);
                    this.assignedTarget = baseResponse?.Targets[0]?.AssignedTarget;
                    if (baseResponse?.Targets[0]?.AssignedTarget) {
                        //this.ShowassignedTarget = Object.values(baseResponse.Targets[0]?.AssignedTarget);
                        this.isBankTarget = false;
                    } else {
                        this.isBankTarget = true;
                    }
                    if (baseResponse?.Targets[0]?.TagName) {
                        this.TagName=baseResponse?.Targets[0]?.TagName
                    }
                    this.ShowassignedTarget=[];
                    if(baseResponse?.Targets[0]?.AssignedTargetHeading){

                        this.AssignedTargetHeading = Object.values(baseResponse?.Targets[0]?.AssignedTargetHeading);
                        Object.keys(baseResponse?.Targets[0]?.AssignedTargetHeading).forEach(x=>{
                            debugger;
                            if(baseResponse?.Targets[0]?.AssignedTarget[x]){
                                this.ShowassignedTarget.push(baseResponse?.Targets[0]?.AssignedTarget[x])
                                //console.log(baseResponse?.Targets[0]?.AssignedTarget[x])
                            }else{
                                 this.ShowassignedTarget.push('-')
                                //console.log("-");
                            }
                        });

                    }
                    this.assignedTargetHeadingsData = baseResponse?.Targets[0]?.AssignedTarget;
                    this.bankTargets = baseResponse?.Targets[0]?.BankTargets;
                    debugger
                    this.Heading();

                    this.ishidden = true;
                    this.TargetData.UserID=this.UserID;
                    // this.Label = baseResponse?.Targets[0]?.Heading["Name"];
                    if(baseResponse?.Targets){
                        this.Labels=[];
                        for(let i=0;i<baseResponse?.Targets?.length;i++){
                            this.Labels.push(baseResponse?.Targets[i]?.Heading["Name"])
                        }
                        debugger
                    }
                } else {
                    this.Multiple=[]
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
        console.log(this.Labels)
    }


    createForm() {
        this.targetForm = this.fb.group({

            Duration: [],
        });
    }

    tracker = (i) => i;
    trackerr = (i) => i;
    arr: Object;

    get rowKeys(): string[] {
        if (!this.targets || !this.targets.length) {
            return [];
        }
        if (this.heading) {
        }
        return Object.keys(this.targets[0]);
    }

    get rowBankKeys(): string[] {
        if (!this.bankTargets || !this.bankTargets.length) {
            return [];
        }
        if (this.heading) {
        }
        return Object.keys(this.bankTargets[0]);
    }

    get rowth(): string[] {
        if (!this.targets || !this.targets.length) {
            return [];
        }
        if (this.heading) {
        }

        return this.array;
    }

    get AssignedTargetHeadings(): string[] {
        if (!this.AssignedTargetHeading || !this.AssignedTargetHeading?.length) {
            return [];
        }
        if (this.heading) {
        }

        return this.AssignedTargetHeading;
    }

    get AssignedHeading(): string[] {
        if (!this.targets || !this.targets.length) {
            return [];
        }
        if (this.heading) {
        }

        return Object.keys(this.array);
    }


    get totalHeading(): string[] {

        if (!this.assignedTargetHeadingsData) {
            return [];
        }
        if (this.heading) {
        }
        return Object.keys(this.assignedTargetHeadingsData);
    }

    Heading() {
        this.array = Object.values(this.headings);
        this.totalLength = Object.keys(this.headings);
        this.totalLength.splice(0, 1);

        this.AssignedTarget = Object.assign(this.totalLength);
        this.DoTotals(this.totalLength);
        this.AssignTarget();
    }

    DoTotals(array: any[]) {
        var tar = Object.keys(this.targets[0]);
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < tar.length; j++) {
                if (array[i] == tar[j]) {
                    this.DoCalculations(array[i], i);
                }
            }
        }
    }

    ngAfterViewInit() {


        this.gridHeight = window.innerHeight - 320 + 'px';
    }

    DoCalculations(val: string, num: number) {
        var dis = this.targets.reduce(function (sum, current) {
            return sum + Number(current[val]);
        }, 0);

        this.totals[num] = dis;
    }

    get total(): string[] {
        if (!this.targets || !this.targets.length) {
            return [];
        }
        if (this.heading) {
        }
        this.array = Object.values(this.headings);
        const len = this.array.length;
        return this.array;
    }

    onInputChanged(value, rowIndex: number, propertyKey: string): void {
        debugger
        this.newValue = this.targets.map((row, index) => {
            return index !== rowIndex
                ? row
                : {
                    ...row,
                    [propertyKey]: value == '' ? '0' : value,
                };
        });


        this.targets = Object.assign(this.newValue);

        // this.onDataChanged(this.newValue);
        this.Heading();
    }

    onBankInputChanged(value, rowIndex: number, propertyKey: string): void {
        debugger
        this.newBankValue = this.bankTargets.map((row, index) => {
            return index !== rowIndex
                ? row
                : {
                    ...row,
                    [propertyKey]: value == '' ? '0' : value,
                };
        });


        this.bankTargets = Object.assign(this.newBankValue);

        // this.onDataChanged(this.newValue);
        // this.Heading();
    }

    onDataChanged(event: any[]): void {

    }

    AssignTarget() {
        var obj = {};
        var objS = {};
        for (let i = 0; i < this.totalLength.length; i++) {
            obj[this.totalLength[i]] = this.totals[i];
            objS[this.totalLength[i]] = this.totals[i].toString();
        }
        this.AssignedTarget = Object.assign(obj);
        this.AssignedTargetToSave = Object.assign(objS);
    }

    OnChange(val) {
        if (val == this.Duration) {
            this.isfind = true;
        } else {
            this.isfind = false;
        }
    }

    reset() {
        this.targets = Object.assign(this.previous);
    }

    Check() {

        var target;
        var heading;

        var h = Object.keys(this.headings);
        var v = Object.values(this.headings);

        for (let j = 0; j < this.totalLength.length; j++) {
            for (let i = 0; i < this.targets.length; i++) {
                this.targets[this.totalLength[j]]
                target = this.targets.find(
                    (temp) => temp[this.totalLength[j]] == 0 || temp[this.totalLength[j]] === undefined
                );
// console.log(target)
                // target=this.targets.find(temp=>temp.Id>0)
                for (let k = 0; k < h.length; k++) {
                    if (this.totalLength[j] == h[k]) {
                        heading = v[k].toLowerCase();
                        break;
                    }
                }

                if (target) {
                    console.log("called");
                    var name = target.Name;
                    var Message;
                    var Code;
                    this.layoutUtilsService.alertElement(
                        '',
                        (Message =
                            name + ' ' + heading + '  must contain a value'),
                        (Code = '')
                    );
                    return false;
                }
            }
        }
        return true;
    }

    save() {

        // Check Total
        debugger
        if (this.bankTargets?.length > 0) {
            let BankTargetTotals = Object.keys(this.bankTargets[0])
            for (let i = 0; i < this.totals?.length; i++) {
                if (this.totals[i] != this.bankTargets[0][BankTargetTotals[i]]) {
                    var Message;
                    var Code;
                    this.layoutUtilsService.alertElement(
                        '',
                        (Message = 'Total value must be equal to Bank Assigned value'),
                        (Code = '')
                    );
                    return
                }
            }
        }

//*************** No check for Assigned Target****************
        // if (this.isBankTarget == false) {
        //
        //     if (Object.keys(this.assignedTarget)?.length > 0) {
        //         let assigned = Object.keys(this.assignedTarget)
        //         for (let i = 0; i < this.totals?.length; i++) {
        //             if (this.totals[i] != this.assignedTarget[assigned[i]]) {
        //                 var Message;
        //                 var Code;
        //                 this.layoutUtilsService.alertElement(
        //                     '',
        //                     (Message = 'Total value must be equal to Assigned value'),
        //                     (Code = '')
        //                 );
        //                 return
        //             }
        //         }
        //     }
        // }

        this.spinner.show();
        this._setTarget
            .saveTargets(this.bankTargets,
                this.targets,
                this.targetForm.controls.Duration.value,
                this.AssignedTargetToSave, this.assignedTarget, this.UserID,this.TagName,this.Label
            )
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.layoutUtilsService.alertElementSuccess(
                        '',
                        baseResponse.Message,
                        (baseResponse.Code = null)
                    );
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });

    }

    submit() {

        if (this.bankTargets?.length > 0) {
            this.totals
            let BankTargetTotals = Object.keys(this.bankTargets[0])
            for (let i = 0; i < this.totals?.length; i++) {
                console.log(this.bankTargets[0][BankTargetTotals[i]])
                if (this.totals[i] != this.bankTargets[0][BankTargetTotals[i]]) {
                    var Message;
                    var Code;
                    this.layoutUtilsService.alertElement(
                        '',
                        (Message = 'Total value must be equal to Bank Assigned value'),
                        (Code = '')
                    );
                    return
                }
            }
        }

//*************** No check for Assigned Target****************
        // if (this.assignedTarget) {
        //
        //     if (Object.keys(this.assignedTarget)?.length > 0) {
        //         let assigned = Object.keys(this.assignedTarget)
        //         for (let i = 0; i < this.totals?.length; i++) {
        //             if (this.totals[i] != this.assignedTarget[assigned[i]]) {
        //                 var Message;
        //                 var Code;
        //                 this.layoutUtilsService.alertElement(
        //                     '',
        //                     (Message = 'Total value must be equal to Assigned value'),
        //                     (Code = '')
        //                 );
        //                 return
        //             }
        //         }
        //     }
        // }


        this.spinner.show();
        this._setTarget
            .submitTargets(this.bankTargets,this.targetForm.controls.Duration.value, this.UserID,this.TagName,this.assignedTarget,this.Label)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.layoutUtilsService.alertElementSuccess(
                        '',
                        baseResponse.Message,
                        (baseResponse.Code = null)
                    );
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
    }

    find() {
        this.isfind = true;
        this.GetTargets(this.targetForm.controls.Duration.value);
        this.Duration = this.targetForm.controls.Duration.value;
    }
}
