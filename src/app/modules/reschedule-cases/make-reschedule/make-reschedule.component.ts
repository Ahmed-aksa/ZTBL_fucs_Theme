/* eslint-disable arrow-parens */
/* eslint-disable space-before-function-paren */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable radix */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MakeReschedule } from 'app/shared/models/Loan.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { LovService } from '../../../shared/services/lov.service';
import {
    DateFormats,
    Lov,
    LovConfigurationKey,
} from '../../../shared/classes/lov.class';
import { BaseResponseModel } from '../../../shared/models/base_response.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CircleService } from '../../../shared/services/circle.service';
import { UserUtilsService } from '../../../shared/services/users_utils.service';
import { NewGlCodeComponent } from './new-gl-code/new-gl-code.component';
import { finalize } from 'rxjs/operators';
import { Branch } from 'app/shared/models/branch.model';
import { LayoutUtilsService } from '../../../shared/services/layout_utils.service';
import { Circle } from 'app/shared/models/circle.model';
import { Zone } from 'app/shared/models/zone.model';
import { ReschedulingService } from '../service/rescheduling.service';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
    selector: 'app-make-rc',
    templateUrl: './make-reschedule.component.html',
    styleUrls: ['./make-reschedule.component.scss'],
    providers: [
        DatePipe,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: DateFormats },
    ],
})
export class MakeRcComponent implements OnInit {
    mrForm: FormGroup;

    public rescheduling = new MakeReschedule();

    LoggedInUserInfo: BaseResponseModel;

    errorShow: boolean;
    hasFormErrors = false;
    Table: boolean = false;
    expand: boolean = false;

    public LovCall = new Lov();

    SubProposalGLList: any = [];

    DisbursementGLList: any = [];

    //Request Category inventory
    RequestTypes: any = [];
    RequestType: any = [];
    SelectedRequestType: any = [];

    zone: any;
    branch: any;
    circle: any;

    public LnAppSanctionID: string;
    loanReschID: string;

    public ReschedulingTypes: any;

    navigationSubscription: any;

    constructor(
        private _reschedulingService: ReschedulingService,
        private spinner: NgxSpinnerService,
        private cdRef: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private _circleService: CircleService,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private fb: FormBuilder,
        private dailog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe
    ) {
        router.events.subscribe((val: any) => {
            if (val.url == '/reschedule-cases/make-reschedule') {
            }
        });

        //this.router.routeReuseStrategy.shouldReuseRoute = () => false;

        // this.navigationSubscription = this.router.events.subscribe((e: any) => {
        //     // If it is a NavigationEnd event re-initalise the component
        //     if (e instanceof NavigationEnd) {
        //         //this.initialiseInvites();
        //     }
        // });
    }

    ngAfterViewInit() {
        // this.GetDisbursement();
        if (this.route.snapshot.params['loanReschID'] != null) {
            this.GetReshTransaction();
        }
    }

    createForm() {
        this.mrForm = this.fb.group({
            TranDate: ['11012021'],
            Lcno: ['', Validators.required],
            LoanAppSanctionID: ['', Validators.required],
            LoanDisbID: ['', Validators.required],
            GlSubIDNew: ['', Validators.required],
            SchemeCode: [''], //
            CropCode: [''], //
            AmountPayableForReschPer: ['', Validators.required],
            ProposalID: ['0'], //
            OutSDMarkupWithIstInstPer: ['100'], //
            RescheduleTypeID: ['', Validators.required],
            Remarks: ['', Validators.required],
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.mrForm.controls[controlName].hasError(errorName);
    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle;
    }

    ngOnInit() {
        this.LoadLovs();
        this.createForm();
        this.LoggedInUserInfo =
            this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();

        this.getRequestTypes();
    }

    //-------------------------------Request Type Core Functions-------------------------------//
    async getRequestTypes() {
        this.RequestTypes = await this._lovService.CallLovAPI(
            (this.LovCall = { TagName: LovConfigurationKey.RequestCategory })
        );
        this.SelectedRequestType = this.RequestTypes.LOVs;
    }

    async LoadLovs() {
        var tempArray = await this._lovService.CallLovAPI(
            (this.LovCall = { TagName: LovConfigurationKey.ReschedulingTypes })
        );
        this.ReschedulingTypes = tempArray.LOVs;
    }

    GetReshTransaction() {
        this.spinner.show();
        this.loanReschID = this.route.snapshot.params['loanReschID'];
        this.rescheduling.LoanReschID = parseInt(this.loanReschID);

        this._reschedulingService
            .GetReshTransactionByID(this.loanReschID, this.zone, this.branch)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.mrForm.controls['RescheduleTypeID'].setValue(
                        baseResponse.Loan.MakeReschedule.RescheduleTypeID
                    );
                    this.mrForm.controls['TranDate'].setValue(
                        baseResponse.Loan.MakeReschedule.EnteredDate
                    );
                    this.mrForm.controls['CropCode'].setValue(
                        baseResponse.Loan.MakeReschedule.CropCode
                    );
                    this.mrForm.controls['SchemeCode'].setValue(
                        baseResponse.Loan.MakeReschedule.SchemeCode
                    );
                    this.mrForm.controls['GlSubIDNew'].setValue(
                        baseResponse.Loan.MakeReschedule.GlSubIDNew
                    );
                    this.mrForm.controls['AmountPayableForReschPer'].setValue(
                        baseResponse.Loan.MakeReschedule
                            .IstInstallmentDefferDays
                    );
                    this.mrForm.controls['Lcno'].setValue(
                        baseResponse.Loan.MakeReschedule.LoanCaseNO
                    );
                    this.subProposal();
                    this.mrForm.controls['OutSDMarkupWithIstInstPer'].setValue(
                        baseResponse.Loan.MakeReschedule
                            .OutSDMarkupWithIstInstPer
                    );
                    this.mrForm.controls['Remarks'].setValue(
                        baseResponse.Loan.MakeReschedule.Remarks
                    );
                    this.mrForm.controls['GlSubIDNew'].setValue(
                        baseResponse.Loan.MakeReschedule.GlSubIDNew
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

    newGlDialog() {
        //this.dailog.open(NewGlCodeComponent, { width: "800px", data: { NGlC: this.mrForm.controls.NGlC.value }, disableClose: true });

        // const dialogRef = this.dailog.open(NewGlCodeComponent, { width: "1600px", data: { NGlC: this.mrForm.controls.GlSubIDNew.value }, disableClose: true });
        // dialogRef.afterClosed().subscribe(res => {
        //   if (!res) {
        //     return;
        //   }
        //   this.mrForm.controls.GlSubIDNew.setValue(res);
        // });
        this.dailog.open(NewGlCodeComponent, {
            width: '100%',
            data: {
                NGlC: this.mrForm.controls.GlSubIDNew.value,
                zone: this.zone,
                branch: this.branch,
            },
            disableClose: true,
        });
    }

    SaveData() {
        //this.mrForm.controls["TranDate"].setValue(this.datePipe.transform(new Date(), "ddMMyyyy"))
        this.rescheduling = Object.assign(this.mrForm.getRawValue());
        this.spinner.show();
        this._reschedulingService
            .SaveMakeRescheduleLoan(this.rescheduling, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.rescheduling.LoanReschID =
                        baseResponse.Loan.MakeReschedule.LoanReschID;
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                    setTimeout(() => {
                        this.router.navigate([
                            '/reschedule-cases/pending-reschedule',
                        ]);
                    }, 2000);
                    this.mrForm.controls['Lcno'].setValue('');
                    this.mrForm.controls['LoanAppSanctionID'].setValue('');
                    this.mrForm.controls['LoanDisbID'].setValue('');
                    this.mrForm.controls['GlSubIDNew'].setValue('');
                    this.mrForm.controls['SchemeCode'].setValue('');
                    this.mrForm.controls['CropCode'].setValue('');
                    this.mrForm.controls['AmountPayableForReschPer'].setValue(
                        ''
                    );
                    this.mrForm.controls['RescheduleTypeID'].setValue('');
                    this.mrForm.controls['Remarks'].setValue('');

                    this.mrForm.get('Lcno').markAsPristine();
                    this.mrForm.get('Lcno').markAsUntouched();
                    //this.mrForm.get('Lcno').updateValueAndValidity();

                    // const obj =     this.mrForm.get('Lcno');
                    // console.log('obj', obj);

                    this.mrForm.get('LoanAppSanctionID').markAsUntouched();
                    this.mrForm.get('LoanAppSanctionID').markAsPristine();
                    this.mrForm.get('LoanDisbID').markAsUntouched();
                    this.mrForm.get('LoanDisbID').markAsPristine();
                    this.mrForm.get('GlSubIDNew').markAsUntouched();
                    this.mrForm.get('GlSubIDNew').markAsPristine();
                    this.mrForm.get('SchemeCode').markAsUntouched();
                    this.mrForm.get('SchemeCode').markAsPristine();
                    this.mrForm.get('CropCode').markAsUntouched();
                    this.mrForm.get('CropCode').markAsPristine();
                    this.mrForm
                        .get('AmountPayableForReschPer')
                        .markAsUntouched();
                    this.mrForm
                        .get('AmountPayableForReschPer')
                        .markAsPristine();
                    this.mrForm.get('RescheduleTypeID').markAsUntouched();
                    this.mrForm.get('RescheduleTypeID').markAsPristine();
                    this.mrForm.get('Remarks').markAsUntouched();
                    this.mrForm.get('Remarks').markAsPristine();
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
    }

    subProposal() {
        var lCNo;
        this.spinner.show();
        lCNo = this.mrForm.controls['Lcno'].value;
        this._reschedulingService
            .GetSubProposalGL(lCNo, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.SubProposalGLList =
                        baseResponse.Loan.SubProposalGLList;
                    if (this.SubProposalGLList.length == 1) {
                        this.mrForm.controls['LoanAppSanctionID'].setValue(
                            this.SubProposalGLList[0].LoanAppSanctionID
                        );
                        this.Disbursement(
                            this.mrForm.controls['LoanAppSanctionID'].value
                        );
                    }
                    console.log(this.mrForm.value);
                    this.expand = true;
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
    }

    Disbursement(id) {
        var dis = id;
        if (dis != undefined && dis != null) {
            this.spinner.show();

            this._reschedulingService
                .GetDisbursementByGl(dis)
                .pipe(
                    finalize(() => {
                        this.spinner.hide();

                        this.cdRef.detectChanges();
                    })
                )
                .subscribe((baseResponse: BaseResponseModel) => {
                    if (baseResponse.Success === true) {
                        this.DisbursementGLList =
                            baseResponse.Loan.DisbursementGLList;
                        if (this.DisbursementGLList.length == 1) {
                            this.mrForm.controls['LoanDisbID'].setValue(
                                this.DisbursementGLList[0].LoanDisbID
                            );
                            console.log(this.DisbursementGLList);
                        }
                    } else {
                        this.layoutUtilsService.alertElement(
                            '',
                            baseResponse.Message,
                            baseResponse.Code
                        );
                    }
                });
        }
    }

    SubmitData() {

        if(this.rescheduling.LoanReschID == null || this.rescheduling.LoanReschID == undefined){
            this.layoutUtilsService.alertElement('', "Please save before submitting.")
            return
        }

        this.spinner.show();
        this._reschedulingService
            .SubmitRescheduleData(this.rescheduling, this.branch, this.zone)
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
                    this.router.navigateByUrl(
                        '/reschedule-cases/search-reschedule'
                    );
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message
                    );
                }
            });
    }

    clear() {
        //this.mrForm.reset();
        //

        this.mrForm.controls['Lcno'].reset();
        this.mrForm.controls['LoanAppSanctionID'].reset();
        this.mrForm.controls['LoanDisbID'].reset();
        this.mrForm.controls['GlSubIDNew'].reset();
        this.mrForm.controls['SchemeCode'].reset();
        this.mrForm.controls['CropCode'].reset();
        this.mrForm.controls['AmountPayableForReschPer'].reset();
        this.mrForm.controls['RescheduleTypeID'].reset();
        this.mrForm.controls['Remarks'].reset();

        this.mrForm.get('Lcno').markAsPristine();
        this.mrForm.get('Lcno').markAsUntouched();
        //this.mrForm.get('Lcno').updateValueAndValidity();

        // const obj =     this.mrForm.get('Lcno');
        // console.log('obj', obj);

        this.mrForm.get('LoanAppSanctionID').markAsUntouched();
        this.mrForm.get('LoanAppSanctionID').markAsPristine();
        this.mrForm.get('LoanDisbID').markAsUntouched();
        this.mrForm.get('LoanDisbID').markAsPristine();
        this.mrForm.get('GlSubIDNew').markAsUntouched();
        this.mrForm.get('GlSubIDNew').markAsPristine();
        this.mrForm.get('SchemeCode').markAsUntouched();
        this.mrForm.get('SchemeCode').markAsPristine();
        this.mrForm.get('CropCode').markAsUntouched();
        this.mrForm.get('CropCode').markAsPristine();
        this.mrForm.get('AmountPayableForReschPer').markAsUntouched();
        this.mrForm.get('AmountPayableForReschPer').markAsPristine();
        this.mrForm.get('RescheduleTypeID').markAsUntouched();
        this.mrForm.get('RescheduleTypeID').markAsPristine();
        this.mrForm.get('Remarks').markAsUntouched();
        this.mrForm.get('Remarks').markAsPristine();
    }

    cancelTransaction() {
        this.spinner.show();
        this._reschedulingService
            .CancelRescheduleData(this.rescheduling, this.branch, this.zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                    setTimeout(() => {
                        this.router.navigate([
                            '/reschedule-cases/pending-reschedule',
                        ]);
                    }, 2000);
                    this.mrForm.reset();
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
    }

    viewLCInquiry() {
        var Lcno = this.mrForm.controls.Lcno.value;
        var LnTransactionID = this.mrForm.controls.LoanDisbID.value;

        const url = this.router.serializeUrl(
            this.router.createUrlTree(
                [
                    '/loan-recovery/loan-inquiry',
                    {
                        LnTransactionID: LnTransactionID,
                        Lcno: Lcno,
                    },
                ],
                { relativeTo: this.route }
            )
        );
        window.open(url, '_blank');
    }

    // ngOnDestroy() {
    //     if (this.navigationSubscription) {
    //         this.navigationSubscription.unsubscribe();
    //     }
    // }
}
