import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common'
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {HttpUtilsService} from "../../../shared/services/http_utils.service";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {CommonService} from "../../../shared/services/common.service";
import {Activity} from "../../../shared/models/activity.model";
import {BaseResponseModel} from "../../../shared/models/base_response.model";


@Injectable({
  providedIn: 'root'
})
export class LoanUtilizationService {

  dod: Date;

  public request = new BaseRequestModel();
  public activity = new Activity();

  constructor(
    private http: HttpClient,
     private httpUtils: HttpUtilsService,
     private userUtilsService: UserUtilsService,
     private datePipe: DatePipe,
    private _common: CommonService) { }

    GetLoanDetail(value){

    console.log(value);
    debugger
    this.request = new BaseRequestModel();
    this.request.LoanUtilization={"UtilizationDetail":{"LoanCaseNo":value}}
    this.request.TranId = 2830;
    this.request.DEVICELOCATION={
      BTSID :"0",
      BTSLOC : "",
      LAT: "33.65898",
      LONG: "73.057665",
      SRC: "GPS"
    },

    this.request.Circle={
      CircleIds: "53444,53443,53442,53441"
    },

    this.request.doPerformOTP = false;

    var userInfo = this.userUtilsService.getUserDetails();
    debugger
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    console.log(req)
    debugger
    return this.http.post(`${environment.apiUrl}/LoanUtilization/GetLoanDetail`, this.request,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }
    searchUtilization(loanUtilization, userDetail: BaseResponseModel=null): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    // if (loanUtilization.CustomerName == null)
    // loanUtilization.CustomerName = "";

    // if (loanUtilization.FatherName == null)
    // loanUtilization.FatherName = "";

    // if (loanUtilization.Cnic == null)
    // loanUtilization.Cnic = "";

    debugger;
    var userInfo = this.userUtilsService.getUserDetails();
    if (userDetail && userDetail.Zone) {
      userInfo.Zone = userDetail.Zone;
      userInfo.Branch = userDetail.Branch;
    }
    this.request.User = userInfo.User;
    this.request.LoanUtilization={"UtilizationDetail":loanUtilization}
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;

    var req = JSON.stringify(this.request);
console.log(req);
    debugger;
    return this.http.post(`${environment.apiUrl}/LoanUtilization/SearchUtilizations`, this.request,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

    searchLoanUtilization(loanUtilization, userDetail: BaseResponseModel=null,fromdate:string,todate:string,Limit,Offset): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();

    debugger;
    var userInfo = this.userUtilsService.getUserDetails();
    if (userDetail && userDetail.Zone) {
      userInfo.Zone = userDetail.Zone;
      userInfo.Branch = userDetail.Branch;
    }
    this.request.User = userInfo.User;
    if(loanUtilization){
      this.request.LoanUtilization={"UtilizationDetail":{"LoanCaseNo":loanUtilization}}
    }else{
      loanUtilization = null
      this.request.LoanUtilization={"UtilizationDetail":{"LoanCaseNo":loanUtilization}}
  }
      this.request.LoanUtilization["FromDate"]=fromdate;
      this.request.LoanUtilization["ToDate"]=todate;
      this.request.LoanUtilization["Offset"]=Offset;
      this.request.LoanUtilization["Limit"]=Limit;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;


    var circle = userInfo.UserCircleMappings;
    var circleIds = [];
    circle.forEach(element => {
      circleIds.push(element.CircleId);
    });
    var _circles = JSON.stringify(circleIds)
    this.request.Circle = {
      CircleIds: _circles,
    }

    var req = JSON.stringify(this.request);
console.log(req);
    debugger;
    return this.http.post(`${environment.apiUrl}/LoanUtilization/SearchLoanForUtilization`,  this.request,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

    save(value){
    value.Status="P";
    console.log("value"+JSON.stringify(value));
    debugger;
    this.request = new BaseRequestModel();
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.DEVICELOCATION={
      BTSID :"0",
      BTSLOC : "",
      LAT: "33.65898",
      LONG: "73.057665",
      SRC: "GPS"
    },
    this.request.LoanUtilization={"UtilizationDetail":value}
    this.request.TranId = 2830;
    this.request.doPerformOTP = false;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.request.User = userInfo.User;
    var req = JSON.stringify(this.request);
    console.log("this one"+req);
    debugger

      return this.http.post<any>(`${environment.apiUrl}/LoanUtilization/SaveUpdateUtilization`, this.request,
    ).pipe(
      map((res: BaseResponseModel) => res)
    );
    }

    statusChange(value){
      debugger;
      this.request = new BaseRequestModel();
      var userInfo = this.userUtilsService.getUserDetails();
      this.request.Circle={
        CircleIds: "53444,53443,53442,53441"
      },
      this.request.DEVICELOCATION={
        BTSID :"0",
        BTSLOC : "",
        LAT: "33.65898",
        LONG: "73.057665",
        SRC: "GPS"
      },
      this.request.LoanUtilization={"UtilizationDetail":value}
      this.request.TranId = 2830;
      this.request.doPerformOTP = false;
      this.request.Zone = userInfo.Zone;
      this.request.Branch = userInfo.Branch;
      this.request.User = userInfo.User;
      console.log(this.request.User)
      var req = JSON.stringify(this.request);
      console.log(req);
      debugger
        return this.http.post<any>(`${environment.apiUrl}/LoanUtilization/ChangeUtilizationStatus`, this.request,
      ).pipe(
        map((res: BaseResponseModel) => res)
      );
      }

    SaveMedia(file,loanutilization:any,val:string){
      //append work

      var formData = new FormData();
      debugger;
      this.request = new BaseRequestModel();
      var userInfo = this.userUtilsService.getUserDetails();
      this.request.Circle={
        CircleIds: "53444,53443,53442,53441"
      },
      this.request.DEVICELOCATION={
        BTSID :"0",
        BTSLOC : "",
        LAT: "33.65898",
        LONG: "73.057665",
        SRC: "GPS"
      },

      // this.request.LoanUtilization={"UtilizationDetail":value}
      this.request.TranId = 2830;
      this.request.doPerformOTP = false;
      this.request.Zone = userInfo.Zone;
      this.request.Branch = userInfo.Branch;
      this.request.User = userInfo.User;
      console.log(this.request.User)
      var req = JSON.stringify(this.request);
      console.log(req);
      debugger

    formData.append('UtilizationID', loanutilization.ID);
    formData.append('Lat', loanutilization.Lat);
    formData.append('Lng', loanutilization.Lng);
    formData.append('UserID', userInfo.User.UserId);
    formData.append('IsVideo', val);
    formData.append('File',file);

    console.log("UtilizationID",formData.get('UtilizationID'));
    console.log("Lat",formData.get('Lat'));
    console.log("Lng",formData.get('Lng'));
    console.log("UserID",formData.get('UserID'));
    console.log("IsVideo",formData.get('IsVideo'));
    console.log("File Data",formData.get('File'));

    return this.http.post<any>(`${environment.apiUrl}/LoanUtilization/UploadUtlization`, formData,
        ).pipe(
        map((res: BaseResponseModel) => res)
      );
    }

    GetMedia(data){
      debugger
      this.request = new BaseRequestModel();
      this.request.LoanUtilization={"UtilizationDetail":{"LoanCaseNo": data.LoanCaseNo, "LoanDisbID":data.LoanDisbID}}
      this.request.TranId = 2830;
      this.request.DEVICELOCATION={
        BTSID :"0",
        BTSLOC : "",
        LAT: "33.65898",
        LONG: "73.057665",
        SRC: "GPS"
      },

      this.request.Circle={
        CircleIds: "53444,53443,53442,53441"
      },
      this.request.doPerformOTP = false;
      var userInfo = this.userUtilsService.getUserDetails();
      debugger
      this.request.User = userInfo.User;
      this.request.Zone = userInfo.Zone;
      this.request.Branch = userInfo.Branch;
      this.activity.ActivityID = 1;
      this.request.Activity = this.activity;
      var req = JSON.stringify(this.request);
      console.log(req)
      debugger

      return this.http.post(
        `${environment.apiUrl}/LoanUtilization/GetUploadedUtilizations`, this.request,
        { headers: this.httpUtils.getHTTPHeaders() }
        ).pipe(
          map((res: BaseResponseModel) => res)
        );
    }
    DeleteMedia(id:string){
      debugger
      this.request = new BaseRequestModel();
      this.request.LoanUtilization={"UtilizationDetail":{"ID": id}}
      this.request.TranId = 2830;
      this.request.DEVICELOCATION={
        BTSID :"0",
        BTSLOC : "",
        LAT: "33.65898",
        LONG: "73.057665",
        SRC: "GPS"
      },
      this.request.Circle={
        CircleIds: "53444,53443,53442,53441"
      },
      this.request.doPerformOTP = false;
      var userInfo = this.userUtilsService.getUserDetails();
      debugger
      this.request.User = userInfo.User;
      this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
      this.activity.ActivityID = 1;
      this.request.Activity = this.activity;
      var req = JSON.stringify(this.request);
      console.log(req)
      debugger
      return this.http.post(`${environment.apiUrl}/LoanUtilization/DeleteUtilizationFile`, this.request,
        { headers: this.httpUtils.getHTTPHeaders() }).pipe(
          map((res: BaseResponseModel) => res)
        );
    }

    GetLoanGL(value){
    debugger
    this.request = new BaseRequestModel();
    this.request.LoanUtilization={"UtilizationDetail":{"LoanCaseNo":value}}
    this.request.TranId = 2830;
    this.request.DEVICELOCATION={
      BTSID :"0",
      BTSLOC : "",
      LAT: "33.65898",
      LONG: "73.057665",
      SRC: "GPS"
    },

    this.request.Circle={
      CircleIds: "53444,53443,53442,53441"
    },

    this.request.doPerformOTP = false;

    var userInfo = this.userUtilsService.getUserDetails();
    debugger
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch =   {
      "BranchId": "102",
      "BranchCode": "20238",
      "Name": "NOORPUR TOWN",
      "WorkingDate": "11012021",
      "Id": 0
  }
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    console.log(req)
    debugger
    return this.http.post(`${environment.apiUrl}/LoanUtilization/GetGLForLoan`, this.request,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

}
