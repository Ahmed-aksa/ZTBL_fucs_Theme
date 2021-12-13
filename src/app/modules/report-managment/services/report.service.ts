import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {ReportFilters} from "../models/report-filters.model";
import {HttpUtilsService} from "../../../shared/services/http_utils.service";

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    public request = new BaseRequestModel();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {

    }


    getAllAPILogs(reportFilter: ReportFilters): Observable<BaseResponseModel> {
debugger

        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;

        return this.http.post(`${environment.apiUrl}/Report/GetAPILogs`, this.request,
        ).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getThirdPartyAPILogs(reportFilter: ReportFilters): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;

        return this.http.post(`${environment.apiUrl}/Report/GetTPAPILogs`, this.request,
        ).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getAPIRequestResponse(reportFilter: ReportFilters): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;

        return this.http.post(`${environment.apiUrl}/Report/GetAPIRequestResponse`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getThirdPartyRequestResponse(reportFilter: ReportFilters): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;

        return this.http.post(`${environment.apiUrl}/Report/GetTPAPIRequestResponse`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getAllErrorLogs(reportFilter: ReportFilters): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;
        return this.http.post(`${environment.apiUrl}/Report/GetErrorLogs`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetMcoRecoveryCounts(reportFilter: ReportFilters): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;
        var req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Report/GetMcoRecoveryCounts`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getAllUsersNotifications(reportFilter: ReportFilters): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;

        return this.http.post(`${environment.apiUrl}/Report/GetUsersNotifications`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getUserHistory(reportFilter: ReportFilters): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;
        return this.http.post(`${environment.apiUrl}/Report/GetUserHistory`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getErrorLogDetails(reportFilter: ReportFilters): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;
        return this.http.post(`${environment.apiUrl}/Report/GetErrorLogDetails`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getDashboardNotification(): Observable<BaseResponseModel> {

        return this.http.post(`${environment.apiUrl}/Report/GetTopNotificationWithUnreadCount`,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getEcibQeue() {

        this.request = new BaseRequestModel();
        var hello = this.http.post(`${environment.apiUrl}/Report/GetEcibQeueAll`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

        return hello;
    }

    getThirdPartyApiDetails(reportFilter: ReportFilters): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;

        return this.http.post(`${environment.apiUrl}/Report/GetTPAPIRequestResponse`, this.request,
        ).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

}




