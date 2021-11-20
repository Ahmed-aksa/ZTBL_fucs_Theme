/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable new-parens */
/* eslint-disable @typescript-eslint/member-ordering */
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

    circle = new Circle;
    userDetail = this.userUtilsService.getUserDetails();

    getBorrowerInformation(limit, offset, cnic, user, PPNo, SelectedZones, SelectedBranches, SelectedCircles) {
        debugger
        var userInfo = this.userDetail;
        var circle = SelectedCircles;
        var circleIds = [];

        if (user.CircleId == undefined) {
            user.CircleId = null
        }
        if (circle) {
            circle.forEach(element => {
                circleIds.push(element.Id);
            });
            var _circles = JSON.stringify(circleIds)
        } else {
            _circles = JSON.stringify(SelectedCircles);
        }
        // this.circle.CircleIds = circle_ids;
        // if(SelectedCircles?.Id)
        // this.circle.CircleCode = SelectedCircles?.Id;
        // else
        // this.circle.CircleCode = null;

        var request = {
            Circle: {
                CircleCode: user.CircleId,
                CircleIds: _circles
            },
            BorrowerInfo: {
                Limit: limit,
                Offset: offset,
                Cnic: cnic,
                PPNo: PPNo
            },
            TranId: 0,
            Branch: SelectedBranches,
            User: userInfo.User,
            Zone: {"ZoneId": SelectedZones.ZoneId}
        };
        return this.http.post(`${environment.apiUrl}/Customer/Gettotalnumberofborrowersdetails`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


}

export class Circle {
    CircleIds?: string = "";
    CircleCode?: string = "";
}
