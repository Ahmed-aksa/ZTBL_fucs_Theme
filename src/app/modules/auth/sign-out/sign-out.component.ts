import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, timer} from 'rxjs';
import {finalize, takeUntil, takeWhile, tap} from 'rxjs/operators';
import {AuthService} from 'app/core/auth/auth.service';
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";

@Component({
    selector: 'auth-sign-out',
    templateUrl: './sign-out.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AuthSignOutComponent implements OnInit, OnDestroy {
    countdown: number = 1;
    countdownMapping: any = {
        '=1': '# second',
        'other': '# seconds'
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private layoutUtilsService: LayoutUtilsService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        timer(1000, 1000)
            .pipe(
                finalize(() => {
                    location.reload();
                    localStorage.clear()
                    //this._router.navigate(['auth/sign-in']);

                }),
                takeWhile(() => this.countdown > 0),
                takeUntil(this._unsubscribeAll),
                tap(() => this.countdown--)
            )
            .subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    logout() {
        location.reload();
    }
}
