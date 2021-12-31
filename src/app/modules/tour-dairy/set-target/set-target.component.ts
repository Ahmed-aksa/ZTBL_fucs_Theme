import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
import {Target} from '@angular/compiler';
import {finalize} from 'rxjs/operators';
import {BaseResponseModel} from '../../../shared/models/base_response.model';
import {SetTargetService} from './Services/set-target.service';

class SetTarget {
    Id: number;
    Name: string;
    DisbursmentAmount: string;
}

class TargetDuration {
    LovId: number;
    Id: string;
    Name: string;
}

@Component({
    selector: 'app-set-target',
    templateUrl: './set-target.component.html',
    styleUrls: ['./set-target.component.scss'],
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
export class SetTargetComponent implements OnInit {
    targetForm: FormGroup;
    private array = [];
    totals: any = [];
    AssignedTarget: any = [];
    AssignedTargetToSave: any = [];
    assignedTarget;
    value: any;
    visible: any = true;
    viewerOpen = false;
    heading;
    totalLength = [];
    public newValue;
    public setTarget = new SetTarget();
    public target: Target[] = [];
    public TargetDuration: TargetDuration[] = [];
    targets: Target[] = [];
    headings = [];
    public previous = new SetTarget();
    LoggedInUserInfo: BaseResponseModel;
    Duration: any;
    ishidden = false;
    isfind = false;
    gridHeight: string;
    branch: any;
    zone: any;
    circle: any;

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
        this.GetTragetDuration();
        this.createForm();
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
    assignedBankHeadingsData
    TH
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
            .GetTargets(value, this.zone, this.branch, this.circle)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    debugger
                    this.headings = baseResponse.Target.Heading;
                    this.targets = baseResponse.Target.Targets;
                    this.previous = Object.assign(this.targets);
                    this.assignedTarget = baseResponse.Target.AssignedTarget;
                    this.assignedTargetHeadingsData = baseResponse?.Target?.AssignedTarget;
                    this.assignedBankHeadingsData = baseResponse?.Target?.AssignedTarget;
                    this.Heading();

                    if(baseResponse?.Target?.AssignedTarget){
                        this.showAssignedTarget();
                        this.TH = "Assigned Target"
                    }
                    if(baseResponse?.Target?.AssignedTarget){
                        this.showBankTarget();
                        this.TH = "Assigned Bank Target"
                    }


                    this.ishidden = true;
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
    }
    assignedtargetheading

   showAssignedTarget(){
       this.assignedtargetheading = Object.values(this.assignedTargetHeadingsData);
    }
    showBankTarget(){
           this.assignedtargetheading = Object.values(this.assignedTargetHeadingsData);
    }

    createForm() {
        this.targetForm = this.fb.group({

            Duration: [],
        });
    }

    tracker = (i) => i;
    arr: Object;

    get rowKeys(): string[] {
        if (!this.targets || !this.targets.length) {
            return [];
        }
        if (this.heading) {
        }
        return Object.keys(this.targets[0]);
    }

    get rowth(): string[] {
        if (!this.targets || !this.targets.length) {
            return [];
        }
        if (this.heading) {
        }

        return this.array;
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
            this.spinner.show();
            this._setTarget
                .saveTargets(
                    this.targets,
                    this.targetForm.controls.Duration.value,
                    this.AssignedTargetToSave,this.assignedTarget
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
            this.spinner.show();
            this._setTarget
                .submitTargets(this.targetForm.controls.Duration.value)
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
