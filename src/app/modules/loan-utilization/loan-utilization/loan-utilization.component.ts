import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateFormats } from 'app/shared/classes/lov.class';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer, Documents, MarkDeceasedCustomer } from 'app/shared/models/deceased_customer.model';
import { LoanUtilizationModel, UtilizationFiles } from 'app/shared/models/loan-utilization.model';
import { MatTableDataSource } from '@angular/material/table';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LoanUtilizationService } from 'app/shared/services/loan-utilization.service';
import { ViewFileComponent } from 'app/shared/component/view-file/view-file.component';

@Component({
  selector: 'kt-loan-utilization',
  templateUrl: './loan-utilization.component.html',
  styleUrls: ['./loan-utilization.component.scss'],
  providers: [
    DatePipe,LoanUtilizationService, 
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats },
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    },
  ],
})
export class LoanUtilizationComponent implements OnInit {
  @Input() loanutilization: any;

  customerForm: FormGroup;
  //matElects: FormGroup;

  displayedColumns = [
    'LoanCaseNo',
    'gl',
    'scm',
    'crp',
    'rate',
    'disb_date',
    'disb_amt',
    'principal',
    'tot_markup',
    'markup_rec',
    'other_charges',
    'legal_charges',
    'balance',
  ];

  isMCO: boolean = false;
  isBM: boolean = false;
  remarksFeild: boolean = false;
  // options
  isSave: boolean = false;
  isSubmit: boolean = false;
  isDelete: boolean = false;
  isReffer: boolean = false;
  isAuthorize: boolean = false;
  //

  visible: any = true;
  hasFormErrors = false;
  isEmpty: boolean = false;
  viewerOpen = false;
  txtValue: string = null;
  len: string = null;
  public markDeceasedCustomer = new MarkDeceasedCustomer();
  imageUrl: any[] = [];
  videoUrl: any[] = [];
  // file:File[]=[];
  images: UtilizationFiles[] = [];
  videos: UtilizationFiles[] = [];
  rawData = new Documents();
  errorShow: boolean;
  loanUtilizationModel = new LoanUtilizationModel();
  dataSource: MatTableDataSource<DeceasedCust>;
  LoggedInUserInfo: BaseResponseModel;
  viewonly: boolean = false;
  loggedInUser: any;
  ELEMENT_DATA: DeceasedCust[] = [];

  myModel: boolean = false;
  DeceasedCustomerInf;
  DeceasedCustomerDisbursementRecoveries = [];
  DeceasedCustomerAttachedFile = [];
  url: string;
  public deceasedInfo = new Customer();
  DisbursementsRecoveries = [];
  LoanApplicants = [];
  Loanpurpose = [];
  cnicn;
  name;
  LoanGls;
  mediaGetter;
  options: boolean = false;
  select: Selection[] = [
    { value: '0', viewValue: 'NO' },
    { value: '1', viewValue: 'Yes' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService,
    private _loanutilization: LoanUtilizationService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
   

  ) {
    this.loggedInUser = userUtilsService.getUserDetails();
    // debugger;
    // if (this.router?.getCurrentNavigation()?.extras?.state != undefined) {
    //   this.loanUtilizationModel = this.router.getCurrentNavigation().extras.state.example;
    // } else {

    // }

    // this.mediaGetter = Object.assign(this.loanUtilizationModel)
    // // console.log("Model received"+this.loanUtilizationModel)
    // router.events.subscribe((val: any) => {
    //   if (val.url == '/deceased-customer/customers') {
    //   }
    // });
  }


  ngAfterViewInit() {
    // if (this.loanUtilizationModel.LoanCaseNo) {
    //   this.GetMedia();
    // }
    // // this.GetDisbursement();
    // if (this.route.snapshot.params['LnTransactionID'] != null) {
    //   // this.GetReshTransaction()
    // }
  }

  //to disable future date
  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  MaxNumberOfImages: number;
  MaxNumberOfVideo: number;
  VideoTimeLimit: number;

  ngOnInit() {
    this.setMediaLimits();
    if (this.loanUtilizationModel.LoanCaseNo) {
      if (this.loanUtilizationModel["view"] == "1") {
        this.viewonly = true;
      }
      else {
        this.viewonly = false;
      }


      // console.log("loancase no found");
      this.find(this.loanUtilizationModel.LoanCaseNo);

      // this.GetMedia();
    } else {
      //this.router.navigate(['/loan-utilization/search-uti']);
    }
    this.createForm();
    this.checkUser();
    this.setOptions();
  }

  checkUser() {
    var userInfo = this.userUtilsService.getUserDetails();
    // console.log(userInfo);
    if (userInfo.User.userGroup[0].ProfileID == '56') {
      this.isMCO = true;
    } else if (userInfo.User.userGroup[0].ProfileID == '57') {
      this.isBM = true;
      this.customerForm.controls.remarks.setValidators(Validators.required);
    }

    this.customerForm.controls.Zone.setValue(userInfo?.Zone?.ZoneName);
    this.customerForm.controls.Branch.setValue(userInfo?.Branch?.Name);
  }

  setOptions() {
    if (this.isMCO) {
      if (this.loanUtilizationModel.Status == 'P') {
        this.isSave = true;
        this.isSubmit = true;
        this.remarksFeild = false;
        this.isDelete = true;
      } else if (this.loanUtilizationModel.Status == "R") {
        this.isSave = true;
        this.isSubmit = true;
        this.isDelete = true;
        this.remarksFeild = false;
      } else if (this.loanUtilizationModel.Status == "Add") {
        this.isSave = true;
        this.isSubmit = true;
        this.remarksFeild = false;
      }
    } else if (this.isBM) {
      if (this.loanUtilizationModel.Status == "S") {
        this.isReffer = true;
        this.isAuthorize = true;
        this.viewonly = true;
        this.options;
        this.remarksFeild = false;
      }
    }
  }


  setMediaLimits() {
    this.MaxNumberOfImages = JSON.parse(localStorage.getItem('MaxNumberOfImages'));
    this.MaxNumberOfVideo = JSON.parse(localStorage.getItem('MaxNumberOfVideo'));
    this.VideoTimeLimit = JSON.parse(localStorage.getItem('VideoTimeLimit'));
  }

  hasError(controlName: string, errorName: string): boolean {
    //debugger;
    return this.customerForm.controls[controlName].hasError(errorName);
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  createForm() {
    this.customerForm = this.fb.group({
      Zone: ['', Validators.required],
      Branch: ['', Validators.required],
      LoanDisbID: [this.loanUtilizationModel.LoanDisbID, Validators.required],
      Lat: [this.loanUtilizationModel.LoanCaseNo],
      Lng: [this.loanUtilizationModel.LoanDisbID],
      LoanCaseNo: [this.loanUtilizationModel.LoanCaseNo],
      remarks: [this.loanUtilizationModel.Remarks],
      file: [''],
      fileV: [''],
      Status: [this.loanUtilizationModel.Status],
      CircleId: [this.loanUtilizationModel.CircleId],
      ID: [this.loanUtilizationModel.ID],
    });
    // this.customerForm.controls["DetailSourceIncome"].disable();
  }

  // onAlertClose($event) {
  //   this.hasFormErrors = false;
  // }

  mydata = [];
  imagearray = [];
  urls = [];

  onSelectFile(event) {
    debugger
    if (this.images.length < this.MaxNumberOfImages) {

      if (event.target.files && event.target.files[0]) {
        var Name = event.target.files[0].name.split('.').pop();
        if (Name != undefined) {
          if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'jpeg' || Name.toLowerCase() == 'png') {
            var reader = new FileReader();
            reader.onload = (event: any) => {
              this.imageUrl.push(event.target.result);
              console.log(this.imageUrl);
            };
            reader.readAsDataURL(event.target.files[0]);
            var utilizationFile = new UtilizationFiles();
            utilizationFile.file = Object.assign(event.target.files[0]);
            this.images.push(utilizationFile);
          } else {
            this.layoutUtilsService.alertElement('', 'Only jpeg,jpg and png files are allowed', '');
            return;
          }
        }
      }
      // console.log(this.images);
      // console.log(this.imageUrl);
    } else {
      this.layoutUtilsService.alertElement('', 'maximum ' + this.MaxNumberOfImages + ' Images allowed', '');
      return;
    }
  }

  onSelectFileV(event) {
    if (this.videos.length < this.MaxNumberOfVideo) {
      if (event.target.files && event.target.files[0]) {
        var Name = event.target.files[0].name.split('.').pop();
        if (Name != undefined) {
          if (Name.toLowerCase() == 'mp4') {
            var reader = new FileReader();
            reader.onload = (event: any) => {
              this.videoUrl.push(event.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
            var utilizationFile = new UtilizationFiles();
            utilizationFile.file = Object.assign(event.target.files[0]);
            this.videos.push(utilizationFile);
          } else {
            this.layoutUtilsService.alertElement('', 'Only .mp4 files are allowed', '');
            return;
          }
        }
      }
      // console.log(this.videos);
      // console.log(this.videoUrl);
    } else {
      this.layoutUtilsService.alertElement('', 'maximum ' + this.MaxNumberOfVideo + ' Videos allowed', '');
      return;
    }
  }

  videodata() {

    //   for (let i = 0; i < this.file.length; i++) {
    //     console.log(this.file.length)
    // console.log(this.file[i])
    //   }
  }

  deleteData(id: string, val: number, isVideo: boolean) {
    debugger
    this.spinner.show();
    this._loanutilization
      .DeleteMedia(id)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe((baseResponse) => {
        if (baseResponse.Success) {
          debugger;
          this.isEmpty = true;
          if (isVideo == true) {
            this.videos.splice(val, 1);
            this.videoUrl.splice(val, 1);
          } else if (isVideo == false) {
            this.images.splice(val, 1);
            this.imageUrl.splice(val, 1);
          }
          debugger
        } else {
          debugger;
          this.layoutUtilsService.alertElement(
            '',
            baseResponse.Message,
            baseResponse.Code = null
          );
        }
      });

  }

  imageid;
  videoid;

  removeImage(url, val: number) {
    // console.log("valuee" + val)
    // console.log("url" + url);
    if (!url.includes('base64')) {
      this.imageid = this.images.find(temp => temp.ImageFilePath == url);
      this.deleteData(this.imageid['ID'], val, false);
    } else {
      this.images.splice(val, 1);
      this.imageUrl.splice(val, 1);
    }
  }

  removeVideo(url, val: number) {
    if (!url.includes('base64')) {
      this.videoid = this.videos.find(temp => temp.VideoFilePath == url);
      this.deleteData(this.videoid['ID'], val, true);
    } else {
      this.videos.splice(val, 1);
      this.videoUrl.splice(val, 1);
    }

  }

  getDuration(e, i) {
    debugger
    const duration = e.target.duration;
    if (duration > this.VideoTimeLimit * 60) {
      this.layoutUtilsService.alertElement('', 'Duration cannot exceeded more then ' + this.VideoTimeLimit + ' minute', '');
      this.videos.splice(i, 1);
      this.videoUrl.splice(i, 1);
    }
  }

  ifResetRequired() {
    // console.log(this.images.length)
    // if(this.images.length==0){
    this.customerForm.controls['file'].reset();
    // }
  }

  ifResetRequiredV() {
    // console.log(this.videos.length)
    // if(this.videos.length==0){
    this.customerForm.controls['fileV'].reset();
    // }
  }

  // uploadFiles () {
  //   const frmData = new FormData();

  //   for (var i = 0; i < this.myFiles.length; i++) {
  //     frmData.append("fileUpload", this.myFiles[i]);
  //   }
  // }

  // onChange(e){
  //   console.log(e);
  // }

  onChang(e) {
    console.log(e);
    if (e == false) {
      this.myModel = true;
      // this.customerForm.controls["IsNadraCertificateVerified"].setValue(this.myModel);
    } else {
      this.myModel = false;
      // this.customerForm.controls["IsNadraCertificateVerified"].setValue(this.myModel);
    }
    console.log(e);
  }

  previewImg() {
    debugger
    debugger
    const dialogRef = this.dialog.open(ViewFileComponent, {
      width: '90%',
      height: '90%',
      data: { documentView: this.DeceasedCustomerAttachedFile, url: this.imageUrl }
    });
  }

  changeStatus(status: string) {
    if(status == "S" && (this.loanUtilizationModel.ID == undefined || this.loanUtilizationModel.ID == null)){
      
      var msg = "Please save before submitting"
      this.layoutUtilsService.alertElement(
        "",
        msg,
        ""
      );
      return;
    }
    this.loanUtilizationModel = Object.assign(this.customerForm.value);
    debugger
    this.loanUtilizationModel.Status = status;
    this.spinner.show();
    this._loanutilization
      .statusChange(this.loanUtilizationModel)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        (baseResponse) => {
          if (baseResponse.Success) {
            this.layoutUtilsService.alertElementSuccess(
              '',
              baseResponse.Message,
              baseResponse.Code = null
            );
            debugger
          } else {
            debugger;
            this.layoutUtilsService.alertElement(
              '',
              baseResponse.Message,
              baseResponse.Code = null
            );
          }
        });
  }

  find(val) {
    debugger
    this.spinner.show();
    this._loanutilization
      .GetLoanDetail(val)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe((baseResponse) => {
        if (baseResponse.Success) {
          this.isEmpty = true;
          this.DisbursementsRecoveries = baseResponse.LoanUtilization['DisbursementsRecoveries'];
          this.LoanApplicants = baseResponse.LoanUtilization['LoanApplicants'];
          this.Loanpurpose = baseResponse.LoanUtilization['Loanpurpose'];

          debugger
        } else {
          debugger;
          this.layoutUtilsService.alertElement(
            '',
            baseResponse.Message,
            baseResponse.Code = null
          );
        }
        this.GetLoanGL(val);
      });
  }


  UtilizationFiles;

  GetMedia() {
    console.log('media');
    console.log('media' + this.mediaGetter);

    if (this.mediaGetter.LoanDisbID && this.mediaGetter.LoanCaseNo) {
      this.visible = false;
      debugger
      this.spinner.show();
      this._loanutilization
        .GetMedia(this.mediaGetter)
        .pipe(finalize(() => {
          this.spinner.hide();
        }))
        .subscribe((baseResponse) => {
          if (baseResponse.Success) {
            debugger
            this.images.splice(0, this.images.length - 1);
            this.imageUrl.splice(0, this.imageUrl.length - 1);
            this.videos.splice(0, this.videos.length - 1);
            this.videoUrl.splice(0, this.videoUrl.length - 1);

            this.isEmpty = true;
            var utilizationFiles = baseResponse.LoanUtilization['UtilizationFiles'];
            // console.log(utilizationFiles);
            if (utilizationFiles) {
              for (let i = 0; i < utilizationFiles.length; i++) {
                if (utilizationFiles[i].ImageFilePath) {
                  this.images.push(utilizationFiles[i]);
                  this.imageUrl.push(utilizationFiles[i].ImageFilePath);
                } else {
                  this.videos.push(utilizationFiles[i]);
                  this.videoUrl.push(utilizationFiles[i].VideoFilePath);
                }
              }
            }
            this.visible = true;
          } else {
            this.visible = true;
            debugger;
            this.layoutUtilsService.alertElement(
              '',
              baseResponse.Message,
              baseResponse.Code = null
            );
          }


        });
    }
  }

  GetLoanGL(val) {
    debugger
    this.spinner.show();
    this._loanutilization
      .GetLoanGL(val)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe((baseResponse) => {
        if (baseResponse.Success) {
          this.isEmpty = true;
          this.LoanGls = baseResponse.LoanUtilization['LoanGls'];
          // console.log(this.LoanGls);
          debugger
        } else {
          debugger;
          this.layoutUtilsService.alertElement(
            '',
            baseResponse.Message,
            baseResponse.Code = null
          );
        }
      });
  }

  viewDocument(id) {
    debugger
    for (var a = 0; this.DeceasedCustomerAttachedFile.length > a; a++) {
      debugger
      if (id == this.DeceasedCustomerAttachedFile[a].ID) {
        debugger
        this.url = this.DeceasedCustomerAttachedFile[a].Path;
      }
    }
    debugger
    const dialogRef = this.dialog.open(ViewFileComponent, {
      width: '50%',
      height: '50%',
      data: { documentView: this.DeceasedCustomerAttachedFile, url: this.url }
    });
  }

  OnChangeDisable(value) {
    if (value == '0') {
      this.customerForm.controls['DetailSourceIncome'].reset();
      this.customerForm.controls['DetailSourceIncome'].disable();
      this.markDeceasedCustomer.OtherSourceOfIncome = null;
    } else if (value == '1') {
      this.customerForm.controls['DetailSourceIncome'].reset();
      this.customerForm.controls['DetailSourceIncome'].enable();
      this.customerForm.controls['DetailSourceIncome'].setValidators(Validators.required);
      this.customerForm.controls['DetailSourceIncome'].updateValueAndValidity();
    } else {
      this.customerForm.controls['DetailSourceIncome'].reset();
      this.customerForm.controls['DetailSourceIncome'].disable();
      this.markDeceasedCustomer.OtherSourceOfIncome = null;
    }
  }

  changed(value) {
    this.len = value.target.value;
    if (this.len.length <= 13) {
      //this.customerForm.reset();
      this.isEmpty = false;
      this.customerForm.markAsUntouched();
      this.customerForm.markAsPristine();
    }
  }

  UtilizationId;

  save() {
    if (this.customerForm.invalid) {
      const controls = this.customerForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hasFormErrors = true;
      return;
    }

    if (this.images.length < 1) {
      var Message = 'Please add atleast one image';
      this.layoutUtilsService.alertElement(
        '',
        Message,
        null
      );
      return;
    }

    if (this.videos.length < 1) {
      var Message = 'Please add atleast one video';
      this.layoutUtilsService.alertElement(
        '',
        Message,
        null
      );
      return;
    }
    // this.customerForm.controls.Status.setValue("P");
    this.loanUtilizationModel = Object.assign(this.customerForm.value);

    debugger
    this.spinner.show();
    this._loanutilization
      .save(this.loanUtilizationModel)
      .pipe(finalize(() => {
        // this.spinner.hide();
      }))
      .subscribe(
        (baseResponse) => {
          if (baseResponse.Success) {
            // var j = JSON.stringify(baseResponse)
            // console.log("baseResponse"+j);
            debugger
            this.loanUtilizationModel.ID = baseResponse.LoanUtilization.UtilizationDetail.ID
            console.log("id was saved here " + this.loanUtilizationModel.ID);
            this.SaveImages();

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
  currentIndex: number = 0;

  message = "";

  SaveImages() {
    if (this.currentIndex < this.images.length) {
      if (this.images[this.currentIndex].ImageFilePath == undefined) {
        debugger
        // this.spinner.show();
        this._loanutilization
          .SaveMedia(this.images[this.currentIndex].file, this.loanUtilizationModel, '0')
          .pipe(finalize(() => {
            // this.spinner.hide();
          }))
          .subscribe((baseResponse) => {
            if (baseResponse.Success) {
              this.message = baseResponse.Message
              this.currentIndex++
              this.SaveImages()
              debugger
            } else {
              debugger;
              this.layoutUtilsService.alertElement(
                '',
                baseResponse.Message,
                baseResponse.Code = null
              );
            }
          });
      } else {
        this.currentIndex++
        this.SaveImages()
      }

    } else {
      this.currentIndex = 0
      this.SaveVideos();
    }
  }

  SaveVideos() {
    // console.log(this.videos);
    if (this.currentIndex < this.videos.length) {
      if (this.videos[this.currentIndex].VideoFilePath == undefined) {
        debugger
        // this.spinner.show();
        this._loanutilization
          .SaveMedia(this.videos[this.currentIndex].file, this.loanUtilizationModel, '1')
          .pipe(finalize(() => {
            this.spinner.hide();
          }))
          .subscribe((baseResponse) => {
            if (baseResponse.Success) {
              this.message = baseResponse.Message
              this.currentIndex++
              this.SaveVideos()

            } else {
              debugger;
              this.layoutUtilsService.alertElement(
                '',
                baseResponse.Message,
                baseResponse.Code = null
              );
            }
          });
      } else {
        this.currentIndex++
        this.SaveVideos()
      }
    } else {
      if(this.message != ""){
      this.layoutUtilsService.alertElementSuccess(
        '',
        this.message,
        null
      );
      this.images = [];
      this.imageUrl = [];
      this.videos = [];
      this.videoUrl = [];
      this.GetMedia();
      }else{
        this.spinner.hide();
      }
    }
  }

}


export interface Selection {
  value: string;
  viewValue: string;
}

export interface DeceasedCust {
  LoanCaseNo: string;
  GlDescription: string;
  SchemeCode: string;
  CropCode: string;
  IntRate: string;
  DisbDate: string;
  DisbursedAmount: string;
  RecoverdPrincipal: string;
  ToDateMarkup: string;
  RecoveredMarkup: string;
  OtherReceiveable: string;
  LegalChargesReceiveable: string;
  Balance: string;
}
