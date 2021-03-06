import {Injectable, Injector} from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, map, switchMap, take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LayoutUtilsService} from '../services/layout_utils.service';
import {AuthService} from 'app/core/auth/auth.service';
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "../services/common.service";
import {EncryptDecryptService} from "../services/encrypt_decrypt.service";
import {environment} from "../../../environments/environment";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private layoutUtilsService: LayoutUtilsService,
                private _authService: AuthService,
                private injector: Injector, private router: Router,
                private http: HttpClient,
                private spinner: NgxSpinnerService,
                private _common: CommonService,
                private encryptDecryptService: EncryptDecryptService
    ) {
    }

    private isRefreshing = false;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
        let authReq = req;
        const token: string = this.encryptDecryptService.decryptStorageData(localStorage.getItem('accessToken'));
        if (environment.IsEncription)
            if (token != null && !authReq.url.includes('Account/Login') && !authReq.url.includes('Account/HealthCheck')) {
                authReq = this.addTokenHeader(req, token, this._common.newGuid());
            }
        return next.handle(authReq).pipe(map((res: HttpResponse<any>) => {
            return res;

        }), catchError(error => {
            if (error.status === 403) {
                this.layoutUtilsService.AlertElementCapture(error.error.Message);
                return throwError(error);
            }
            if (error instanceof HttpErrorResponse) {
                return this.handle401Error(authReq, next);
            }
            if (error instanceof HttpErrorResponse && !authReq.url.includes('sign-out') && error.status === 401) {
                return this.handle401Error(authReq, next);
            }
            return throwError(error);
        }));
    }


    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

        this.router.navigateByUrl('sign-out');
        localStorage.clear();
        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next.handle(this.addTokenHeader(request, token, this._common.newGuid())))
        );
    }

    private addTokenHeader(request: HttpRequest<any>, token: string, IMEI: string) {
        return request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
                "key": this.encryptDecryptService.RSAencrypt(this.encryptDecryptService.getUDID())
            }
        });
    }


}
