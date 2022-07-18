/* eslint-disable no- */
/* eslint-disable no-cond-assign */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Activity} from 'app/shared/models/activity.model';
import {BaseRequestModel} from 'app/shared/models/base_request.model';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {HttpUtilsService} from 'app/shared/services/http_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {environment} from 'environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MappingViolationService {

    public request = new BaseRequestModel();
    public activity = new Activity();
    userDetail = this.userUtilsService.getUserDetails();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    getMappingRequest(limit, offset) {
        var request = {
            Notification: {
                Limit: limit,
                Offset: offset
            },
        }
        return this.http.post<any>(`${environment.apiUrl}/Notification/GetMappingRequests`, request,)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    getMappingVoilation(limit, offset) {

        var request = {
            Notification: {
                Limit: limit,
                Offset: offset
            },
        }
        return this.http.post<any>(`${environment.apiUrl}/Notification/GetMappingVoilations`, request,)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    getNotificationStatus(maping) {
        var request = {
            Notification: {
                Id: maping.Id
            },
        }
        return this.http.post<any>(`${environment.apiUrl}/Notification/GetNotificationStatus`, request,)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    createMapping(maping) {

        var request = {
            Notification: {
                Id: maping.Id,
                TrackingId: maping.TrackingId
            },
        }
        return this.http.post<any>(`${environment.apiUrl}/Notification/CreateMappingFromNotification`, request,)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    blockUser(user) {

        var request = {
            Notification: {
                Id: user.Id
            },
            User: {
                UserInfo: this.userDetail.User.UserId
            }
        }
        return this.http.post<any>(`${environment.apiUrl}/Notification/BlockUserFromNotification`, request,)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }
}
