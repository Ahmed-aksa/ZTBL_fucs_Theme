import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {Activity} from "../../../shared/models/activity.model";
import {Circle} from "../../../shared/models/circle.model";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {HttpUtilsService} from "../../../shared/services/http_utils.service";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {TourPlan} from "../Model/tour-plan.model";
import {DEVICELOCATION} from "../../../shared/models/default.model";
import {Observable} from 'rxjs';
import {Moment} from "moment";
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class TourPlanService {

    public request = new BaseRequestModel();
    public activity = new Activity();
    public deviceLocation = new DEVICELOCATION;
    public circle = new Circle;

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    userInfo = this.userUtilsService.getUserDetails();

    createTourPlan(TourPlan) {

        this.request = new BaseRequestModel();
        this.request.DEVICELOCATION = this.deviceLocation;
        this.request.TranId = 2830;
        this.request.doPerformOTP = false;
        this.request.Zone = this.userInfo.Zone;
        this.request.Branch = this.userInfo.Branch;
        this.request.Circle = this.circle;
        this.request.User = this.userInfo.User;
        this.request.TourPlan = TourPlan;

        var v = JSON.stringify(this.request)


        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/CreateUpdateTourPlan`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    ChanageTourStatus(tourPlan: TourPlan) {
        this.request = new BaseRequestModel();
        this.request.User = this.userInfo.User;
        var v = JSON.stringify(tourPlan)

        this.request.TourPlan = {
            "TourPlanStatus": {"Status": tourPlan.Status, "TourPlanIds": [tourPlan.TourPlanId]}
        };


        var v = JSON.stringify(this.request)


        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/ChanageTourPlanStatus`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    ChanageTourStatusMultiple(tourPlan: TourPlan) {
        this.request = new BaseRequestModel();
        this.request.User = this.userInfo.User;
        var v = JSON.stringify(tourPlan)

        this.request.TourPlan = {
            "TourPlanStatus": {"Status": tourPlan.Status, "TourPlanIds": tourPlan.TourPlanId}
        };
        var v = JSON.stringify(this.request)


        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/ChanageTourPlanStatus`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetTourPlanDetail(tourPlan) {
        var circle = this.userInfo.UserCircleMappings;

        var request = {

            TourPlanAndDiaryDto: {
                TourPlan: {tourPlan}
            },
            TranId: 0,
            Branch: this.userInfo.Branch,
            User: this.userInfo.User,
            Zone: this.userInfo.Zone
        };

        var v = JSON.stringify(this.request)


        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/GetTourPlanDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetTourPlanForApprovel(tourPlan) {
        var circle = this.userInfo.UserCircleMappings;

        var request = {

            TourPlanAndDiaryDto: {
                TourPlan: {tourPlan}
            },
            TranId: 0,
            Branch: this.userInfo.Branch,
            User: this.userInfo.User,
            Zone: this.userInfo.Zone
        };

        var v = JSON.stringify(this.request)


        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/GetTourPlanForApprovel`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    SearchTourPlan(tourPlan, Limit, Offset, branch, zone) {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();

        this.request.User = userInfo.User;
        this.request.TourPlan = tourPlan;
        this.request.TourPlan.Limit = Limit;
        this.request.TourPlan.Offset = Offset;
        this.request.Zone = zone;
        this.request.Branch = branch;
      var date ={
        "User": this.request.User,
        "TourPlan":  tourPlan 
            
      }
       // var req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/SearchTourPlan`, date,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    TourPlanForApproval(tourPlan, Limit, Offset) {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();

        this.request.User = userInfo.User;
        this.request.TourPlan = tourPlan;
        this.request.TourPlan.Limit = Limit;
        this.request.TourPlan.Offset = Offset;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;

        var req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/GetTourPlanForApproval`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getTargetsHeirarchy() {
        let request = new BaseRequestModel();
        request.User = this.userInfo.User;
        return this.http.post(`${environment.apiUrl}/Target/GetTargetHierarchy`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    updateTargetsHierarchy(single_target: any) {
        let request = new BaseRequestModel();
        request.User = this.userInfo.User;
        request.Target = single_target;
        return this.http.post(`${environment.apiUrl}/Target/UpdateTargetHierarchy`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getTargetsTracks(id: number, next_number: number, duration) {
        debugger;
        let request = new BaseRequestModel();
        request.Target = {
            Id: String(id),
            NextNumber: String(next_number),
            Duration: duration,
        }
        request.User = this.userInfo.User;
        return this.http.post(`${environment.apiUrl}/Target/GetTargetTracking`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetHolidays(StartDate, EndDate): Observable<any> {
        var resData = {
            "TourPlan": {
                "StartDate": StartDate,
                "EndDate": EndDate
            }
        }
        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/GetHolidays`, resData,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: any) => res)
        );
    }

    searchForTourPlanApproval(
        approval_from: any,
        itemsPerPage: number, offset: string, branch: any, zone: any, circle: any, user_id) {
        let start_date: Moment = moment(approval_from.FromDate);
        let end_date: Moment = moment(approval_from.ToDate);
        let request = {
            TourPlan: {
                UserId: user_id,
                CircleId: circle?.CircleId,
                BranchCode: branch?.BranchCode,
                ZoneId: zone?.ZoneId,
                StartDate: start_date.format('YYYY-MM-DD'),
                EndDate: end_date.format('YYYY-MM-DD'),
                Status: 'S',
                Limit: String(itemsPerPage),
                Offset: offset,
                PPNO: approval_from.PPNO,
            },
            Zone: zone,
            Branch: branch,
            Circle: circle,
            User: this.userInfo.User,
        }

        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/GetTourPlanForApproval`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: any) => res)
        );
    }
}
