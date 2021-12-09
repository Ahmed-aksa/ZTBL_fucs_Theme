import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "../../../shared/services/http_utils.service";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {Activity} from "../../../shared/models/activity.model";
import {environment} from "../../../../environments/environment";
import {map} from "rxjs/operators";
import {BaseResponseModel} from "../../../shared/models/base_response.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
    public activity = new Activity();
    loggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();

    circles = this.loggedInUserInfo.UserCircleMappings;
    circleIds = [];
    circleString;

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
        this.circles.foreach(element =>{
            this.circleIds.push(element.CircleId)
        })
        this.circleString= this.circleIds.toString();
    }

    notificationStatus() {
        var request = {
            User: this.loggedInUserInfo.User,
            Zone: this.loggedInUserInfo.Zone,
            Branch: this.loggedInUserInfo.Branch,
            Circle: {
                CircleIds: this.circleString
            }
        }
        return this.http.post<any>(`${environment.apiUrl}/Notification/GetNotificationStatus`, request)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

}
