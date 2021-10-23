import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';
import {map} from "rxjs/operators";
import {HttpUtilsService} from "../../../shared/services/http_utils.service";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {BaseRequestModel} from "../../../shared/models/base_request.model";

@Injectable({
    providedIn: 'root'
})
export class GeoFencingService {

    public request = new BaseRequestModel();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
        console.log(this.userUtilsService.getUserDetails())
    }

    SearchGeoFensePoint(resquest: any): Observable<BaseResponseModel> {
        return this.http.post(`${environment.apiUrl}/GeoFencingPoint/SearchGeoFensePoint`, resquest,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    CirclePoligonGetByIds(resquest: any): Observable<BaseResponseModel> {
        return this.http.post(`${environment.apiUrl}/Circle/CirclePoligonGetByIds`, resquest,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

}
