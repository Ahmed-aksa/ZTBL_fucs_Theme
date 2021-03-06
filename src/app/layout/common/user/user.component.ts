import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {Router} from '@angular/router';
import {BooleanInput} from '@angular/cdk/coercion';
import {Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {User} from 'app/core/user/user.types';
import {UserService} from 'app/core/user/user.service';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ChangePasswordComponent} from "../change-password/change-password.component";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {AuthService} from "../../../core/auth/auth.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {EncryptDecryptService} from "../../../shared/services/encrypt_decrypt.service";

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user'
})
export class UserComponent implements OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private matDialogRef: MatDialog,
        private authService: AuthService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private enc: EncryptDecryptService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.user = JSON.parse(this.enc.decryptStorageData(localStorage.getItem('ZTBLUser'))).User;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void {
        // Return if user is not available
        if (!this.user) {
            return;
        }

        // Update the user
        this._userService.update({
            ...this.user,
            status
        }).subscribe();
    }

    /**
     * Sign out
     */
    signOut(): void {
        this.spinner.show();
        this.authService.signOut().pipe(
            finalize(() => {
                this.spinner.hide();
            })
        )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse?.Success === true) {
                    // Redirect after the countdown
                    this._router.navigate(['/sign-out']);

                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message)
                }
            })
    }

    changePassword() {
        let dialogRef = this.matDialogRef.open(ChangePasswordComponent, {
            panelClass: ['w-4/12', 'max-w-full', 'max-h-full']
        });
        dialogRef.afterClosed().subscribe((res) => {

            if (res == 'true') {
                this._router.navigate(['/sign-out']);
            } else {
                return
            }
        })
    }

}
