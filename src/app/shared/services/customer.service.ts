import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';

import {map} from 'rxjs/operators';
import {BaseRequestModel} from '../models/base_request.model';
import {HttpUtilsService} from './http_utils.service';
import {UserUtilsService} from './users_utils.service';
import {BaseResponseModel} from '../models/base_response.model';
import {CreateCustomer} from '../models/customer.model';
import {environment} from 'environments/environment';
import {brands} from "../../mock-api/apps/ecommerce/inventory/data";

@Injectable({
    providedIn: 'root',
})
export class CustomerService {
    public request = new BaseRequestModel();

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService,
        private userUtilsService: UserUtilsService
    ) {
    }

    createCustomerSave(
        customer: CreateCustomer
    ): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Customer = customer;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;

        return this.http
            .post(
                `${environment.apiUrl}/Customer/CreateCustomer`,
                this.request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    getCustomerInfo(request: BaseRequestModel): Observable<BaseResponseModel> {
        return this.http
            .post(
                `${environment.apiUrl}/Customer/GetCustomerInfo`,
                request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    submitNdc(customer: CreateCustomer): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Customer = customer;
        this.request.Branch = userInfo.Branch;

        return this.http
            .post(`${environment.apiUrl}/Customer/SubmitNDC`, this.request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    addCustomerInfo(customer: CreateCustomer): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Customer = customer;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;

        return this.http
            .post(
                `${environment.apiUrl}/Customer/AddCustomerInfo`,
                this.request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    refreshEcib(customer: CreateCustomer): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Customer = customer;

        return this.http
            .post(`${environment.apiUrl}/Customer/RefreshECIB`, this.request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    submitDocument(formData: any): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;

        return this.http
            .post(
                `${environment.apiUrl}/Document/SubmitDocument`,
                this.request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    searchCustomer_bkp(
        customer: CreateCustomer
    ): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        if (customer.CustomerName == null) customer.CustomerName = '';

        if (customer.FatherName == null) customer.FatherName = '';

        if (customer.Cnic == null) customer.Cnic = '';

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Customer = customer;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;

        return this.http
            .post(
                `${environment.apiUrl}/Customer/SearchCustomer`,
                this.request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    searchCustomer(
        customer: CreateCustomer, branch = null, zone = null,
        userDetail: BaseResponseModel = null,
    ): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        if (customer.CustomerName == null) customer.CustomerName = '';

        if (customer.FatherName == null) customer.FatherName = '';

        if (customer.Cnic == null) customer.Cnic = '';
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if (userDetail && userDetail.Zone) {
            userInfo.Zone = userDetail.Zone;
            userInfo.Branch = userDetail.Branch;
        }
        this.request.User = userInfo.User;
        this.request.Customer = customer;
        this.request.Zone = zone;
        this.request.Branch = branch;

        return this.http
            .post(
                `${environment.apiUrl}/Customer/SearchCustomer`,
                this.request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    GetCustomer(customer: CreateCustomer): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Customer = customer;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        var req = JSON.stringify(this.request);

        return this.http
            .post(
                `${environment.apiUrl}/Customer/GetCustomerDetail`,
                this.request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    //Find PassBook
    findPassbookCorrection(cnic) {
        var userInfo = this.userUtilsService.getUserDetails();

        var circle = userInfo.UserCircleMappings;
        var circleIds = [];

        circle.forEach((element) => {
            circleIds.push(element.CircleId);
        });
        var _circles = JSON.stringify(circleIds);

        var request = {
            Circle: {
                CircleIds: _circles,
            },
            Customer: {
                Cnic: cnic,
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone,
        };

        return this.http
            .post(
                `${environment.apiUrl}/Land/FindPassbookCorrectionDetail`,
                request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    //Submit Passbook

    changePassbook(cnic, passbook) {
        var userInfo = this.userUtilsService.getUserDetails();

        var request = {
            Customer: {
                Cnic: cnic,
            },
            NewPassbookList: passbook,
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone,
        };

        return this.http
            .post(`${environment.apiUrl}/Land/PassbookCorrection`, request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    // Phone Cell Get Customer By CNIC

    getCustomerByCnic(cnic, branch?, zone?) {
        var userInfo = this.userUtilsService.getUserDetails();
        var request = {
            Customer: {
                Cnic: cnic,
            },
            TranId: 0,
            Branch: branch,
            User: userInfo.User,
            Zone: zone,
        };

        return this.http
            .post(
                `${environment.apiUrl}/Customer/GetCustomerByCnicForCorrection`,
                request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    updateCustomerPhoneCell(cnic, phoneNumber, cusNumber) {
        var userInfo = this.userUtilsService.getUserDetails();
        var request = {
            Customer: {
                Cnic: cnic,
                CellNumber: phoneNumber,
                CustomerNumber: cusNumber,
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone,
        };

        return this.http
            .post(
                `${environment.apiUrl}/Customer/UpdateCustomerPhoneCell`,
                request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    UploadImagesSetData(Image: any) {
    }

    public UploadImagesCallAPI(Image, CustomerNumber) {
        const formData = new FormData();
        formData.append('file', Image);
        formData.append('Description', 'Profile Picture customer#create');
        formData.append('CustomerNumber', CustomerNumber);
        formData.append('PageNumber', '1');

        return this.http
            .post<any>(
                `${environment.apiUrl}/Document/SubmitDocument`,
                formData
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    getEligibilityRequestData(request_data) {
        return this.http
            .post(
                `${environment.apiUrl}/Customer/GetEligibilityRequests`,
                request_data,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: any) => res));
    }
}
