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
    loggedInUserInfo;

    circleIds = [];
    circleString;

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {

        this.loggedInUserInfo = this.userUtilsService.getUserDetails();

    }

    getCircleId(){
        var circle;
        circle = this.loggedInUserInfo.UserCircleMappings;
        circle.forEach(element =>{
            this.circleIds.push(element.Id)
        })
        this.circleString= this.circleIds.toString();
    }


    notificationStatus() {
        this.getCircleId()
        var request = {
            User: this.loggedInUserInfo.User,
            Zone: this.loggedInUserInfo.Zone,
            Branch: this.loggedInUserInfo.Branch,
            Circle: {
                CircleIds: this.circleString
            }
        }
        return this.http.post<any>(`${environment.apiUrl}/Notification/GetNotificationCount`, request)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    notificationCards(type) {
        this.getCircleId()
        var request = {
            User: this.loggedInUserInfo.User,
            Zone: this.loggedInUserInfo.Zone,
            Branch: this.loggedInUserInfo.Branch,
            Circle: {
                CircleIds: this.circleString
            }
        }
        if (type == 1){}
        else if(type == 2){
            return this.http.post<any>(`${environment.apiUrl}/Notification/GetLoaneesInstallments`, request)
                .pipe(
                    map((res: BaseResponseModel) => res)
                );
        }else if(type == 5){
            return this.http.post<any>(`${environment.apiUrl}/Notification/LoaneeMightBecomeDafaulter`, request)
                .pipe(
                    map((res: BaseResponseModel) => res)
                );
        }
        else if(type ==7){
            return this.http.post<any>(`${environment.apiUrl}/Notification/GetCnicExpiryOfLoanee`, request)
                .pipe(
                    map((res: BaseResponseModel) => res)
                );
        }
    }

}
