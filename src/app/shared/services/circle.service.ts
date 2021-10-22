import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseRequestModel } from "../models/base_request.model";
import { BaseResponseModel } from "../models/base_response.model";
import { environment } from 'environments/environment';
// import {UserUtilsService} from "./user_utils.service";
import { HttpUtilsService } from "./http_utils.service";
import { Branch } from "../models/branch.model";
import { Circle } from "../models/circle.model";
import { UserUtilsService } from "./users_utils.service";
import { Zone } from '../../modules/user-management/users/utils/zone.model';
@Injectable({
    providedIn: 'root'
})
export class CircleService {

    public request = new BaseRequestModel();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }


    getAllCircles(): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();
        return this.http.post(`${environment.apiUrl}/Circle/GetCircles`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    GetCircleByBranchId() {

        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        var circle = userInfo.UserCircleMappings;
        var circleIds = [];
        circle?.forEach(element => {
            circleIds.push(element.CircleId);
        });
        var _circles = JSON.stringify(circleIds)
        // this.request.LoanUtilization={"UtilizationDetail":{"LoanCaseNo":}}
        //this.request.TranId = 2830;
        this.request.DEVICELOCATION = {
            BTSID: "0",
            BTSLOC: "",
            LAT: "33.65898",
            LONG: "73.057665",
            SRC: "GPS"
        },

            this.request.Circle = {
                CircleIds: _circles
            },

            this.request.doPerformOTP = false;

        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;

        return this.http.post(`${environment.apiUrl}/LoanUtilization/GetCircleByBranchId`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    getCircleByBranchId(id, code) {

        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        //var circle = userInfo.UserCircleMappings;


        this.request.doPerformOTP = false;

        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = {
            BranchId: id,
            BranchCode: code,
        };
        return this.http.post(`${environment.apiUrl}/LoanUtilization/GetCircleByBranchId`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    getAllCirclesSinglePoints(branchId: string): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();
        if (branchId != null) {
            var branch = new Branch()
            branch.BranchCode = branchId
            this.request.Branch = branch
        }
        return this.http.post(`${environment.apiUrl}/Circle/GetCirclesPoints`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }


    getZones(): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();

        return this.http.post(`${environment.apiUrl}/Zone/GetZones`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }


    getBranchesByZone(zone: Zone): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();
        this.request.Zone = zone;

        return this.http.post(`${environment.apiUrl}/Branch/GetBranchByZone`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    getCircles(branch: Branch): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();
        this.request.Branch = branch;

        return this.http.post(`${environment.apiUrl}/Circle/GetCirclesByBranchCode`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }


    CirclePoligonAdd(request: BaseRequestModel): Observable<BaseResponseModel> {

        //this.request = new BaseRequestModel();
        //this.request.Circle = circle;
        return this.http.post(`${environment.apiUrl}/Circle/CirclePoligonAdd`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    CirclePoligonUpdate(request: BaseRequestModel): Observable<BaseResponseModel> {

        //this.request = new BaseRequestModel();
        //this.request.Circle = circle;

        return this.http.post(`${environment.apiUrl}/Circle/CirclePoligonUpdate`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    CirclePoligonGet(circle: Circle): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.Circle = circle;
        return this.http.post(`${environment.apiUrl}/Circle/CirclePoligonGet`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    DeleteCircleFence(circle: Circle): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Circle = circle;
        return this.http.post(`${environment.apiUrl}/Circle/DeleteCirclePoligon`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    GetCirclesPolygon(circle: Circle): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.Circle = circle;
        return this.http.post(`${environment.apiUrl}/Circle/GetAllCirclesPoints`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }


    GetUserHistory(request: BaseRequestModel): Observable<BaseResponseModel> {
        return this.http.post(`${environment.apiUrl}/Report/GetUserCircleLocation`, request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    GetCricleFenceById(request: BaseRequestModel): Observable<BaseResponseModel> {
        return this.http.post(`${environment.apiUrl}/Circle/CirclePoligonGetById`, request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }
}
