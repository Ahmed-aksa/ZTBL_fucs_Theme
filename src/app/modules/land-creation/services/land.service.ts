import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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


    public activity = new Activity();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    saveCustomerLandInfo(landInfo: LandInfo, branch?, zone?): Observable<BaseResponseModel> {
        var request = new BaseRequestModel();


        this.activity.ActivityID = 1;
        var userInfo = this.userUtilsService.getUserDetails();
        request.User = userInfo.User;
        request.Branch = branch;
        request.Zone = zone;
        request.LandInfo = landInfo;
        request.Activity = this.activity;
        return this.http.post(`${environment.apiUrl}/Land/SaveCustomerLandInfo`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    saveCustomerLandInfoDetail(landInfoDetails: any, TrainId: any): Observable<BaseResponseModel> {


        var request = new BaseRequestModel();

        this.activity.ActivityID = 1;
        var userInfo = this.userUtilsService.getUserDetails();
        request.User = userInfo.User;
        request.Branch = userInfo.Branch;
        request.Zone = userInfo.Zone;
        request.LandInfoDetailsList = landInfoDetails;
        request.Activity = this.activity;
        request.TranId = TrainId;
        return this.http.post(`${environment.apiUrl}/Land/SaveCustomerLandInfoDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    SaveChargeCreation(request: BaseRequestModel): Observable<BaseResponseModel> {
        return this.http.post(`${environment.apiUrl}/Land/SaveChargeCreation`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    SaveChargeCreationDetail(): Observable<BaseResponseModel> {
        var request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        request.User = userInfo.User;
        request.Branch = userInfo.Branch;
        return this.http.post(`${environment.apiUrl}/Land/SaveChargeCreationDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    SubmitLandInfo(request: BaseRequestModel): Observable<BaseResponseModel> {
        var req = JSON.stringify(request);


        return this.http.post(`${environment.apiUrl}/Land/SubmitLandInfo`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    searchLand(customerLandRelation: CustomerLandRelation, isUserAdmin: boolean, isZoneUser: boolean, branch, zone): Observable<BaseResponseModel> {

        var request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        // if (isUserAdmin || isZoneUser) {
        //     if (customerLandRelation.BranchId != undefined)
        //         userInfo.Branch.BranchId = customerLandRelation.BranchId;
        //     else
        //         userInfo.Branch.BranchId = 0;
        // }
        // if (isUserAdmin) {
        //     if (customerLandRelation.ZoneId != undefined)
        //         userInfo.Zone.ZoneId = customerLandRelation.ZoneId;
        //     else
        //         userInfo.Zone.ZoneId = 0;
        // }
        request.User = userInfo.User;
        request.Branch = branch;
        request.Zone = zone;
        request.CustomerLandRelation = customerLandRelation;
        var req = JSON.stringify(request);


        return this.http.post(`${environment.apiUrl}/Land/GetLandInformation`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getCustomerAllLandInfo(landInfo: LandInfo, branch, zone): Observable<BaseResponseModel> {


        var request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        userInfo.Branch.BranchId = branch.BranchId
        //request.User = userInfo.User;
        request.Branch = branch;
        request.Zone = zone;
        request.LandInfo = landInfo;


        return this.http.post(`${environment.apiUrl}/Land/GetLandInfoAll`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getLandHistoryDetail(landInfo: LandInfo, historyLandInfoId: string, branch, zone): Observable<BaseResponseModel> {


        var request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        userInfo.Branch.BranchId = branch.BranchId
        request.Branch = branch;
        request.Zone = zone;
        landInfo.Id = parseInt(historyLandInfoId);
        request.LandInfo = landInfo;
        var req = JSON.stringify(request);


        return this.http.post(`${environment.apiUrl}/Land/GetLandHistoryDetail`, request,
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


        var userInfo = this.userUtilsService.getUserDetails();
        const formData = new FormData();
        formData.append('file', Image);
        formData.append('videofile', Video);
        formData.append('LandInfoId', uploadDocuments.LandInfoId.toString());
        formData.append('LandLatitude', uploadDocuments.LandLatitude);
        formData.append('LandLongitude', uploadDocuments.LandLongitude);
        formData.append('CreatedBy', userInfo.User.UserId);


        return this.http.post<any>(`${environment.apiUrl}/Land/LandDataUpload`, formData,
        ).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    landDocumentsDelete(uploadDocuments: UploadDocuments): Observable<BaseResponseModel> {
        var request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        request.Branch = userInfo.Branch;
        request.Zone = userInfo.Zone;
        request.LandInfoData = uploadDocuments;
        request.Activity = this.activity;

        var req = JSON.stringify(request);


        return this.http.post(`${environment.apiUrl}/Land/DeleteLandDataUpload`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    DeleteChargeCreationDetail(request1: LandChargeCreation): Observable<BaseResponseModel> {

        var request = new BaseRequestModel();
        request.ChargeCreation = request1;
        return this.http.post(`${environment.apiUrl}/Land/DeleteChargeCreationDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    GetLandHistory(landInfo: LandInfo): Observable<BaseResponseModel> {

        var request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();

        request.LandInfo = landInfo;
        request.Zone = userInfo.Zone;
        request.Branch = userInfo.Branch;
        request.User = userInfo.User;
        var req = JSON.stringify(request);


        return this.http.post(`${environment.apiUrl}/Land/GetLandHistory`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getData2() {
        return this.http.get(this.url2);
    }


    deleteCustomerWithLand(landCustId) {

        var userInfo = this.userUtilsService.getUserDetails();

        //request.CustomerLandRelation = new CustomerLandRelation()
        //request.Zone = userInfo.Zone;
        //request.Branch = userInfo.Branch;
        //request.User = userInfo.User;

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


        return this.http.post(`${environment.apiUrl}/Land/DeleteCustomerWithLand`, request,
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

        return this.http.post(`${environment.apiUrl}/Land/FindPassbookCorrectionDetail`, request,
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


        return this.http.post(`${environment.apiUrl}/Land/PassbookCorrection`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


}
