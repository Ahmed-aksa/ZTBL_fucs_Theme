/* eslint-disable no-debugger */
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
export class KhaadSeedVendorService {

  public request = new BaseRequestModel();
  public activity = new Activity();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) { }

  userDetail = this.userUtilsService.getUserDetails();

  getTypeLov(userInfo){
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

    if(vendor.Id != null || vendor.Id != undefined){
      
      formData.append('Id', vendor.Id);
    }
    formData.append('Name', vendor.Name);
    formData.append('Type', vendor.Type);
    formData.append('Address', vendor.Address);
    formData.append('PhoneNumber', vendor.PhoneNumber);
    formData.append('Description', vendor.Description);
    formData.append('CreatedBy', userInfo.User.UserId);
    formData.append('UserPPNO', userInfo.User.UserName);
    formData.append('Lat', vendor.Lat);
    formData.append('ZoneId', vendor.ZoneId);
    formData.append('BranchCode', vendor.BranchCode);
    formData.append('CircleId', vendor.CircleId);
    formData.append('Lng', vendor.Lng);
    formData.append('File', file);


    
    if(formData.append){

      return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/AddUpdateVendor`, formData,)
      .pipe(
        map((res: BaseResponseModel) => res)
        );
      }

   }

  searchVendors(limit, offSet, vendor, user) {
    
    if(vendor.Type == 'null'){
      vendor.Type = null
    }

     var request = {
      DeviceLocation: {
        BtsId: "0",
        BtsLoc: "",
        Lat: "0.0",
        Long: "0.0",
        Src: "GPS"
      },
      SeedKhadVendor:{
          Limit: limit,
          Offset: offSet,
          VendorDetail : vendor
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

     return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/GetVendors`, request)
       .pipe(
        map((res: BaseResponseModel) => res)
        );
   }

   searchRadius(vendor, user){
    debugger
    vendor.Radius = Number(vendor.Radius)
    if(vendor.Type = 'null'){
      vendor.Type = null;
    }
    var request = {
     DeviceLocation: {
       BtsId: "0",
       BtsLoc: "",
       Lat: "33.659578333333336",
       Long: "73.05676333333334",
       Src: "GPS"
     },
     SeedKhadVendor:{
      //Radius: vendor.Radius,
      //Type: vendor.Type,
      // Name: vendor.Name
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

    ;
    return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/GetVendors`, request)
      .pipe(
       map((res: BaseResponseModel) => res)
       );
  }

   getVendor(vendor, user){
     
     vendor.Id = Number(vendor.Id)
    var request = {
      DeviceLocation: {
        BtsId: "0",
        BtsLoc: "",
        Lat: "0.0",
        Long: "0.0",
        Src: "GPS"
      },
      SeedKhadVendor:{
        VendorDetail:vendor
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
   
   deleteVendor(vendor, user){
    var request = {
      DeviceLocation: {
        BtsId: "0",
        BtsLoc: "",
        Lat: "0.0",
        Long: "0.0",
        Src: "GPS"
      },
      SeedKhadVendor:{
        VendorDetail:vendor
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
