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
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MakeReschedule} from 'app/shared/models/Loan.model';
import {NgxSpinnerService} from "ngx-spinner";
import {LovService} from "../../../shared/services/lov.service";
import {DateFormats, Lov, LovConfigurationKey} from "../../../shared/classes/lov.class";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {CircleService} from "../../../shared/services/circle.service";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {NewGlCodeComponent} from "./new-gl-code/new-gl-code.component";
import {finalize} from "rxjs/operators";
import {Branch} from 'app/shared/models/branch.model';
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {Circle} from 'app/shared/models/circle.model';
import {Zone} from 'app/shared/models/zone.model';
import {ReschedulingService} from '../service/rescheduling.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from "@angular/material-moment-adapter";

@Component({
    selector: 'app-make-rc',
    templateUrl: './make-reschedule.component.html',
    styleUrls: ['./make-rc.component.scss'],
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

    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();

    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    Zone: any;

    //Zone inventory
    Circles: any = [];
    SelectedCircles: any = [];
    public Circle = new Circle();

    selected_b: any;
    selected_z: any;
    disable_branch = true;
    disable_zone = true;

    single_branch = true;
    single_zone = true;
    public LnAppSanctionID: string;
    loanReschID: string;

    public ReschedulingTypes: any;

    final_branch: any;
    final_zone: any


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
        private datePipe: DatePipe,
    ) {
        router.events.subscribe((val: any) => {
            if (val.url == "/reschedule-cases/make-reschedule") {
            }
        });
    }

    ngAfterViewInit() {
        // this.GetDisbursement();
        if (this.route.snapshot.params["loanReschID"] != null) {
            this.GetReshTransaction();
        }
    }


    createForm() {
        this.mrForm = this.fb.group({
            Zone: ["", Validators.required],
            Branch: ["", Validators.required],
            TranDate: ["11012021"],
            Lcno: ["", Validators.required],
            LoanAppSanctionID: ["", Validators.required],
            LoanDisbID: ["", Validators.required],
            GlSubIDNew: ["", Validators.required],
            SchemeCode: [""], //
            CropCode: [""], //
            AmountPayableForReschPer: ["", Validators.required],
            ProposalID: ["0"], //
            OutSDMarkupWithIstInstPer: ["100"], //
            RescheduleTypeID: ["", Validators.required],
            Remarks: ["", Validators.required],
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.mrForm.controls[controlName].hasError(errorName);
    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    ngOnInit() {


      this.LoadLovs();
      this.createForm();
      this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();

        if (this.LoggedInUserInfo.Branch && this.LoggedInUserInfo.Branch.BranchCode != null) {

          this.SelectedBranches = this.LoggedInUserInfo.Branch;
          this.SelectedZones = this.LoggedInUserInfo.Zone;
          this.selected_z = this.SelectedZones?.ZoneId
          this.selected_b = this.SelectedBranches?.BranchCode
          this.mrForm.value.Zone = this.SelectedZones?.ZoneName;
          this.mrForm.value.Branch = this.SelectedZones?.BranchCode;
        }else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
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


    }

    //-------------------------------Request Type Core Functions-------------------------------//
    async getRequestTypes() {
        this.RequestTypes = await this._lovService.CallLovAPI(
            (this.LovCall = {TagName: LovConfigurationKey.RequestCategory})
        );
        this.SelectedRequestType = this.RequestTypes.LOVs;
    }

    async LoadLovs() {
        var tempArray = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.ReschedulingTypes})
        this.ReschedulingTypes = tempArray.LOVs;
    }


    GetReshTransaction() {
        this.spinner.show();
        this.loanReschID = this.route.snapshot.params["loanReschID"];
        this.rescheduling.LoanReschID = parseInt(this.loanReschID)

        this._reschedulingService
            .GetReshTransactionByID(this.loanReschID)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {


                if (baseResponse.Success === true) {
                    this.mrForm.controls["RescheduleTypeID"].setValue(
                        baseResponse.Loan.MakeReschedule.RescheduleTypeID
                    );
                    this.mrForm.controls["TranDate"].setValue(
                        baseResponse.Loan.MakeReschedule.EnteredDate
                    );
                    this.mrForm.controls["CropCode"].setValue(
                        baseResponse.Loan.MakeReschedule.CropCode
                    );
                    this.mrForm.controls["SchemeCode"].setValue(
                        baseResponse.Loan.MakeReschedule.SchemeCode
                    );
                    this.mrForm.controls["GlSubIDNew"].setValue(
                        baseResponse.Loan.MakeReschedule.GlSubIDNew
                    );
                    this.mrForm.controls["AmountPayableForReschPer"].setValue(
                        baseResponse.Loan.MakeReschedule.IstInstallmentDefferDays
                    );
                    this.mrForm.controls["Lcno"].setValue(
                        baseResponse.Loan.MakeReschedule.LoanCaseNO
                    );
                    this.subProposal();
                    this.mrForm.controls["OutSDMarkupWithIstInstPer"].setValue(
                        baseResponse.Loan.MakeReschedule.OutSDMarkupWithIstInstPer
                    );
                    this.mrForm.controls["Remarks"].setValue(
                        baseResponse.Loan.MakeReschedule.Remarks
                    );
                    this.mrForm.controls["GlSubIDNew"].setValue(
                        baseResponse.Loan.MakeReschedule.GlSubIDNew
                    );
                } else {
                    this.layoutUtilsService.alertElement(
                        "",
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
        this.assignBranchAndZone();
        this.dailog.open(NewGlCodeComponent, {
            width: "1600px",
            data: {NGlC: this.mrForm.controls.GlSubIDNew.value, zone: this.final_zone, branch: this.final_branch},
            disableClose: true
        });
    }


    GetBranches(ZoneId) {
        this.Branches = [];
        this.mrForm.controls["Branch"].setValue(null);
        this.Zone.ZoneId = ZoneId.value;
        this._circleService
            .getBranchesByZone(this.Zone)
            .pipe(finalize(() => {
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.Branches = baseResponse.Branches;
                    this.SelectedBranches = this.Branches;
                    console.log("Branches loaded", this.SelectedBranches);

                    if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
                        this.mrForm.controls["Branch"].setValue(
                            this.LoggedInUserInfo.Branch.Name
                        );
                        console.log(
                            "this.LoggedInUserInfo.Branch.BranchId",
                            this.LoggedInUserInfo.Branch.BranchId,
                            "this.LoggedInUserInfo.Branch.BranchCode",
                            this.LoggedInUserInfo.Branch.BranchCode
                        );


                    }
                    //this.landSearch.controls['BranchId'].setValue(this.Branches[0].BranchId);
                    this.cdRef.detectChanges();
                }
            });
    }

    SaveData() {
      this.assignBranchAndZone();
        //this.mrForm.controls["TranDate"].setValue(this.datePipe.transform(new Date(), "ddMMyyyy"))
        this.rescheduling = Object.assign(this.mrForm.getRawValue());
        this.spinner.show();
        this._reschedulingService
            .SaveMakeRescheduleLoan(this.rescheduling,this.final_branch,this.final_zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    this.rescheduling.LoanReschID = baseResponse.Loan.MakeReschedule.LoanReschID
                    this.layoutUtilsService.alertElement(
                        "",
                        baseResponse.Message,
                        baseResponse.Code
                    );
                    setTimeout(() => {
                            this.router.navigate(['/reschedule-cases/pending-reschedule']);
                        },
                        2000);
                    this.mrForm.controls["Lcno"].setValue('');
                    this.mrForm.controls["LoanAppSanctionID"].setValue('');
                    this.mrForm.controls["LoanDisbID"].setValue('');
                    this.mrForm.controls["GlSubIDNew"].setValue('');
                    this.mrForm.controls["SchemeCode"].setValue('');
                    this.mrForm.controls["CropCode"].setValue('');
                    this.mrForm.controls["AmountPayableForReschPer"].setValue('');
                    this.mrForm.controls["RescheduleTypeID"].setValue('');
                    this.mrForm.controls["Remarks"].setValue('');

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
                } else {
                    this.layoutUtilsService.alertElement(
                        "",
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
    }

    subProposal() {
        var lCNo;
        this.spinner.show();
        lCNo = this.mrForm.controls["Lcno"].value;
        this.assignBranchAndZone();
        this._reschedulingService
        .GetSubProposalGL(lCNo, this.final_branch, this.final_zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {


                if (baseResponse.Success === true) {
                    this.SubProposalGLList = baseResponse.Loan.SubProposalGLList;
                    if (this.SubProposalGLList.length == 1) {
                        this.mrForm.controls["LoanAppSanctionID"].setValue(
                            this.SubProposalGLList[0].LoanAppSanctionID
                        );
                        this.Disbursement(this.mrForm.controls["LoanAppSanctionID"].value);
                    }
                    console.log(this.mrForm.value)
                    this.expand = true;
                } else {
                    this.layoutUtilsService.alertElement(
                        "",
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

                        this.DisbursementGLList = baseResponse.Loan.DisbursementGLList;
                        if (this.DisbursementGLList.length == 1) {
                            this.mrForm.controls["LoanDisbID"].setValue(
                                this.DisbursementGLList[0].LoanDisbID
                            );
                            console.log(this.DisbursementGLList)
                        }
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

    SubmitData() {
        this.spinner.show();
        this.assignBranchAndZone();
        this._reschedulingService
        .SubmitRescheduleData(this.rescheduling,this.final_branch,this.final_zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

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

    clear() {
        //this.mrForm.reset();
        //


        this.mrForm.controls["Lcno"].reset();
        this.mrForm.controls["LoanAppSanctionID"].reset();
        this.mrForm.controls["LoanDisbID"].reset();
        this.mrForm.controls["GlSubIDNew"].reset();
        this.mrForm.controls["SchemeCode"].reset();
        this.mrForm.controls["CropCode"].reset();
        this.mrForm.controls["AmountPayableForReschPer"].reset();
        this.mrForm.controls["RescheduleTypeID"].reset();
        this.mrForm.controls["Remarks"].reset();

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
        this.assignBranchAndZone();
        this._reschedulingService
            .CancelRescheduleData(this.rescheduling,this.final_branch,this.final_zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElement(
                        "",
                        baseResponse.Message,
                        baseResponse.Code
                    );
                    setTimeout(() => {
                            this.router.navigate(['/reschedule-cases/pending-reschedule']);
                        },
                        2000);
                    this.mrForm.reset();
                } else {
                    this.layoutUtilsService.alertElement(
                        "",
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
            this.router.createUrlTree(['../loan-inquiry', {
                LnTransactionID: LnTransactionID,
                Lcno: Lcno
            }], {relativeTo: this.route})
        );
        window.open(url, '_blank');
    }

  
    changeZone(changedValue) {
        let changedZone = {Zone: {ZoneId: changedValue.value}}
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }

    private assignBranchAndZone() {
      if (this.SelectedBranches.length)
          this.final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0]
      else
          this.final_branch = this.SelectedBranches;
      let zone = null;
      if (this.SelectedZones.length)
          this.final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
      else
          this.final_zone = this.SelectedZones;
  }

}
