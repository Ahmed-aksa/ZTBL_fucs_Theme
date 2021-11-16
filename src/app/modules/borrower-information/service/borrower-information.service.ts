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

    getBorrowerInformation(limit, offset, cnic, user,PPNo,SelectedZones, SelectedBranches ,SelectedCircles) {

        var userInfo = this.userDetail;
        var circle = userInfo.UserCircleMappings;
        // var circleIds = [];

        // if(user.CircleId == 'null'){
        //     user.CircleId = null
        //   }
        // if(circle){
        //     circle?.forEach(element => {
        //         circleIds.push(element.CircleId);
        //     });
        //     var _circles = JSON.stringify(circleIds)
        // }
        // else{
        //     _circles = JSON.stringify(circles);
        // }

        // var circleIds = [];
        // console.log("len"+SelectedCircles.length)
        // if(SelectedCircles.length>0){
        //     SelectedCircles?.forEach(element => {
        //         if(element.Id>0){
        //             circleIds.push(element.Id);
        //         }
        //     });
        // }else{
        //     circleIds = SelectedCircles;
        // }


        //_circles = _circles.replace("\", "")
        this.circle.CircleIds= JSON.stringify(SelectedCircles);
        console.log("vallueee"+user?.CircleId)
           if(user?.CircleId!='null'){
               console.log("called service")
               this.circle.CircleCode= user?.CircleId
           }



        var request = {
            Circle: this.circle,
            BorrowerInfo: {
                Limit: limit,
                Offset: offset,
                Cnic: cnic,
                PPNo: PPNo
            },
            TranId: 0,
            Branch: SelectedBranches,
            User: userInfo.User,
            Zone: {"ZoneId":SelectedZones.ZoneId}
        };
        return this.http.post(`${environment.apiUrl}/Customer/Gettotalnumberofborrowersdetails`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


}

export class Circle{
    CircleIds?:string="";
    CircleCode?:string="";
}
