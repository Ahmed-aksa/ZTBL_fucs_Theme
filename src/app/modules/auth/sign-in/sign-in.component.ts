import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertType} from '@fuse/components/alert';
import {AuthService} from 'app/core/auth/auth.service';
import {ToastrService} from "ngx-toastr";
import {OtpComponent} from '../otp/otp.component';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import Forge from "node-forge";
import {environment} from "../../../../environments/environment";
import {CommonService} from "../../../shared/services/common.service";
import {EncryptDecryptService} from "../../../shared/services/encrypt_decrypt.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    ip: string;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private toaster: ToastrService,
        public dialog: MatDialog,
        private http: HttpClient,
        private _common: CommonService,
        private encryptDecryptService: EncryptDecryptService,
        private spinner: NgxSpinnerService,
    ) {
    }

    ngOnInit(): void {
        this.signInForm = this._formBuilder.group({
            DisplayName: ['', [Validators.required]],
            Password: ['', Validators.required],
        });
    }

    signIn(): void {
        if (this.signInForm.invalid) {
            return;
        }
        this.signInForm.disable();
        var user = localStorage.getItem("ZTBLUser")
        if (!user) {
            let key = this.getNewKey();
            let UDID = this._common.newGuid();
            var data = {
                "DeviceInfo": {
                    "IMEI": UDID
                },
                "Key": key,
                "TranId": 0,
                "User": {
                    "IsActive": 0,
                    "App": 1,
                    "Channel": "user",
                    "ChannelID": 0,
                }
            }
            var responseEncript = this.encryptDecryptService.AESencrypt(key, data);

            var rsa1 = Forge.pki.publicKeyFromPem(environment.publicRSAKey);
            var encrypt = (rsa1.encrypt(key));
            encrypt = window.btoa(encrypt);


            var cusomeRequestModel = {
                // "Key": encrypt,
                "Req": responseEncript

            }

            let headers = new HttpHeaders({
                "key": encrypt
            });
            let options = {headers: headers};
            this.spinner.show();
            if (environment.IsEncription)
                this.http.post(`${environment.apiUrl}/Account/HealthCheck`, cusomeRequestModel, options).subscribe((result: any) => {
                    if (result.Success) {
                        let Keydata = this.encryptDecryptService.AESdecrypt(key, result.Resp);
                        localStorage.setItem("ztblKey", JSON.parse(Keydata).Key);
                        localStorage.setItem("ztbludid", UDID);
                        this.finalSignIn();
                    }
                });
            else
                this.finalSignIn();
        }


    }

    getNewKey() {
        let key = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return key
    }

    private finalSignIn() {
        this.showAlert = false;
        var loginMode = this.signInForm.value;
        loginMode['App'] = 1;

        this._authService.signIn(loginMode)
            .subscribe((result) => {
                    this.spinner.hide();
                    if (result.Success) {
                        this.toaster.success(result.Message);
                        if (!result.isWebOTPEnabled) {
                            if (result.LoanUtilization) {
                                localStorage.setItem('MaxNumberOfImages', JSON.stringify(result.LoanUtilization["MaxNumberOfImages"]));
                                localStorage.setItem('MaxNumberOfVideo', JSON.stringify(result.LoanUtilization["MaxNumberOfVideo"]));
                                localStorage.setItem('VideoTimeLimit', JSON.stringify(result.LoanUtilization["VideoTimeLimit"]));
                            }
                            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                            this._router.navigateByUrl(redirectURL).then(() => {
                                window.location.reload();
                            });
                        } else if (result.isWebOTPEnabled) {
                            const dialogRef = this.dialog.open(OtpComponent, {
                                data: {result},
                                disableClose: true,
                                panelClass: ['max-w-full', 'max-h-full', 'sm:w-3/12', 'w-full'],
                            });

                            dialogRef.afterClosed().subscribe(res => {
                                if (res.data.data.Success) {
                                    if (res.data.data.Token) {
                                        localStorage.setItem('MaxNumberOfImages', JSON.stringify(res?.data?.data?.LoanUtilization["MaxNumberOfImages"]));
                                        localStorage.setItem('MaxNumberOfVideo', JSON.stringify(res?.data?.data?.LoanUtilization["MaxNumberOfVideo"]));
                                        localStorage.setItem('VideoTimeLimit', JSON.stringify(res?.data?.data?.LoanUtilization["VideoTimeLimit"]));
                                        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                                        this._router.navigateByUrl(redirectURL).then(() => {
                                            window.location.reload();
                                        });
                                    } else {
                                        this.signInNgForm.resetForm();
                                        this.signInForm.enable();
                                        // this.alert = {
                                        //     type: 'error',
                                        //     message: 'invalid OTP',
                                        // };
                                        this._router.navigateByUrl("/auth/sign-in");
                                        // this.showAlert = true;

                                    }
                                } else {
                                    this.signInNgForm.resetForm();
                                    this.signInForm.enable();
                                    // this.alert = {
                                    //     type: 'error',
                                    //     message: 'invalid OTP',
                                    // };
                                    this._router.navigateByUrl("/auth/sign-in");
                                    // this.showAlert = true;
                                }
                            });
                        }
                    } else {
                        this.signInNgForm.resetForm();
                        this.signInForm.enable();
                        this.alert = {
                            type: 'error',
                            message: result.Message,
                        };
                        this.showAlert = true;

                    }

                },
                (response) => {
                    this.spinner.hide();

                    this.signInNgForm.resetForm();
                    this.signInForm.enable();
                    this.alert = {
                        type: 'error',
                        message: response
                    };
                    this.showAlert = true;
                }
            );
    }
}
