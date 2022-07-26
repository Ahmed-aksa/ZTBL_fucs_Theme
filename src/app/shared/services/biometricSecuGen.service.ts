import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BaseRequestModel} from '../models/base_request.model';
import {HttpUtilsService} from './http_utils.service';
import {UserUtilsService} from './users_utils.service';
import {BaseResponseModel} from '../models/base_response.model';
import {environment} from 'environments/environment';
import {CreateCustomer} from "../models/customer.model";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class BiometricSecuGenService {
    public request = new BaseRequestModel();

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService,
        private userUtilsService: UserUtilsService
    ) {
    }

    CaptureFinger(fingerIndex) {
        //temple 1 = ANSI
        //temple 2 = ISO
        return this.http.get<any>(`https://localhost:9999/ASW/captureFinger?template=2&finger=${fingerIndex}`)
    }

    InitializeFinger() {

        return this.http.get<any>('https://localhost:9999/ASW/initialize')
    }

    VerifyCustomerNADRA(customer: CreateCustomer=null): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.NadraRequestResponse = customer;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        return this.http
            .post(
                `${environment.apiUrl}/Customer/VerifyCustomerNADRA`,
                this.request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }


}
