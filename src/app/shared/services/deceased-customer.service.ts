import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';


import { DatePipe } from '@angular/common'
import { BaseRequestModel } from '../models/base_request.model';
import { Activity } from 'app/modules/user-management/activity/activity.model';
import { HttpUtilsService } from './http_utils.service';
import { UserUtilsService } from './users_utils.service';
import { CommonService } from './common.service';
import { Customer } from '../models/deceased_customer.model';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';
import { BaseResponseModel } from '../models/base_response.model';


@Injectable({
  providedIn: 'root'
})
export class DeceasedCustomerService {

  dod: Date;

  public request = new BaseRequestModel();
  public activity = new Activity();

  constructor(
    private http: HttpClient,
     private httpUtils: HttpUtilsService,
     private userUtilsService: UserUtilsService,
     private datePipe: DatePipe,
    private _common: CommonService) { }

  GetDeceasedCustomer(form){

    var deceasedInfo = new Customer();
    deceasedInfo = form         
    this.request = new BaseRequestModel();
    this.request.Customer = deceasedInfo
    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    return this.http.post(`${environment.apiUrl}/Customer/GetDeceasedCustomer`, this.request,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }


//   SearchDeceasedCustomer(){
//     debugger
//     this.request = new BaseRequestModel();
//     var deceasedInfo = new Customer();
//     deceasedInfo = {
//       CustomerName: '',
//       Cnic:'',
//       FatherName:'',
//       CustomerStatus:'-1',
//     }
//     this.request.SearchData = {
//       CurrentIndex: "0",
//       Count: "1000"
//     }
// // this.request.

//     this.request.Customer = deceasedInfo
//     this.request.TranId = 0;
//     var userInfo = this.userUtilsService.getUserDetails();
//     this.request.User = userInfo.User;
//     this.request.Zone = userInfo.Zone;
//     this.request.Branch = userInfo.Branch;
//     this.activity.ActivityID = 1;
//     this.request.Activity = this.activity;
//     var req = JSON.stringify(this.request);
//     console.log(req);
//     debugger

//     return this.http.post(`${environment.apiUrl}/Customer/SearchDeceasedCustomer`, req,
//     { headers: this.httpUtils.getHTTPHeaders() }).pipe(
//       map((res: BaseResponseModel) => res)
//     );
//   }

  SearchDeceasedCustomer(customer: Customer, isUserAdmin: boolean, isZoneUser: boolean): Observable<BaseResponseModel>{
    debugger
    this.request = new BaseRequestModel();
    var deceasedInfo = new Customer();
    deceasedInfo = {
      CustomerName: '',
      Cnic:'',
      FatherName:'',
      CustomerStatus:'-1',
    }
    this.request.SearchData = {
      CurrentIndex: "0",
      Count: "1000"
    }
   // this.request.Customer = deceasedInfo
    this.request.Customer = customer;
    if(this.request.Customer["CustomerStatus"] == null){
      this.request.Customer["CustomerStatus"]= "-1";
    }
    //this.request.Customer["CustomerStatus"]= "-1";
    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    return this.http.post(`${environment.apiUrl}/Customer/SearchDeceasedCustomer`, this.request,
    { headers: this.httpUtils.getHTTPHeaders() }).pipe(
      map((res: BaseResponseModel) => res)
    );
  }


  GetPendingDeceasedCustomerByCnic(){
    var deceasedInfo = new Customer();
    this.request = new BaseRequestModel();
    deceasedInfo = {
      CustomerName: null,
      Cnic:'3840320934203',
      FatherName:null,
      CustomerStatus:null,
    }

    this.request.Customer = deceasedInfo

    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    return this.http.post(`${environment.apiUrl}/Customer/GetPendingDeceasedCustomerByCnic`, this.request,
    { headers: this.httpUtils.getHTTPHeaders() }).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  MarkAsDeceasedCustomer(form,file:File){

    console.log(file)

    var deceasedInfo = new Customer();
    
    this.request = new BaseRequestModel();
    var formData = new FormData();
    var userInfo = this.userUtilsService.getUserDetails();
    var a =userInfo.User.BranchId

    //form.IsReferredBack = true;

    console.log(userInfo);

    debugger

    formData.append('CustomerCnic', form.Cnic);

    formData.append('PPNo', userInfo.User.UserName);

    formData.append('UserID', userInfo.User.UserId);

    formData.append('BranchID', userInfo.User.BranchId);
   
    formData.append('NadraNo', form.NadraNo);

    formData.append('IsNadraCertificateVerified', form.IsNadraCertificateVerified);

    // if(form.IsReferredBack == "Y"){
    //   formData.append('IsReferredBack', true);
    // }
    formData.append('IsReferredBack', form.IsReferredBack? "1": "0");
  
    let dod = this.datePipe.transform(form.DateofDeath, "ddMMyyyy"); //converstion date to string
    formData.append('DateOfDeath', dod);

    formData.append('Remarks', form.MakerRemarks);

    if(form.LegalHeirPay=="N"){
      formData.delete('OtherSourceOfIncome');
    } else{
      formData.append('OtherSourceOfIncome', form.DetailSourceIncome);
    }   
    
    formData.append('LegalHeirPay', form.LegalHeirPay);

    formData.append('File',file);

    formData.append('DeceasedID', form.DeceasedID);

    if(formData.append){

      return this.http.post<any>(`${environment.apiUrl}/Customer/MarkAsDeceasedCustomer`, formData,
    ).pipe(
      map((res: BaseResponseModel) => res)
    );
  // return this.http.post(`${environment.apiUrl}/Customer/MarkAsDeceasedCustomer`, formData,
  //   { headers: this.httpUtils.getHTTPHeaders() }).pipe(
  //     map((res: BaseResponseModel) => res)
  //   );

    }
    }


  GetListOfRejectedDeceasedPerson(){
    var deceasedInfo = new Customer();
    this.request = new BaseRequestModel();
    deceasedInfo.Cnic = ''
    this.request.Customer = deceasedInfo
    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
   
    return this.http.post(`${environment.apiUrl}/Customer/GetListOfRejectedDeceasedPerson`, this.request,
    { headers: this.httpUtils.getHTTPHeaders() }).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  SubmitCustomerNADRA(){
    this.request = new BaseRequestModel();
    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;

    return this.http.post(`${environment.apiUrl}/Customer/SubmitCustomerNADRA`, this.request,
    { headers: this.httpUtils.getHTTPHeaders() }).pipe(
      map((res: BaseResponseModel) => res)
    );
  }
}
