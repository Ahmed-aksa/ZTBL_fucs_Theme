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
export class KhaadSeedVendorService {

    public request = new BaseRequestModel();
    public activity = new Activity();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    userDetail = this.userUtilsService.getUserDetails();

    getTypeLov(userInfo) {
        //
        var request = {
            DeviceLocation: {
                BtsId: "0",
                BtsLoc: "",
                Lat: "0.0",
                Long: "0.0",
                Src: "GPS"
            },
            User: userInfo.User
        }

        return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/GetVendorTypes`, request,)
            .pipe(
                map((res: BaseResponseModel) => res)
            );

    }

    addNewVendor(vendor, file: File) {

        var formData = new FormData();
        var userInfo = this.userUtilsService.getUserDetails();

        if (vendor.Id != null || vendor.Id != undefined) {

            formData.append('Id', vendor.Id);
        }
        formData.append('Name', vendor.Name);
        formData.append('Type', vendor.Type);
        formData.append('Address', vendor.Address);
        formData.append('PhoneNumber', vendor.PhoneNumber);
        formData.append('Description', vendor.Description);
        formData.append('CreatedBy', userInfo.User.UserId);
        formData.append('PPNo', userInfo.User.UserName);
        formData.append('Lat', vendor.Lat);
        formData.append('ZoneId', vendor.ZoneId);
        formData.append('BranchCode', vendor.BranchCode);
        formData.append('CircleCode', vendor.CircleCode);
        formData.append('CircleId', vendor.CircleId);
        formData.append('Lng', vendor.Lng);
        formData.append('File', file);

        if (formData.append) {

            return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/AddUpdateVendor`, formData,)
                .pipe(
                    map((res: BaseResponseModel) => res)
                );
        }

    }

    searchVendors(limit, offSet, vendor, user, zone = null, branch = null, circle = null) {

        if (vendor.Type == 'null' || user.CircleId == 'null') {
            vendor.Type = null
            if (user.CircleId == 'null') {
                user.CircleId = null
            }
        }
        let request;
        if (zone == null && branch == null && circle == null) {
            request = {
                DeviceLocation: {
                    BtsId: "0",
                    BtsLoc: "",
                    Lat: "0.0",
                    Long: "0.0",
                    Src: "GPS"
                },
                SeedKhadVendor: {
                    Limit: limit,
                    Offset: offSet,
                    VendorDetail: vendor
                },
                User: this.userDetail.User,
                Circle: {
                    CircleCode: user.CircleId
                },
                Zone: {
                    ZoneId: user.ZoneId
                },
                Branch: {
                    BranchCode: user.BranchCode
                },
            }
        } else {
            request = {
                DeviceLocation: {
                    BtsId: "0",
                    BtsLoc: "",
                    Lat: "0.0",
                    Long: "0.0",
                    Src: "GPS"
                },
                SeedKhadVendor: {
                    Limit: limit,
                    Offset: offSet,
                    VendorDetail: vendor
                },
                User: this.userDetail.User,
                Circle: circle ? circle : null,
                Zone: zone,
                Branch: branch,
            }
        }
        return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/GetVendors`, request)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    searchRadius(vendor, zone, branch, circle) {
        vendor.Radius = Number(vendor.Radius)
        var request = {
                DeviceLocation: {
                    BtsId: "0",
                    BtsLoc: "",
                    Lat: "33.659578333333336",
                    Long: "73.05676333333334",
                    Src: "GPS"
                },
                SeedKhadVendor: {
                    VendorDetail: vendor
                },
                User: this.userDetail.User,
                Circle: circle,
                Zone: zone,
                Branch: branch
            }

        ;
        return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/GetVendors`, request)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    getVendor(vendor, user) {

        vendor.Id = Number(vendor.Id)
        var request = {
            DeviceLocation: {
                BtsId: "0",
                BtsLoc: "",
                Lat: "0.0",
                Long: "0.0",
                Src: "GPS"
            },
            SeedKhadVendor: {
                VendorDetail: vendor
            },
            User: this.userDetail.User,
            Circle: {
                Id: user.CircleId
            },
            Zone: {
                ZoneId: user.ZoneId
            },
            Branch: {
                BranchCode: user.BranchCode
            }
        }
        var req = JSON.stringify(request)
        return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/GetVendors`, req,)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    deleteVendor(vendor, user) {
        var request = {
            DeviceLocation: {
                BtsId: "0",
                BtsLoc: "",
                Lat: "0.0",
                Long: "0.0",
                Src: "GPS"
            },
            SeedKhadVendor: {
                VendorDetail: vendor
            },
            User: this.userDetail.User,
            Circle: {
                Id: user.CircleId
            },
            Zone: {
                ZoneId: user.ZoneId
            },
            Branch: {
                BranchCode: user.BranchCode
            }
        }
        return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/DeleteVendor`, request,)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

}
