import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertType} from '@fuse/components/alert';
import {AuthService} from 'app/core/auth/auth.service';
import {ToastrService} from "ngx-toastr";
import {OtpComponent} from '../otp/otp.component';
import {HttpClient} from "@angular/common/http";

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
        private http: HttpClient
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
        this.showAlert = false;


        var loginMode = this.signInForm.value;
        loginMode['App'] = 1;
        this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {

            this.ip = res.ip;
            loginMode['UserIp'] = this.ip;
            this._authService.signIn(loginMode)
                .subscribe((result) => {
                        if (result.Success) {
                            this.toaster.success(result.Message);

                            if (!result.isWebOTPEnabled) {
                                if (result.LoanUtilization) {
                                    localStorage.setItem('MaxNumberOfImages', JSON.stringify(result.LoanUtilization["MaxNumberOfImages"]));
                                    localStorage.setItem('MaxNumberOfVideo', JSON.stringify(result.LoanUtilization["MaxNumberOfVideo"]));
                                    localStorage.setItem('VideoTimeLimit', JSON.stringify(result.LoanUtilization["VideoTimeLimit"]));
                                }
                                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                                this._router.navigateByUrl(redirectURL);
                                window.location.reload();
                            } else if (result.isWebOTPEnabled) {

                                const dialogRef = this.dialog.open(OtpComponent, {
                                    data: {result},
                                    disableClose: true,
                                    panelClass: ['max-w-full', 'max-h-full', 'sm:w-3/12', 'w-full'],
                                });
                                dialogRef.afterClosed().subscribe(res => {
                                    if (res.data.data.Success) {
                                        if (res.data.data.Token && res.data.data.RefreshToken) {
                                            localStorage.setItem('MaxNumberOfImages', JSON.stringify(res?.data?.data?.LoanUtilization["MaxNumberOfImages"]));
                                            localStorage.setItem('MaxNumberOfVideo', JSON.stringify(res?.data?.data?.LoanUtilization["MaxNumberOfVideo"]));
                                            localStorage.setItem('VideoTimeLimit', JSON.stringify(res?.data?.data?.LoanUtilization["VideoTimeLimit"]));
                                            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                                            window.location.reload();
                                            this._router.navigateByUrl(redirectURL);
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
                        this.signInNgForm.resetForm();
                        this.signInForm.enable();
                        this.alert = {
                            type: 'error',
                            message: response
                        };
                        this.showAlert = true;
                    }
                );

        });

    }
}
