/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/no-unused-expressions */
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
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {HttpUtilsService} from 'app/shared/services/http_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';

@Injectable({
    providedIn: 'root'
})
export class NdcRequestsService {
    request_response = {
        'Branch': {
            'BranchId': '102',
            'BranchCode': '20238',
            'Id': 0,
            'Name': 'NOORPUR TOWN',
            'WorkingDate': '11012021'
        },
        'Circle': {
            'CircleIds': '53444,53443,53442,53441'
        },
        'CustomerLandRelation': {
            'Cnic': '',
            'Limit': '0',
            'Offset': '0',
            "ID": "673336"
        },
        'DeviceLocation': {
            'BtsId': '0',
            'BtsLoc': '',
            'Lat': '33.65898',
            'Long': '73.057665',
            'Src': 'GPS'
        },
        'doPerformOTP': false,
        'TranId': 2830,
        'User': {
            'IsActive': 0,
            'App': 2,
            'Channel': 'user',
            'ChannelID': 0,
            'DisplayName': 'MUHAMMAD ALI',
            'Lat': 0.0,
            'Long': 0.0,
            'ProfileID': 0,
            'UserId': 'B-4070',
            'UserIp': '192.168.0.137',
            'UserName': '131694',
            'UserType': 0
        },
        'Zone': {
            'Id': 0,
            'ZoneId': '50055',
            'ZoneName': 'SAHIWAL'
        }
    };

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();

    getRequests(user, limit, offset, final_zone, final_branch) {

        if (this.userInfo?.UserCircleMappings?.length != 0) {
            this.userInfo?.UserCircleMappings?.forEach(element => {
                circleIds.push(element.CircleId);
            });
        } else {
            circleIds = ["0"]
        }
        this.userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        limit = String(limit);
        offset = String(offset)
        var circle = this.userInfo.UserCircleMappings;
        var circleIds = [];

        if (circle) {
            circle.forEach(element => {
                circleIds.push(element.CircleId);
            });
        }



        var _circles = JSON.stringify(circleIds)
        _circles
        var request = {
            Circle: {
                CircleIds: _circles,
                CircleId: user.CircleId
            },
            NDCRequest: {
                Cnic: user.Cnic,
                Limit: limit,
                Offset: offset
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
            Branch:final_branch ? final_branch : null,
            Zone: final_zone,
        };
        return this.http.post(environment.apiUrl + '/NDC/SearchNDCList', request);
    }

    DeleteCustomer(user) {
        var circle = this.userInfo.UserCircleMappings;
        var circleIds = [];
        //mycircle =

        circle.forEach(element => {
            circleIds.push(element.CircleId);
        });
        var _circles = JSON.stringify(circleIds)
        _circles
        var request = {
            Circle: {
                CircleIds: _circles,
                CircleId: user.CircleId
            },
            NDCRequest: {
                NDCId: user.NDCId,
                Remarks: user.Remarks

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
            // Branch: {
            //   BranchCode: user.BranchCode
            // },
            // Zone: {
            //   ZoneId: user.ZoneId
            // },
            Branch: this.userInfo.Branch,
            Zone: this.userInfo.Zone
        };
        // var r = JSON.stringify(request)
        // console.log(r)
        //
        //   return this.http.post(`${environment.apiUrl}/NDC/SearchNDCList`, request,
        //     { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        //       map((res: BaseResponseModel) => res)
        //     );
        // this.request_response.CustomerLandRelation.Cnic = cnic;
        // this.request_response.CustomerLandRelation.Offset = offset;
        // this.request_response.CustomerLandRelation.Limit = limit;
        return this.http.post(environment.apiUrl + '/NDC/DeleteNDC', request);
    }

    SubmitUser(user) {
        var circle = this.userInfo.UserCircleMappings;
        var circleIds = [];
        //mycircle =

        circle.forEach(element => {
            circleIds.push(element.CircleId);
        });
        var _circles = JSON.stringify(circleIds)
        _circles
        var request = {
            Circle: {
                CircleIds: _circles,
                CircleId: user.CircleId
            },
            NDCRequest: {
                NDCId: user.NDCId,
                Remarks: user.Remarks

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
            // Branch: {
            //   BranchCode: user.BranchCode
            // },
            // Zone: {
            //   ZoneId: user.ZoneId
            // },
            Branch: this.userInfo.Branch,
            Zone: this.userInfo.Zone
        };
        // var r = JSON.stringify(request)
        // console.log(r)
        //
        //   return this.http.post(`${environment.apiUrl}/NDC/SearchNDCList`, request,
        //     { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        //       map((res: BaseResponseModel) => res)
        //     );
        // this.request_response.CustomerLandRelation.Cnic = cnic;
        // this.request_response.CustomerLandRelation.Offset = offset;
        // this.request_response.CustomerLandRelation.Limit = limit;
        return this.http.post(environment.apiUrl + '/NDC/SubmitNDC', request);
    }


    downloadFile(cnic: any, ncid: any, limit, offset, user) {

        limit = String(limit);
        offset = String(offset)
        var circle = this.userInfo.UserCircleMappings;

        var circleIds = [];
        if (circle == null) {
            //circle = ["CircleId: 0"]
            circleIds = ["0"]
        } else {
            circle.forEach(element => {
                circleIds.push(element.CircleId);
            });
        }
        //mycircle =


        var _circles = JSON.stringify(circleIds)


        var request = {
            Circle: {
                CircleIds: _circles,
                CircleId: user.CircleId
            },
            NDCRequest: {
                Cnic: cnic,
                Limit: limit,
                Offset: offset,
                NDCId: ncid
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

            // Branch: {
            //   BranchCode: user.BranchCode
            // },
            // Zone: {
            //   ZoneId: user.ZoneId
            // },
            Branch: this.userInfo.Branch,
            Zone: this.userInfo.Zone
        };

        // this.request_response.CustomerLandRelation.Cnic = cnic;
        // this.request_response.CustomerLandRelation.ID = id;
        return this.http.post(environment.apiUrl + '/NDC/DownloadNDC', request);
    }
}
