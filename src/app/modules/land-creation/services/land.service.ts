import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {HttpUtilsService} from "../../../shared/services/http_utils.service";
import {Activity} from "../../../shared/models/activity.model";
import {LandInfo} from 'app/shared/models/land_info.model';
import {CustomerLandRelation} from "../../../shared/models/customer_land_relation.model";
import {UploadDocuments} from "../models/upload_documents.model";
import {LandChargeCreation} from "../models/land_charge_creation.model";

@Injectable({
    providedIn: 'root'
})
export class LandService {

    size = 10;
    pageIndex = 1;

    apiUrl = 'https://jsonplaceholder.typicode.com/photos';
    url2 = `https://jsonplaceholder.typicode.com/photos?page=${this.pageIndex}&size=${this.size}`;


    public request = new BaseRequestModel();
    public activity = new Activity();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    saveCustomerLandInfo(landInfo: LandInfo, branch?, zone?): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();


        this.activity.ActivityID = 1;
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = branch;
        this.request.Zone = zone;
        this.request.LandInfo = landInfo;
        this.request.Activity = this.activity;
        return this.http.post(`${environment.apiUrl}/Land/SaveCustomerLandInfo`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    saveCustomerLandInfoDetail(landInfoDetails: any, TrainId: any): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();

        this.activity.ActivityID = 1;
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        this.request.LandInfoDetailsList = landInfoDetails;
        this.request.Activity = this.activity;
        this.request.TranId = TrainId;
        var req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Land/SaveCustomerLandInfoDetail`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    SaveChargeCreation(request: BaseRequestModel): Observable<BaseResponseModel> {

        var req = JSON.stringify(request);


        return this.http.post(`${environment.apiUrl}/Land/SaveChargeCreation`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    SaveChargeCreationDetail(): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        var req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Land/SaveChargeCreationDetail`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    SubmitLandInfo(request: BaseRequestModel): Observable<BaseResponseModel> {
        var req = JSON.stringify(request);


        return this.http.post(`${environment.apiUrl}/Land/SubmitLandInfo`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    searchLand(customerLandRelation: CustomerLandRelation, isUserAdmin: boolean, isZoneUser: boolean): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        if (isUserAdmin || isZoneUser) {
            if (customerLandRelation.BranchId != undefined)
                userInfo.Branch.BranchId = customerLandRelation.BranchId;
            else
                userInfo.Branch.BranchId = 0;
        }
        if (isUserAdmin) {
            if (customerLandRelation.ZoneId != undefined)
                userInfo.Zone.ZoneId = customerLandRelation.ZoneId;
            else
                userInfo.Zone.ZoneId = 0;
        }
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        this.request.CustomerLandRelation = customerLandRelation;
        var req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Land/GetLandInformation`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getCustomerAllLandInfo(landInfo: LandInfo, branch, zone): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        userInfo.Branch.BranchId = branch.BranchId
        //this.request.User = userInfo.User;
        this.request.Branch = branch;
        this.request.Zone = zone;
        this.request.LandInfo = landInfo;


        return this.http.post(`${environment.apiUrl}/Land/GetLandInfoAll`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getLandHistoryDetail(landInfo: LandInfo, historyLandInfoId: string, branch, zone): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        userInfo.Branch.BranchId = branch.BranchId
        this.request.Branch = branch;
        this.request.Zone = zone;
        landInfo.Id = parseInt(historyLandInfoId);
        this.request.LandInfo = landInfo;
        var req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Land/GetLandHistoryDetail`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getPosition(): Promise<any> {
        return new Promise((resolve, reject) => {

            navigator.geolocation.getCurrentPosition(resp => {

                    resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
                },
                err => {
                    reject(err);
                });
        });

    }


    landDocumentsUpload(Image, Video, uploadDocuments: UploadDocuments): Observable<BaseResponseModel> {


        const formData = new FormData();
        formData.append('file', Image);
        formData.append('videofile', Video);
        formData.append('LandInfoId', uploadDocuments.LandInfoId.toString());
        formData.append('LandLatitude', uploadDocuments.LandLatitude);
        formData.append('LandLongitude', uploadDocuments.LandLongitude);
        formData.append('CreatedBy', "Test-test");


        return this.http.post<any>(`${environment.apiUrl}/Land/LandDataUpload`, formData,
        ).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    landDocumentsDelete(uploadDocuments: UploadDocuments): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        this.request.LandInfoData = uploadDocuments;
        this.request.Activity = this.activity;

        var req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Land/DeleteLandDataUpload`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    DeleteChargeCreationDetail(request: LandChargeCreation): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();
        this.request.ChargeCreation = request;
        var req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Land/DeleteChargeCreationDetail`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    GetLandHistory(landInfo: LandInfo): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();

        this.request.LandInfo = landInfo;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.request.User = userInfo.User;
        var req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Land/GetLandHistory`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getData2() {
        return this.http.get(this.url2);
    }


    deleteCustomerWithLand(landCustId) {

        var userInfo = this.userUtilsService.getUserDetails();

        //this.request.CustomerLandRelation = new CustomerLandRelation()
        //this.request.Zone = userInfo.Zone;
        //this.request.Branch = userInfo.Branch;
        //this.request.User = userInfo.User;

        var request = {
            CustomerLandRelation: {
                LandCustID: landCustId
            },
            Zone: userInfo.Zone,
            Branch: userInfo.Branch,
            User: userInfo.User,
            TranId: 0
        }

        var req = JSON.stringify(request);


        return this.http.post(`${environment.apiUrl}/Land/DeleteCustomerWithLand`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    //Find PassBook
    findPassbookCorrection(cnic) {
        var userInfo = this.userUtilsService.getUserDetails();

        var circle = userInfo.UserCircleMappings;
        var circleIds = [];

        circle.forEach(element => {
            circleIds.push(element.CircleId);
        });
        var _circles = JSON.stringify(circleIds)

        var request = {
            Circle: {
                CircleIds: _circles
            },
            Customer: {
                Cnic: cnic
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };

        return this.http.post(`${environment.apiUrl}/Land/FindPassbookCorrectionDetail`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

//Submit Passbook

    changePassbook(cnic, passbook) {
        var userInfo = this.userUtilsService.getUserDetails();

        var request = {
            Customer: {
                Cnic: cnic
            },
            NewPassbookList: passbook,
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };

        var v = JSON.stringify(request);
        console.log(v)

        return this.http.post(`${environment.apiUrl}/Land/PassbookCorrection`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


}
