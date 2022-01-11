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
    selector: 'create-tour-plan-popup',
    templateUrl: './create-tour-plan-popup.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CreateTourPlanPopupComponent implements OnInit {

    TragetForm: FormGroup;
    loading = false;
    errors: any = [];

    private unsubscribe: Subject<any>; 
    
    constructor(
        private authService: AuthService,
        private toaster: ToastrService,
        private fb: FormBuilder,
        private auth: AuthService,
        public dialogRef: MatDialogRef<CreateTourPlanPopupComponent>,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public data: any=[],
    ) {
        this.unsubscribe = new Subject();
    }

  
    ngOnInit() {
        this.initRegistrationForm();
        console.warn(this.data)
    }

   
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.loading = false;
    }

    
    initRegistrationForm() {
        this.TragetForm = this.fb.group({
            Tragetdate: [null, Validators.required],
            traget: [null, Validators.required],
            propue: [null, Validators.required],
        });
    }

    submit() {
        debugger;
        var returnDate= this.data.daylist.filter(x=>x.isCheck==true);
        this.onCloseClick(returnDate);
        // this.auth.SendOTPResuest(this.otpForm.controls['otp'].value).pipe(finalize(() => {
        //     this.loading = true, this.spinner.hide()
        // })).subscribe(result => {
        //     if (result.Success) {
        //         this.onCloseClick(result);
        //     } else {
        //         this.toaster.error(result.Message);
        //         localStorage.clear();
        //     }
        // });

    }

    isControlHasError(controlName: string, validationType: string): boolean {
        const control = this.TragetForm.controls[controlName];

        if (!control) {
            return false;
        }

        const result =
            control.hasError(validationType) &&
            (control.dirty || control.touched);
        return result;
    }

    onCloseClick(data: any): void {
        debugger;
        this.dialogRef.close({data: {data}}); // Keep only this row
    }
    

}
