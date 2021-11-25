import { Injectable } from '@angular/core';
import { BaseRequestModel } from '../../../../shared/models/base_request.model';
import { Activity } from '../../../../shared/models/activity.model';
import { HttpClient } from '@angular/common/http';
import { HttpUtilsService } from '../../../../shared/services/http_utils.service';
import { UserUtilsService } from '../../../../shared/services/users_utils.service';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../../../shared/services/common.service';
import { Customer } from '../../../../shared/models/deceased_customer.model';
import { map } from 'rxjs/operators';
import { BaseResponseModel } from '../../../../shared/models/base_response.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SetTargetService {
    dod: Date;

    public request = new BaseRequestModel();
    public activity = new Activity();

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService,
        private userUtilsService: UserUtilsService,
        private datePipe: DatePipe,
        private _common: CommonService
    ) {}

    GetDeceasedCustomer(form) {
        var deceasedInfo = new Customer();
        deceasedInfo = form;
        this.request = new BaseRequestModel();
        this.request.Customer = deceasedInfo;
        this.request.TranId = 0;
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        var req = JSON.stringify(this.request);
        return this.http
            .post(`${environment.apiUrl}/Customer/GetDeceasedCustomer`, req, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    GetTragetDuration() {
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;

        var deceasedInfo = new Customer();
        this.request = new BaseRequestModel();
        // this.request.Customer = deceasedInfo
        this.request.TranId = 2830;

        var circle = userInfo.UserCircleMappings;
        var circleIds = [];

        circle.forEach((element) => {
            circleIds.push(element.CircleId);
        });
        var _circles = JSON.stringify(circleIds);

        (this.request.DEVICELOCATION = {
            BTSID: '0',
            BTSLOC: '',
            LAT: '0.000000',
            LONG: '0.000000',
            SRC: 'GPS',
        }),
            (this.request.Circle = {
                CircleIds: _circles,
            }),
            (this.request.doPerformOTP = false);

        var req = JSON.stringify(this.request);

        return this.http
            .post(`${environment.apiUrl}/Target/GetTragetDuration`, this.request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }
    GetTargets(value: string) {
        var deceasedInfo = new Customer();
        this.request = new BaseRequestModel();

        this.request.Target = {
            Duration: value,
            Targets: null,
        };
        this.request.Target['Targets'] = null;
        this.request.TranId = 2830;

        (this.request.DEVICELOCATION = {
            BTSID: '0',
            BTSLOC: '',
            LAT: '0.00000',
            LONG: '0.000000',
            SRC: 'GPS',
        }),
            (this.request.Circle = {
                CircleIds: '53444,53443,53442,53441',
            }),
            (this.request.doPerformOTP = false);

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        // this.request.User = {
        //   UserId : "B-44"
        //       }
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        var req = JSON.stringify(this.request);
        // 
        return this.http
            .post(`${environment.apiUrl}/Target/GetTargets`, this.request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    saveTargets(targets, Duration, AssignedTarget) {
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        (this.request.Circle = {
            CircleIds: '53444,53443,53442,53441',
        }),
            (this.request.DEVICELOCATION = {
                BTSID: '0',
                BTSLOC: '',
                LAT: '33.65898',
                LONG: '73.057665',
                SRC: 'GPS',
            }),
            (this.request.TranId = 2830);

        this.request.doPerformOTP = false;

        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;

        this.request.User = userInfo.User;
        // this.request.User["UserId"] = "B-44";

        this.request.Target = { Targets: targets };

        this.request.Target.Duration = Duration;
        this.request.Target.AssignedTarget = AssignedTarget;

        // this.request.Target["AssignedTarget"]=AssignedTarget;

        var req = JSON.stringify(this.request);
        
        return this.http
            .post<any>(
                `${environment.apiUrl}/Target/AddUpdateTarget`,
                this.request
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    submitTargets(Duration) {
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        (this.request.Circle = {
            CircleIds: '53444,53443,53442,53441',
        }),
            (this.request.DEVICELOCATION = {
                BTSID: '0',
                BTSLOC: '',
                LAT: '33.65898',
                LONG: '73.057665',
                SRC: 'GPS',
            }),
            (this.request.TranId = 2830);
        this.request.doPerformOTP = false;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.request.User = userInfo.User;
        this.request.Target = { Targets: null };
        this.request.Target.Duration = Duration.toString();
        var req = JSON.stringify(this.request);
        
        return this.http
            .post<any>(
                `${environment.apiUrl}/Target/SubmitTarget`,
                this.request
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    GetListOfRejectedDeceasedPerson() {
        var deceasedInfo = new Customer();
        this.request = new BaseRequestModel();
        deceasedInfo.Cnic = '';
        this.request.Customer = deceasedInfo;
        this.request.TranId = 0;
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        var req = JSON.stringify(this.request);
        return this.http
            .post(
                `${environment.apiUrl}/Customer/GetListOfRejectedDeceasedPerson`,
                req,
                { headers: this.httpUtils.getHTTPHeaders() }
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    SubmitCustomerNADRA() {
        this.request = new BaseRequestModel();
        this.request.TranId = 0;
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        var req = JSON.stringify(this.request);

        return this.http
            .post(`${environment.apiUrl}/Customer/SubmitCustomerNADRA`, this.request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }
}
