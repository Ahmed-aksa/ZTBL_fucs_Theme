/* eslint-disable radix */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable curly */
/* eslint-disable guard-for-in */
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
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DateFormats, Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { Branch } from 'app/shared/models/branch.model';
import { Circle } from 'app/shared/models/circle.model';
import { MakeReschedule } from 'app/shared/models/loan-application-header.model';
import { Zone } from 'app/shared/models/zone.model';
import { CircleService } from 'app/shared/services/circle.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LovService } from 'app/shared/services/lov.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { ReschedulingService } from '../service/rescheduling.service';
import { NewGlCodeComponent } from './new-gl-code/new-gl-code.component';

@Component({
  selector: 'app-make-reschedule',
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

export class MakeRescheduleComponent implements OnInit {
  mrForm: FormGroup;

  public rescheduling = new MakeReschedule();

  LoggedInUserInfo: BaseResponseModel;

  errorShow: boolean;
  hasFormErrors = false;
  Table : boolean = false;
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
  public Zone = new Zone();

  selected_z;
  selected_b;

  disable_circle = true;
  disable_zone = true;
  disable_branch = true;
  single_branch = true;
  single_circle = true;
  single_zone = true;

  loaded = false;

  //Zone inventory
  Circles: any = [];
  SelectedCircles: any = [];
  public Circle = new Circle();
  public LnAppSanctionID: string;
  loanReschID: string;

  public ReschedulingTypes: any;



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
      Zone: [null, Validators.required],
      Branch: [null, Validators.required],
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
    
    this.createForm();
    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
    if (this.LoggedInUserInfo.Branch != null) {

      this.Branches = this.LoggedInUserInfo.Branch;
      this.SelectedBranches = this.Branches;

      this.Zone = this.LoggedInUserInfo.Zone;
      this.SelectedZones = this.Zone;

      this.selected_z = this.SelectedZones.ZoneId
      this.selected_b = this.SelectedBranches.BranchCode
      console.log(this.SelectedZones)
      this.mrForm.controls["Zone"].setValue(this.SelectedZones.ZoneName);
      this.mrForm.controls["Branch"].setValue(this.SelectedBranches.Name);

    }else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
      this.spinner.show();

      this.userUtilsService.getZone().subscribe((data: any) => {
          this.Zone = data.Zones;
          this.SelectedZones = this.Zone;
          this.single_zone = false;
          this.disable_zone = false;
          this.spinner.hide();

      });}
    
    this.LoadLovs();
    //-------------------------------Loading Circle-------------------------------//

    if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
      debugger;
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;
    }

    //-------------------------------Loading Request-------------------------------//

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
    var tempArray = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.ReschedulingTypes })
    this.ReschedulingTypes = tempArray.LOVs;
  }


  GetReshTransaction() {
    this.spinner.show();
    this.loanReschID = this.route.snapshot.params["loanReschID"];
    this.rescheduling.LoanReschID = parseInt(this.loanReschID)
    debugger;
    this._reschedulingService
      .GetReshTransactionByID(this.loanReschID)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;

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
    debugger
    //this.dailog.open(NewGlCodeComponent, { width: "800px", data: { NGlC: this.mrForm.controls.NGlC.value }, disableClose: true });

    // const dialogRef = this.dailog.open(NewGlCodeComponent, { width: "1600px", data: { NGlC: this.mrForm.controls.GlSubIDNew.value }, disableClose: true });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (!res) {
    //     return;
    //   }
    //   this.mrForm.controls.GlSubIDNew.setValue(res);
    // });
    
    this.dailog.open(NewGlCodeComponent,{
      width: "1600px",
      data: { NGlC: this.mrForm.controls.GlSubIDNew.value },
      disableClose: true
    });
  }

  

  SaveData() {
    debugger
      //this.mrForm.controls["TranDate"].setValue(this.datePipe.transform(new Date(), "ddMMyyyy"))
    this.rescheduling = Object.assign(this.mrForm.getRawValue());
    this.spinner.show();
    this._reschedulingService
      .SaveMakeRescheduleLoan(this.rescheduling)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
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
    debugger;
    this._reschedulingService
      .GetSubProposalGL(lCNo)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;

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
    debugger;
    var dis = id;
    if (dis != undefined && dis != null) {
      debugger;
      this.spinner.show();

      debugger;
      this._reschedulingService
        .GetDisbursementByGl(dis)
        .pipe(
          finalize(() => {
            this.spinner.hide();

            this.cdRef.detectChanges();
          })
        )
        .subscribe((baseResponse: BaseResponseModel) => {
          debugger;
          if (baseResponse.Success === true) {
            debugger;
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

  SubmitData(){
    this.spinner.show();
    
    debugger;
    this._reschedulingService
      .SubmitRescheduleData(this.rescheduling)
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

  clear(){
    //this.mrForm.reset();
    // debugger
  

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


  cancelTransaction(){
    this.spinner.show();
    debugger;
    this._reschedulingService
      .CancelRescheduleData(this.rescheduling)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
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
  viewLCInquiry(){
    var Lcno = this.mrForm.controls.Lcno.value;
    var LnTransactionID = this.mrForm.controls.LoanDisbID.value;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['../loan-inquiry', { LnTransactionID: LnTransactionID, Lcno: Lcno }], { relativeTo: this.route })
    );
    window.open(url, '_blank');   
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
