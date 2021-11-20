/* eslint-disable no- */
/* eslint-disable eqeqeq */
/* eslint-disable no- */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Activity} from 'app/shared/models/activity.model';
import {BaseRequestModel} from 'app/shared/models/base_request.model';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import { Circle } from 'app/shared/models/circle.model';
import {HttpUtilsService} from 'app/shared/services/http_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {environment} from 'environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ReportsService {
    public request = new BaseRequestModel();
    public activity = new Activity();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    userDetail = this.userUtilsService.getUserDetails();

    reportDynamic(user, reportsFilter) {
      if(reportsFilter.CircleId == 'null'){
        reportsFilter.CircleId = null
      }
        
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
            Zone: user.Zone,
            Branch: user.Branch,
            Circle:user.Circle
        }

        return this.http.post<any>(`${environment.apiUrl}/Reports/ReportsDynamic`, request)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    earlyWarningReport(user, reportsFilter) {
      if(reportsFilter.CircleId == 'null'){
        reportsFilter.CircleId = null
      }
        
        var request = {
            ReportsFilterCustom: reportsFilter,
            User: this.userDetail.User,
            Zone: user.Zone,
            Branch: user.Branch,
            Circle:{
              CircleCode: user.Circle.CircleId
            }
        }

        return this.http.post<any>(`${environment.apiUrl}/Reports/ReportsDynamic`, request)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }
}
