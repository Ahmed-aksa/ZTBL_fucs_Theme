import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {finalize, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from 'app/core/auth/auth.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'kt-otp',
    templateUrl: './otp.component.html',
    encapsulation: ViewEncapsulation.None
})
export class OtpComponent implements OnInit {

    // Public params
    otpForm: FormGroup;
    loading = false;
    errors: any = [];

    private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    /**
     * Component constructor
     *
     * @param authService
     * @param authNoticeService
     * @param translate
     * @param router
     * @param fb
     * @param cdr
     */
    constructor(
        private authService: AuthService,
        private toaster: ToastrService,
        private fb: FormBuilder,
        private auth: AuthService,
        public dialogRef: MatDialogRef<OtpComponent>,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.unsubscribe = new Subject();
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit() {
        this.initRegistrationForm();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.loading = false;
    }

    /**
     * Form initalization
     * Default params, validators
     */
    initRegistrationForm() {
        this.otpForm = this.fb.group({
            otp: [this.data?.result?.OTP?.Text, Validators.compose([
                Validators.required,
                //Validators.email,
                Validators.minLength(3),
                Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
            ])
            ]
        });
    }

    /**
     * Form Submit
     */
    submit() {
        this.loading = true;
        this.spinner.show()

        this.auth.SendOTPResuest(this.otpForm.controls['otp'].value).pipe(finalize(() => {
            this.loading = true, this.spinner.hide()
        })).subscribe(result => {
            if (result.Success) {
                this.onCloseClick(result);
            } else {
                this.toaster.error(result.Message);
                localStorage.clear();
            }
        });


        //const email = controls.otp.value;
        //this.router.navigateByUrl('/dashboard');
        this.otpForm.controls['otp'].value;


    }

    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
    isControlHasError(controlName: string, validationType: string): boolean {
        const control = this.otpForm.controls[controlName];

        if (!control) {
            return false;
        }

        const result =
            control.hasError(validationType) &&
            (control.dirty || control.touched);
        return result;
    }

    onCloseClick(data: any): void {
        this.dialogRef.close({data: {data}}); // Keep only this row
    }

}
