import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { BaseRequestModel } from 'app/shared/models/base_request.model';
import { Activity } from './activity.model';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { environment } from 'environments/environment';
import { HttpUtilsService } from 'app/shared/services/http_utils.service';
import { UserUtilsService } from 'app/shared/services/user-utils.service';


@Injectable({providedIn: 'root'})
export class ActivityService {
  public request = new BaseRequestModel();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private activityUtilsService: UserUtilsService) {
  }


  updateActivity(activity: Activity): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.Activity = activity;

    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Activity/UpdateActivity`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  createActivity(activity: Activity): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.Activity = activity;

    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Activity/AddActivity`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  deleteActivity(activity: Activity): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.Branch = {
      'BranchId': '102',
      'BranchCode': '20238',
      'Name': 'NOORPUR TOWN',
      'WorkingDate': '11012021',
      'Id': 0
    };
    this.request.doPerformOTP = false;
    this.request.TranId = 2830;
    this.request.DEVICELOCATION = {
      BTSID: '0',
      BTSLOC: '',
      LAT: '33.65898',
      LONG: '73.057665',
      SRC: 'GPS'
    }, this.request.Circle = {
      CircleIds: '53444,53443,53442,53441'
    };
    var req = JSON.stringify(this.request);
    this.request.User = this.activityUtilsService.getUserDetails().User;
    this.request.Zone = {
      Id: 0,
      ZoneId: '50055',
      ZoneName: 'SAHIWAL'
    };
    this.request.Activity = activity;

    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Activity/DeletePage`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  getAllActivities(activity: Activity): Observable<BaseResponseModel> {


    this.request = new BaseRequestModel();
    this.request.Activity = activity;
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Activity/GetActivities`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  getActivitiesList(): Observable<BaseResponseModel> {

    return this.http.post(`${environment.apiUrl}/Activity/GetAllActivities`,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }


  getParentActivities(): Observable<BaseResponseModel> {

    return this.http.post(`${environment.apiUrl}/Activity/GetParentActivities`,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

}
