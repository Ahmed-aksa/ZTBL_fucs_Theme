import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {HttpUtilsService} from "../../../shared/services/http_utils.service";
import {Configuration} from "../models/configuration.model";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {UserUtilsService} from "../../../shared/services/users_utils.service";

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {
    public request = new BaseRequestModel();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private utilService: UserUtilsService) {
    }


    AddConfiguration(configuration: Configuration): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.Configuration = configuration;

        return this.http.post(`${environment.apiUrl}/Configuration/AddConfiguration`, this.request).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    UpdateConfiguration(configuration: Configuration): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.Configuration = configuration;
        return this.http.post(`${environment.apiUrl}/Configuration/UpdateConfiguration`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    DeleteConfiguration(configuration: Configuration): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.Configuration = configuration;
        var req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/Configuration/DeleteConfiguration`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetConfigurations(): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.Configuration = {
            'Status': '1'
        };

        this.request.User = this.utilService.getUserDetails().User;

        return this.http.post(`${environment.apiUrl}/Configuration/GetConfigurations`, this.request).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getParents() {
        this.request = new BaseRequestModel();
        this.request.User = this.utilService.getUserDetails().User;
        return this.http.post(`${environment.apiUrl}/Configuration/GetParents`, this.request);
    }
}
