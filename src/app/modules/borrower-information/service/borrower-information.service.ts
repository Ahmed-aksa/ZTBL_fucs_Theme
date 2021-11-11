import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpUtilsService} from "../../../shared/services/http_utils.service";
import {Activity} from "../../../shared/models/activity.model";
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {UserUtilsService} from "../../../shared/services/users_utils.service";

@Injectable({
    providedIn: 'root'
})
export class BorrowerInformationService {

    public request = new BaseRequestModel();
    public activity = new Activity();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    userDetail = this.userUtilsService.getUserDetails();

    getBorrowerInformation(limit, offset, cnic, user) {
        
        var userInfo = this.userDetail;
        var circle = userInfo.UserCircleMappings;
        var circleIds = [];
        
        if(user.CircleId == 'null'){
            user.CircleId = null
          }
        circle?.forEach(element => {
            circleIds.push(element.CircleId);
        });
        var _circles = JSON.stringify(circleIds)
        //_circles = _circles.replace("\", "")

        var request = {
            Circle: {
                CircleIds: _circles,
                CircleCode: user.CircleId
            },
            BorrowerInfo: {
                Limit: limit,
                Offset: offset,
                Cnic: cnic
            },
            TranId: 0,
            Branch: user.Branch[0] ? user.Branch[0] : user.Branch,
            User: userInfo.User,
            Zone: {
                ZoneId: user.ZoneId
            }
        };
        return this.http.post(`${environment.apiUrl}/Customer/Gettotalnumberofborrowersdetails`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


}
