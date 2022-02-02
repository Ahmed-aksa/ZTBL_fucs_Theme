import {EventEmitter, Injectable, Injector, Output} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpClient, HttpResponse
} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, filter, map, switchMap, take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LayoutUtilsService} from '../services/layout_utils.service';
import {AuthService} from 'app/core/auth/auth.service';
import {NgxSpinnerService} from "ngx-spinner";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private layoutUtilsService: LayoutUtilsService,
                private _authService: AuthService,
                private injector: Injector, private router: Router,
                private http: HttpClient,
                private spinner: NgxSpinnerService,
    ) {
    }

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
        let authReq = req;
        const token: string = localStorage.getItem('accessToken');
        if (token != null && !authReq.url.includes('Account/Login') && !authReq.url.includes('Account/HealthCheck')) {
            authReq = this.addTokenHeader(req, token);
        }

        // let key = environment.AesKey;
        // console.log(AES.encrypt(JSON.stringify(req.body), key).toString());
        //
        return next.handle(authReq)
            .pipe(catchError(error => {
                if (error.status === 403) {
                    this.layoutUtilsService.AlertElementCapture(error.error.Message);
                    return throwError(error);
                }
                if (error instanceof HttpErrorResponse && !authReq.url.includes('sign-out') && error.status === 401) {

                    return this.handle401Error(authReq, next);
                }

                return throwError(error);
            }));
    }


    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        debugger;
        this.spinner.hide();
        this.router.navigateByUrl('sign-out');
        localStorage.clear();
        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next.handle(this.addTokenHeader(request, token)))
        );
    }

    private addTokenHeader(request: HttpRequest<any>, token: string) {
        return request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }


}
