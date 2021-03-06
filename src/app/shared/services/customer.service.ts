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
import {Loan} from "../models/Loan.model";

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
        customer
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

    submitNdc(customer: CreateCustomer, tranId): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Customer = customer;
        this.request.Branch = userInfo.Branch;
        this.request.TranId = tranId;
        return this.http
            .post(`${environment.apiUrl}/Customer/SubmitNDC`, this.request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    addCustomerInfo(customer: CreateCustomer, tran_id): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Customer = customer;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        this.request.TranId = tran_id;
        return this.http
            .post(
                `${environment.apiUrl}/Customer/AddCustomerInfo`,
                this.request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    refreshEcib(customer: CreateCustomer, tran_id): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.request.User = userInfo.User;
        this.request.Customer = customer;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        this.request.TranId = tran_id;

        return this.http
            .post(`${environment.apiUrl}/Customer/RefreshECIB`, this.request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    submitDocument(request): Observable<BaseResponseModel> {
        return this.http
            .post(
                `${environment.apiUrl}/Document/SubmitDocument`,
                request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    submitDocumentDetails(request): Observable<BaseResponseModel> {
        return this.http
            .post(
                `${environment.apiUrl}/Document/SubmitDocumentDetails`,
                request,
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
        userDetail = null, offset = 0, itemperpage = 10
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

        var request1 = {
            User: userInfo.User,
            Customer: customer,
            Zone: zone,
            Branch: branch,
            Pagination: {
                Offset: offset,
                Limit: itemperpage
            }
        }

        if (!branch && !zone) {

            this.request.Zone = userInfo.Zone;
            this.request.Branch = userInfo.Branch;
        }
        return this.http
            .post(
                `${environment.apiUrl}/Customer/SearchCustomer`,
                request1,
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
    findPassbookCorrection(cnic, zone, branch) {
        var userInfo = this.userUtilsService.getUserDetails();

        var circle = userInfo.UserCircleMappings;
        var circleIds = [];

        circle.forEach((element) => {
            circleIds.push(element.CircleId);
        });
        var _circles = circleIds.toString();

        var request = {
            Circle: {
                CircleIds: _circles,
            },
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
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
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

    public UploadImagesCallAPI(Image, CustomerCnic) {
        const formData = new FormData();
        formData.append('file', Image);
        formData.append('Description', 'Profile Picture customer#create');
        formData.append('CustomerCnic', CustomerCnic);
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

    changeStatus(request: { EligibilityRequest: { Status: string; Id: any } }) {
        return this.http.post(`${environment.apiUrl}/Customer/ChangeEligibilityRequestStatus`, request);
    }

    getImages(request: { EligibilityRequest: { Id: any } }) {
        return this.http.post(`${environment.apiUrl}/Customer/GetEligibilityRequestFiles`, request);
    }

    regenerateEcib(_customer: CreateCustomer, tran_id: any) {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.request.User = userInfo.User;
        this.request.Customer = _customer;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        this.request.TranId = tran_id;

        return this.http
            .post(`${environment.apiUrl}/Customer/RegenerateECIB`, this.request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    addEligibilityRequest(data, tran_id) {
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        this.request.Circle = userInfo?.UserCircleMappings[0];
        this.request.TranId = tran_id;
        this.request.EligibilityRequest = {
            Cnic: data.Cnic,
            NdcFilePath: data.ndc_file,
            ECIBPDFLink: data.ecib_file,
            FatherName: data.FatherName,
            Remarks: data.Remarks,
            Status: data.status
        }
        return this.http
            .post(`${environment.apiUrl}/Customer/AddEligibilityRequest`, this.request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    addFiles(id, file) {
        var formData = new FormData();
        var userInfo = this.userUtilsService.getUserDetails();


        formData.append('Id', id);

        formData.append('File', file);


        return this.http
            .post<any>(`${environment.apiUrl}/Customer/AddEligibilityRequestFiles`, formData)
            .pipe(map((res: BaseResponseModel) => res));
    }

    getCustomerHistory(customer_number: string) {
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        let request = new BaseRequestModel();
        request.User = userInfo.User;
        request.Branch = userInfo.Branch;
        request.Zone = userInfo.Zone;
        if (userInfo.UserCircleMappings?.length > 0)
            request.Circle = userInfo?.UserCircleMappings[0];
        request.Customer = {
            CustomerNumber: customer_number,
        }
        return this.http
            .post(`${environment.apiUrl}/Customer/GetCustomerHistory`, request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    deleteDocument(customer_document: any) {
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        let request = new BaseRequestModel();
        request.User = userInfo.User;
        request.Branch = userInfo.Branch;
        request.Zone = userInfo.Zone;
        if (userInfo.UserCircleMappings?.length > 0)
            request.Circle = userInfo?.UserCircleMappings[0];
        request.CustomerDocument = customer_document;
        return this.http
            .post(`${environment.apiUrl}/Document/DeleteDocument`, request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    getCustomerDocuments(customerobj: any) {
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        let request = new BaseRequestModel();
        request.User = userInfo.User;
        request.Branch = userInfo.Branch;
        request.Zone = userInfo.Zone;
        if (userInfo.UserCircleMappings?.length > 0)
            request.Circle = userInfo?.UserCircleMappings[0];
        request.Customer = customerobj;
        return this.http
            .post(`${environment.apiUrl}/Document/GetCustomerDocuments`, request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }
}
