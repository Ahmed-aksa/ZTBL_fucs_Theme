import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {DateFormats} from "../../../shared/classes/lov.class";
import {LoanUtilizationModel, UtilizationFiles} from "../Model/loan-utilization.model";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {MatTableDataSource} from "@angular/material/table";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LayoutUtilsService} from "../../../shared/services/layout-utils.service";
import {LoanUtilizationService} from "../service/loan-utilization.service";
import { ViewFileComponent } from '../view-file/view-file.component';

@Component({
    selector: 'kt-loan-utilization',
    templateUrl: './loan-utilization.component.html',
    styleUrls: ['./loan-utilization.component.scss'],
    providers: [
        DatePipe,
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

    //   providers: [
    //  {
    //    provide: MatDialogRef,
    //    useValue: {}
    //  },
    //  {
    //    provide: MAT_DIALOG_DATA,
    //    useValue: {}
    //  },
    // ],
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

    imageUrl: any[] = [];
    videoUrl: any[] = [];
    // file:File[]=[];
    images: UtilizationFiles[] = [];
    videos: UtilizationFiles[] = [];

    errorShow: boolean;
    loanUtilizationModel = new LoanUtilizationModel();
    dataSource: MatTableDataSource<DeceasedCust>;
    LoggedInUserInfo: BaseResponseModel;
    viewonly: boolean = false;
    loggedInUser: any;
    ELEMENT_DATA: DeceasedCust[] = [];

    myModel: boolean = false;
    DeceasedCustomerDisbursementRecoveries = [];
    url: string;
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
        // private _common: CommonService,
        // private datePipe: DatePipe,

    ) {

        this.loggedInUser = userUtilsService.getUserDetails();
        // console.log(this.router.getCurrentNavigation().extras)
        // var val =JSON.stringify(this.router.getCurrentNavigation());
        if (this.router.getCurrentNavigation().extras.state != undefined) {
            this.loanUtilizationModel = this.router.getCurrentNavigation().extras.state.example;
        } else {

        }

        this.mediaGetter = Object.assign(this.loanUtilizationModel)
        // console.log("Model received"+this.loanUtilizationModel)
        router.events.subscribe((val: any) => {
            if (val.url == '/deceased-customer/customers') {
            }
        });

    }


    ngAfterViewInit() {
        if (this.loanUtilizationModel.LoanCaseNo) {
            this.GetMedia();
        }
        // this.GetDisbursement();
        if (this.route.snapshot.params['LnTransactionID'] != null) {

            // this.GetReshTransaction()
        }
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
            this.router.navigate(['/loan-utilization/search-uti']);
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
            this.customerForm.controls.Remarks.setValidators(Validators.required);
        }

        this.customerForm.controls.Zone.setValue(userInfo.Zone.ZoneName);
        this.customerForm.controls.Branch.setValue(userInfo.Branch.Name);
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
            Remarks: [this.loanUtilizationModel.Remarks],
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

        this.spinner.show();
        this._loanutilization
            .DeleteMedia(id)
            .pipe(finalize(() => {
                this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {

                    this.isEmpty = true;
                    if (isVideo == true) {
                        this.videos.splice(val, 1);
                        this.videoUrl.splice(val, 1);
                    } else if (isVideo == false) {
                        this.images.splice(val, 1);
                        this.imageUrl.splice(val, 1);
                    }

                } else {

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

    previewImg(url) {

        const dialogRef = this.dialog.open(ViewFileComponent, {
            width: '70%',
            height: '70%',
            data: { url: url }
        });
    }

    changeStatus(status: string) {

        debugger
        this.loanUtilizationModel.Remarks = this.customerForm.controls.Remarks.value;
        if(this.loanUtilizationModel.Remarks == "" || this.loanUtilizationModel.Remarks == null ){
            var msg = "Please Enter Remarks before submitting"
            this.layoutUtilsService.alertElement(
                "",
                msg,
                ""
            );
            return;
        }

        if(status == "S" && (this.loanUtilizationModel.ID == undefined || this.loanUtilizationModel.ID == null)){
            var msg = "Please save before submitting"
            this.layoutUtilsService.alertElement(
                "",
                msg,
                ""
            );
            return;
        }

        this.customerForm.controls.Remarks.setValidators(Validators.required);

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
                        if(status=="S"){
                            this.router.navigate(['/loan-utilization/search-uti']);
                        }
                        this.layoutUtilsService.alertElementSuccess(
                            '',
                            baseResponse.Message,
                            baseResponse.Code = null
                        );

                    } else {

                        this.layoutUtilsService.alertElement(
                            '',
                            baseResponse.Message,
                            baseResponse.Code = null
                        );
                    }
                });
    }

    find(val) {

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


                } else {

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

        // this.mediaGetter.LoanDisbID &&
        if (this.customerForm.controls.LoanDisbID.value && this.mediaGetter.LoanCaseNo) {
            this.mediaGetter.LoanDisbID = this.customerForm.controls.LoanDisbID.value;
            console.log("condition working")
            this.visible = false;

            this.spinner.show();
            this._loanutilization
                .GetMedia(this.mediaGetter)
                .pipe(finalize(() => {
                    this.spinner.hide();
                }))
                .subscribe((baseResponse) => {
                    if (baseResponse.Success) {
                        this.isEmpty = true;
                        var utilizationFiles = baseResponse.LoanUtilization['UtilizationFiles'];
                        console.log(utilizationFiles);
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

                } else {

                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code = null
                    );
                }
            });
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

         console.log(this.customerForm.controls.Remarks.value)
        debugger
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
        this.loanUtilizationModel.LoanDisbID = this.customerForm.controls.LoanDisbID.value;
        this.loanUtilizationModel.Remarks = this.customerForm.controls.Remarks?.value;
        console.log("After assigning value"+JSON.stringify(this.loanUtilizationModel))
        this.spinner.show();
        this._loanutilization
            .save(this.loanUtilizationModel)
            .pipe(finalize(() => {
                // this.spinner.hide();
            }))
            .subscribe(
                (baseResponse) => {
                    if (baseResponse.Success) {

                        this.loanUtilizationModel.ID = baseResponse.LoanUtilization.UtilizationDetail.ID
                        console.log("id was saved here " + this.loanUtilizationModel.ID);
                        this.SaveImages();
                    } else {
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

                        } else {

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
