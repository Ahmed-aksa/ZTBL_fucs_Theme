import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ToastrService } from "ngx-toastr";
import { OtpComponent } from '../otp/otp.component';

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

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private toaster: ToastrService,
        public dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        localStorage.clear();
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
        this._authService.signIn(loginMode)
            .subscribe((result) => {
                if (result.Success && !result.isWebOTPEnabled) {
                    localStorage.setItem('MaxNumberOfImages', JSON.stringify(result.LoanUtilization["MaxNumberOfImages"]));
                    localStorage.setItem('MaxNumberOfVideo', JSON.stringify(result.LoanUtilization["MaxNumberOfVideo"]));
                    localStorage.setItem('VideoTimeLimit', JSON.stringify(result.LoanUtilization["VideoTimeLimit"]));
                    this.toaster.success(result.Message);
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    this._router.navigateByUrl(redirectURL);
                }
              else if (result.Success && result.isWebOTPEnabled) {

                    const dialogRef = this.dialog.open(OtpComponent, { data: { result }, disableClose: true, height: '40%', width: '20%' });
                    dialogRef.afterClosed().subscribe(res => {
                      if (res.data.data.Token && res.data.data.RefreshToken) {
                        localStorage.setItem('MaxNumberOfImages', JSON.stringify(result.LoanUtilization["MaxNumberOfImages"]));
                        localStorage.setItem('MaxNumberOfVideo', JSON.stringify(result.LoanUtilization["MaxNumberOfVideo"]));
                        localStorage.setItem('VideoTimeLimit', JSON.stringify(result.LoanUtilization["VideoTimeLimit"]));
                        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                        this._router.navigateByUrl(redirectURL);
                      }
                    });
                }
                else {
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
    }
}
