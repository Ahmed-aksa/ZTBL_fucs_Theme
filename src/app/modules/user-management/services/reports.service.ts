import {Injectable} from '@angular/core';
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {environment} from "../../../../environments/environment";
import {map} from "rxjs/operators";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "../../../shared/services/http_utils.service";

@Injectable({
    providedIn: 'root'
})
export class ReportsService {

    constructor(private userUtilsService: UserUtilsService, private http: HttpClient, private httpUtils: HttpUtilsService) {
    }

    getBiometricRegistrationRequest(limit, offset, ppno) {
        let request = new BaseRequestModel();
        if (ppno)
            request.UserInfo = {
                UserName: Number(ppno),
            };
        request.Pagination = {
            "Limit": limit,
            "Offset": offset
        }
        return this.http.post(`${environment.apiUrl}/Account/GetBiometricRegisterationRequest`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    changeBiometricReportsStatus(status: string, ppno) {
        let request = new BaseRequestModel();
        request.Notification = {"Status": status}
        request.UserInfo = {
            "UserName": ppno
        }
        return this.http.post(`${environment.apiUrl}/Account/UpdateBiometricRegisteration`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }
}
