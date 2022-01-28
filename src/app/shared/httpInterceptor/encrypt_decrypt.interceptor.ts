import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EncryptDecryptService } from "../services/encrypt_decrypt.service";

@Injectable()
export class EncryptDecryptInterceptor implements HttpInterceptor {
    constructor(private encryptDecryptService: EncryptDecryptService) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = request;
        // if (!authReq.url.includes('Account/HealthCheck')) {
        //     if (request.body && request.body.toString() === "[object FormData]") {
        //     } else {
        //         var DeviceInfo = {
        //             "IMEI": this.encryptDecryptService.getUDID()
        //         }
        //         request = request.clone({
        //             body: { ...request.body, DeviceInfo}
        //         })
        //         var cusomeRequestModel = {
        //             "Key": this.encryptDecryptService.RSAencrypt(this.encryptDecryptService.getUDID()),
        //             "Req": this.encryptDecryptService.AESencrypt(null, request.body)

        //         }
        //         request = request.clone({
        //             body: cusomeRequestModel
        //         });
        //     }
        // }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (!authReq.url.includes('Account/HealthCheck')) {
                    if (event instanceof HttpResponse) {
                        if (event.url.includes(environment.apiUrl)) {
                            //event = event.clone({ body: JSON.parse(this.encryptDecryptService.AESdecrypt(null, event.body.Resp)) })
                        }
                    }
                }
                return event;
            }));
    }
}
