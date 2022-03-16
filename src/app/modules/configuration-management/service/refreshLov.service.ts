import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
export class RefreshLovService {
    public request = new BaseRequestModel();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private utilService: UserUtilsService) {
    }
    refreshLov(): Observable<BaseResponseModel> {
        return this.http.get(`${environment.apiUrl}/lov/RefreshLovs`).pipe(
            map((res: BaseResponseModel) => res)
        );
    }
}
