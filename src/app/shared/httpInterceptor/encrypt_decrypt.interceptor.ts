import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "environments/environment";
import {Observable} from "rxjs";
import {filter, map, switchMap, take} from "rxjs/operators";
import {EncryptDecryptService} from "../services/encrypt_decrypt.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {TokenInterceptor} from "./httpconfig.interceptor";
import {UserUtilsService} from "../services/users_utils.service";

@Injectable()
export class EncryptDecryptInterceptor implements HttpInterceptor {
    constructor(private encryptDecryptService: EncryptDecryptService, private spinner: NgxSpinnerService, private router: Router, private toastr: ToastrService, private userUtils: UserUtilsService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = request;

        if (environment.IsEncription) {
            if (!authReq.url.includes('Account/HealthCheck')) {
                if (request.body && request.body.toString() === "[object FormData]") {
                } else {
                    var DeviceInfo = {
                        "IMEI": this.encryptDecryptService.getUDID()
                    }
                    if (request.body) {
                        if (!request.body?.hasOwnProperty('Zone')) {
                            request.body.Zone = this.userUtils.getSearchResultsDataOfZonesBranchCircle()?.Zone;
                        }
                        if (!request.body?.hasOwnProperty('Branch')) {
                            request.body.Branch = this.userUtils.getSearchResultsDataOfZonesBranchCircle()?.Branch;
                        }
                        if (!request.body?.hasOwnProperty('Circle')) {
                            let circles = this.userUtils.getSearchResultsDataOfZonesBranchCircle()?.UserCircleMappings;
                            if (Array.isArray(circles))
                                request.body.Circle = circles[0];
                            else
                                request.body.Circle = circles;
                        }
                    }
                    
                    request = request.clone({
                        body: {...request.body, DeviceInfo}
                    })
                    var cusomeRequestModel = {
                        // "Key": this.encryptDecryptService.RSAencrypt(this.encryptDecryptService.getUDID()),
                        "Req": this.encryptDecryptService.AESencrypt(null, request.body)

                    }
                    request = request.clone({
                        body: cusomeRequestModel,
                        setHeaders: {
                            "key": this.encryptDecryptService.RSAencrypt(this.encryptDecryptService.getUDID())
                        }
                    });
                }
            }
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (!authReq.url.includes('Account/HealthCheck')) {
                    if (event instanceof HttpResponse) {
                        if (event.url.includes(environment.apiUrl)) {
                            if (environment.IsEncription) {
                                event = event.clone({body: JSON.parse(this.encryptDecryptService.AESdecrypt(null, event.body.Resp))})
                            }

                        }
                    }
                    if (event instanceof HttpErrorResponse && event.status == 401) {
                        this.spinner.hide();
                        this.toastr.error("Please log in again");

                        this.router.navigateByUrl('sign-out');
                        localStorage.clear();
                        // return this.tokenInterceptor.refreshTokenSubject.pipe(
                        //     filter(token => token !== null),
                        //     take(1),
                        //     switchMap((token) => next.handle(this.addTokenHeader(request, token, this._common.newGuid())))
                        // );
                    }
                }
                return event;
            }));
    }
}
