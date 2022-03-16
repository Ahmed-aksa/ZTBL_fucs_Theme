import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {BaseRequestModel} from '../models/base_request.model';
import {Activity} from 'app/modules/user-management/activity/activity.model';
import {HttpUtilsService} from './http_utils.service';
import {UserUtilsService} from './users_utils.service';
import {CommonService} from './common.service';
import {Customer} from '../models/deceased_customer.model';
import {environment} from 'environments/environment';
import {map} from 'rxjs/operators';
import {BaseResponseModel} from '../models/base_response.model';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ApkUploadService {
    public request = new BaseRequestModel();
    public activity = new Activity();

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService,
        private userUtilsService: UserUtilsService,
        private _common: CommonService,
        private datePipe: DatePipe,
    ) {
    }

    // GetDeceasedCustomer(form, final_branch, final_zone) {
    //     var deceasedInfo = new Customer();
    //     deceasedInfo = form;
    //     this.request = new BaseRequestModel();
    //     this.request.Customer = deceasedInfo;
    //     this.request.TranId = 0;
    //     var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle()
    //     this.request.User = userInfo.User;
    //     this.request.Zone = final_zone
    //     this.request.Branch = final_branch
    //     this.activity.ActivityID = 1;
    //     this.request.Activity = this.activity;
    //     return this.http
    //         .post(
    //             `${environment.apiUrl}/Customer/GetDeceasedCustomer`,
    //             this.request,
    //             {headers: this.httpUtils.getHTTPHeaders()}
    //         )
    //         .pipe(map((res: BaseResponseModel) => res));
    // }

    FileUpload(file: File) {

        this.request = new BaseRequestModel();
        var formData = new FormData();
        var userInfo = this.userUtilsService.getUserDetails();

        formData.append('EnteredBy', userInfo.User.UserId);
        formData.append('File', file);

        console.log("File: "+ formData.get('File'))


        if (formData.append) {
            return this.http
                .post<any>(
                    `${environment.apiUrl}/Document/UploadGeneralDocument`,
                    formData
                )
                .pipe(map((res: BaseResponseModel) => res));
        }
    }

    GetGeneralDocuments(Limit, Offset): Observable<BaseResponseModel> {

        var request = new BaseRequestModel();

        request.Pagination={
            "Limit" :Number(Limit),
            "Offset":Number(Offset)
        }

        return this.http.post(`${environment.apiUrl}/Document/GetGeneralDocuments`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


}
