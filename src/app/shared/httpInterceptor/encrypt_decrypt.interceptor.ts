import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "environments/environment";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {EncryptDecryptService} from "../services/encrypt_decrypt.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {UserUtilsService} from "../services/users_utils.service";

@Injectable()
export class EncryptDecryptInterceptor implements HttpInterceptor {
    filter_status = false;

    constructor(private encryptDecryptService: EncryptDecryptService, private spinner: NgxSpinnerService, private router: Router, private toastr: ToastrService, private userUtils: UserUtilsService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = request;

        if (environment.IsEncription) {
            if (!authReq.url.includes('Account/HealthCheck')) {
                if (request.body && request.body.toString() === "[object FormData]") {
                } else {
                    debugger;
                    if (request.body?.hasOwnProperty('LovPagination')) {
                        this.filter_status = true;
                    }
                    var DeviceInfo = {
                        "IMEI": this.encryptDecryptService.getUDID()
                    }
                    if (request.body) {
                        if (!request.body?.hasOwnProperty('Zone')) {
                            request.body.Zone = this.userUtils.getSearchResultsDataOfZonesBranchCircle()?.Zone;
                        }
                    }

                    request = request.clone({
                        body: {...request.body, DeviceInfo}
                    })
                    var cusomeRequestModel = {
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
                                let response = event.clone({body: JSON.parse(this.encryptDecryptService.AESdecrypt(null, event.body.Resp))})
                                // For sorting statuses of tour diary
                                if (this.filter_status) {
                                    response.body.LOVs = response.body?.LOVs?.sort((a, b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0))
                                    this.filter_status = false;
                                }
                                event = response;
                            }

                        }
                    }
                    if (event instanceof HttpErrorResponse && event.status == 401) {
                        this.spinner.hide();
                        this.toastr.error("Please log in again");

                        this.router.navigateByUrl('sign-out');
                        localStorage.clear();
                    }
                }
                return event;
            }));
    }
}
