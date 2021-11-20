/* eslint-disable arrow-parens */
/* eslint-disable no- */
/* eslint-disable no-cond-assign */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Activity} from 'app/shared/models/activity.model';
import {BaseRequestModel} from 'app/shared/models/base_request.model';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {HttpUtilsService} from 'app/shared/services/http_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {environment} from 'environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class VillageWiseBenchMarkingService {

    public request = new BaseRequestModel();
    public activity = new Activity();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    userInfo = this.userUtilsService.getUserDetails();

    getVillageBenchMark(circle, limit, offset, village, zone, branch) {

        // var circle = this.userInfo.UserCircleMappings;
        var circleIds = [];

        if (village.CircleId == 'null') {
            village.CircleId = null
        }
        if (this.userInfo.UserCircleMappings.length != 0) {
            this.userInfo.UserCircleMappings.forEach(element => {
                circleIds.push(element.CircleId);
            });
        } else {
            circleIds = ["0"]
        }
        var _circles = JSON.stringify(circleIds)

        var request = {
            Circle: {
                CircleIds: _circles,
                CircleCode: circle?.Id
            },
            VillageBenchMarking: {
                Limit: limit,
                Offset: offset,
                VillageName: village.VillageName
            },
            DeviceLocation: {
                BtsId: "0",
                BtsLoc: "",
                Lat: "0.0",
                Long: "0.0",
                Src: "BTS",
                time: "0",
                id: 0
            },
            TranId: 0,
            Branch: branch,
            User: this.userInfo.User,
            Zone: zone
        };
        var r = JSON.stringify(request)
        console.log(r)

        return this.http.post(`${environment.apiUrl}/VillageBenchMarking/GetVillageBenchMarking`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    addUpdateVillageBenchMark(village, user) {

        console.log("village" + village)
        var circle = this.userInfo.UserCircleMappings;
        var circleIds = [];
        //mycircle =

        if (circle != null) {
            circle.forEach(element => {
                circleIds.push(element.CircleId);
            });
        } else {
            circleIds = ["0"]
        }
        var _circles = JSON.stringify(circleIds)

        var request = {
            Circle: {
                CircleIds: _circles,
                CircleCode: user.CircleId
            },
            VillageBenchMarking: {
                VillageBenchMarkingList: village
            },
            DeviceLocation: {
                BtsId: "0",
                BtsLoc: "",
                Lat: "0.0",
                Long: "0.0",
                Src: "BTS",
                time: "0",
                id: 0
            },
            TranId: 0,
            User: this.userInfo.User,
            Branch: {
                BranchCode: user.BranchCode
            },
            Zone: {
                ZoneId: user.ZoneId
            }
        };
        var r = JSON.stringify(request)
        console.log(r)

        return this.http.post(`${environment.apiUrl}/VillageBenchMarking/AddUpdateBenchMarking`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    deleteVillageBenchmark(village) {

        var circle = this.userInfo.UserCircleMappings;
        var circleIds = [];
        //mycircle =

        if (circle != null) {
            circle.forEach(element => {
                circleIds.push(element.CircleId);
            });
        } else {
            circleIds = ["0"]
        }

        var _circles = JSON.stringify(circleIds)

        var request = {
            Circle: {
                CircleIds: _circles,
                CircleCode: village.CircleId
            },
            VillageBenchMarking: {
                Id: village.Id,
                Remarks: village.Remarks
            },
            DeviceLocation: {
                BtsId: "0",
                BtsLoc: "",
                Lat: "0.0",
                Long: "0.0",
                Src: "BTS",
                time: "0",
                id: 0
            },
            TranId: 0,
            User: this.userInfo.User,
            Branch: {
                BranchCode: village.BranchCode
            },
            Zone: {
                ZoneId: village.ZoneId
            }
        };
        var r = JSON.stringify(request)
        console.log(r)

        return this.http.post(`${environment.apiUrl}/VillageBenchMarking/DeleteBenchMarking`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

}
