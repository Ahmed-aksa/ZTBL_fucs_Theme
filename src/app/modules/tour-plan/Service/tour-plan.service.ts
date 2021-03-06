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
import moment, {Moment} from "moment";

@Injectable({
    providedIn: 'root'
})
export class TourPlanService {

    public request = new BaseRequestModel();
    public activity = new Activity();
    public deviceLocation = new DEVICELOCATION;
    public circle = new Circle;
    userInfo = this.userUtilsService.getUserDetails();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    getProfileId(role) {

        if (role == 'ZC') {
            return environment.ZC;
        } else if (role == 'MCO') {
            return environment.MCO_Group_ID;
        } else if (role == 'ZM') {
            return environment.ZM;
        } else if (role == 'BM') {
            return environment.BM;
        } else if (role == 'PC') {
            return environment.PROVINCIAL_CHEIF;
        } else if (role == 'RC') {
            return environment.Regional_CHIEF;
        } else if (role == 'RO') {
            return environment.RECOVERY_OFFICER;
        } else {
            return this.userInfo.User.ProfileId;
        }
    }

    createTourPlan(TourPlan, zone = null, branch = null, circle = null, startDate = null, endDate = null, role) {
        this.request = new BaseRequestModel();
        this.request.DEVICELOCATION = this.deviceLocation;
        this.request.TranId = 2830;
        this.request.doPerformOTP = false;
        this.request.User = this.userInfo.User;
        this.request.User["ProfileId"] = this.getProfileId(role)
        this.request.TourPlan = TourPlan;
        this.request.TourPlan.StartDate = startDate;
        this.request.TourPlan.EndDate = endDate;


        if (zone) {
            this.request.Zone = zone;
        } else {
            this.request.Zone = {
                ZoneId: TourPlan.ZoneId
            }
        }
        if (branch)
            this.request.Branch = branch;
        if (circle)
            this.request.Circle = circle;

        var v = JSON.stringify(this.request)
        console.log(v)
        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/CreateUpdateTourPlan`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    ChanageTourStatus(tourPlan: TourPlan, role = null) {
        this.request = new BaseRequestModel();
        this.request.User = this.userInfo.User;
        this.request.User["ProfileId"] = this.getProfileId(role)
        this.request.TourPlan = {
            "TourPlanStatus": {"Status": tourPlan.Status, "TourPlanIds": [tourPlan.TourPlanId]}
        };
        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/ChanageTourPlanStatus`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    ChanageTourStatusMultiple(tourPlan: TourPlan, role = null) {

        var value, tourPlanAray = [], tourPlanIds;
        value = tourPlan

        value.forEach((element) => {
            tourPlanAray.push(element.TourPlanId)
        })

        tourPlanIds = tourPlanAray;

        this.request = new BaseRequestModel();
        this.request.User = this.userInfo.User;
        this.request.User["ProfileId"] = this.getProfileId(role)
        var v = JSON.stringify(tourPlan)

        this.request.TourPlan = {
            "TourPlanStatus": {"Status": tourPlan.Status, "TourPlanIds": tourPlanIds}
        };
        // this.request.TourPlan = {
        //     "TourPlanStatus": {"Status": tourPlan.Status, "TourPlanIds": tourPlan.TourPlanId}
        // };
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
        //   var date ={
        //     "User": this.request.User,
        //     "TourPlan":  tourPlan

        //   }
        var req = JSON.stringify(this.request);

        console.log(req);
        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/SearchTourPlan`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetScheduleBaseTourPlan(tourPlan, Limit, Offset, branch, zone, role = null) {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();

        this.request.User = userInfo.User;
        this.request.User["ProfileId"] = this.getProfileId(role)
        this.request.TourPlan = tourPlan;
        this.request.TourPlan.Limit = Limit;
        this.request.TourPlan.Offset = Offset;
        this.request.Zone = zone;
        this.request.Branch = branch;
        tourPlan.Status = "";
        var date = {
            "User": this.request.User,
            "TourPlan": tourPlan,
            "Zone": this.request.Zone,
            "Branch": this.request.Branch

        }

        //this.request.Date = {}
        var req = JSON.stringify(date);
        console.log(req)

        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/GetScheduleBaseTourPlan`, date,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
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

    GetHolidays(StartDate, EndDate, zone): Observable<any> {
        var resData = {
            "TourPlan": {
                "StartDate": StartDate,
                "EndDate": EndDate
            },
            "User": this.userInfo.User,
            "Zone": zone,
        }

        console.log(JSON.stringify(resData))
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
                Status: approval_from.Status,
                Limit: String(itemsPerPage),
                Offset: offset,
                PPNo: approval_from.PPNo,
            },
            Zone: zone,
            Branch: branch,
            Circle: circle,
            User: this.userInfo.User,
        }
        if (request.TourPlan.StartDate == "Invalid date") {
            request.TourPlan.StartDate = null;
        }
        if (request.TourPlan.EndDate == "Invalid date") {
            request.TourPlan.EndDate = null;
        }

        console.log(request);

        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/GetTourPlanForApproval`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: any) => res)
        );
    }

    viewTourPlan(
        approval_from: any,
        itemsPerPage: number, offset: string, branch: any, zone: any, circle: any, user_id, PPNO) {

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
                Status: approval_from.Status,
                Limit: String(itemsPerPage),
                Offset: offset,
                // PPNO:PPNO,
                PPNo: approval_from.PPNO,
            },

            Zone: zone,
            Branch: branch,
            Circle: circle,
            User: this.userInfo.User,
        }
        if (request.TourPlan.StartDate == "Invalid date") {
            request.TourPlan.StartDate = null;
        }
        if (request.TourPlan.EndDate == "Invalid date") {
            request.TourPlan.EndDate = null;
        }

        if (request?.TourPlan?.PPNo == "") {
            request.TourPlan.PPNo = null;
        }

        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/ViewTourPlans`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: any) => res)
        );
    }
}
