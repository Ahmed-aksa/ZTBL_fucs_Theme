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

    changeBiometricReportsStatus(status: string, ppno, id) {
        let request = new BaseRequestModel();
        request.BiometricRequest = {
            "PPNo": ppno,
            "Id": id,
            "Status": status
        }
        return this.http.post(`${environment.apiUrl}/Account/UpdateBiometricRegisteration`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    submitBusinessLead(value: any, branch_id) {

        let request = new BaseRequestModel();
        request.CustomerLead = value;
        request.CustomerLead.BranchId = branch_id.toString();
        request.CustomerLead.ZoneId = request.CustomerLead?.ZoneId.toString();
        request.User = this.userUtilsService.getUserDetails().User;
        return this.http.post(`${environment.apiUrl}/Customer/AddCustomerLead`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }
}
