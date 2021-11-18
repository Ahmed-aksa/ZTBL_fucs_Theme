/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activity } from 'app/shared/models/activity.model';
import { BaseRequestModel } from 'app/shared/models/base_request.model';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { HttpUtilsService } from 'app/shared/services/http_utils.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  public request = new BaseRequestModel();
  public activity = new Activity();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) { }
  userDetail = this.userUtilsService.getUserDetails();
  
  reportDynamic(user, reportsFilter){
    debugger
    var request = {
      // DeviceLocation: {
      //   BtsId: "0",
      //   BtsLoc: "",
      //   Lat: "0.0",
      //   Long: "0.0",
      //   Src: "GPS"
      // },
      ReportsFilterCustom: reportsFilter,
       User: this.userDetail.User,
      //  Circle: {
      //    Id: user.CircleId
      //  },
       Zone: {
         ZoneId: user.Zone
       },
       Branch: {
         BranchCode: user.Branch
       }
     }

     return this.http.post<any>(`${environment.apiUrl}/Reports/ReportsDynamic`, request)
       .pipe(
        map((res: BaseResponseModel) => res)
        );
  }
}
