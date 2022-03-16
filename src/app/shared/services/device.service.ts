import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';

import {CommonService} from './common.service';
import {DatePipe} from '@angular/common';
import {BaseRequestModel} from '../models/base_request.model';
import {Activity} from 'app/modules/user-management/activity/activity.model';
import {HttpUtilsService} from './http_utils.service';
import {UserUtilsService} from './users_utils.service';
import {environment} from 'environments/environment';
import {BaseResponseModel} from '../models/base_response.model';
import {map} from 'rxjs/operators';
import {Customer} from '../models/deceased_customer.model';

@Injectable({
    providedIn: 'root',
})
export class DeviceService {
    dod: Date;

    public request = new BaseRequestModel();
    public activity = new Activity();

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService,
        private userUtilsService: UserUtilsService,
        private datePipe: DatePipe,
        private _common: CommonService
    ) {
    }

    GetDeviceMappings(
        PPNO,
        Limit,
        Offset
    ): Observable<BaseResponseModel> {
debugger
        var request = new BaseRequestModel()
        request.UserInfo ={
            UserName:PPNO
        }
        request.Pagination={
            "Limit" :Number(Limit),
            "Offset":Number(Offset)
        }

        return this.http
            .post(
                `${environment.apiUrl}/Account/GetDeviceMappings`,
               request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    statusChange(value) {
var status;
        var request = new BaseRequestModel();
if(value.Status=='A'){
    status = value.Status
}
else{

}
        request.DeviceMapping ={
            Id:value.Id,
            Status:status,
        }

        return this.http
            .post<any>(
                `${environment.apiUrl}/Account/ChangeMappingStatus`,
                request
            )
            .pipe(map((res: BaseResponseModel) => res));
    }


}
