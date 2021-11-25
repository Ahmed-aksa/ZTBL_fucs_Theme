import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CommonService } from './common.service';
import { DatePipe } from '@angular/common';
import { BaseRequestModel } from '../models/base_request.model';
import { Activity } from 'app/modules/user-management/activity/activity.model';
import { HttpUtilsService } from './http_utils.service';
import { UserUtilsService } from './users_utils.service';
import { environment } from 'environments/environment';
import { BaseResponseModel } from '../models/base_response.model';
import { map } from 'rxjs/operators';
import { Customer } from '../models/deceased_customer.model';

@Injectable({
    providedIn: 'root',
})
export class LoanUtilizationService {
    dod: Date;

    public request = new BaseRequestModel();
    public activity = new Activity();

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService,
        private userUtilsService: UserUtilsService,
        private datePipe: DatePipe,
        private _common: CommonService
    ) {}

    GetLoanDetail(value) {
        this.request = new BaseRequestModel();
        this.request.LoanUtilization = {
            UtilizationDetail: { LoanCaseNo: value },
        };
        this.request.TranId = 2830;
        (this.request.DEVICELOCATION = {
            BTSID: '0',
            BTSLOC: '',
            LAT: '33.65898',
            LONG: '73.057665',
            SRC: 'GPS',
        }),
            (this.request.Circle = {
                CircleIds: '53444,53443,53442,53441',
            }),
            (this.request.doPerformOTP = false);
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;

        return this.http
            .post(
                `${environment.apiUrl}/LoanUtilization/GetLoanDetail`,
                this.request,
                { headers: this.httpUtils.getHTTPHeaders() }
            )
            .pipe(map((res: BaseResponseModel) => res));
    }
    searchUtilization(
        loanUtilization,
        userDetail: BaseResponseModel = null
    ): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        // if (loanUtilization.CustomerName == null)
        // loanUtilization.CustomerName = "";

        // if (loanUtilization.FatherName == null)
        // loanUtilization.FatherName = "";

        // if (loanUtilization.Cnic == null)
        // loanUtilization.Cnic = "";

        var userInfo = this.userUtilsService.getUserDetails();
        if (userDetail && userDetail.Zone) {
            userInfo.Zone = userDetail.Zone;
            userInfo.Branch = userDetail.Branch;
        }
        this.request.User = userInfo.User;
        this.request.LoanUtilization = { UtilizationDetail: loanUtilization };
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;

        return this.http
            .post(
                `${environment.apiUrl}/LoanUtilization/SearchUtilizations`,
                this.request,
                { headers: this.httpUtils.getHTTPHeaders() }
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    searchLoanUtilization(
        loanUtilization,
        userDetail: BaseResponseModel = null,
        fromdate: string,
        todate: string,
        Limit,
        Offset
    ): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        // if (loanUtilization.CustomerName == null)
        // loanUtilization.CustomerName = "";

        // if (loanUtilization.FatherName == null)
        // loanUtilization.FatherName = "";

        // if (loanUtilization.Cnic == null)
        // loanUtilization.Cnic = "";

        var userInfo = this.userUtilsService.getUserDetails();
        if (userDetail && userDetail.Zone) {
            userInfo.Zone = userDetail.Zone;
            userInfo.Branch = userDetail.Branch;
        }
        this.request.User = userInfo.User;
        // this.request.LoanUtilization.FromeDate=this._common.dateToString(loanUtilization.from)
        // this.request.LoanUtilization.ToDate=this._common.dateToString(loanUtilization.to)
        

        if (loanUtilization) {
            this.request.LoanUtilization = {
                UtilizationDetail: { LoanCaseNo: loanUtilization },
            };
        } else {
            loanUtilization = null;
            this.request.LoanUtilization = {
                UtilizationDetail: { LoanCaseNo: loanUtilization },
            };
        }
        this.request.LoanUtilization['FromDate'] = fromdate;
        this.request.LoanUtilization['ToDate'] = todate;

        this.request.LoanUtilization['Offset'] = Offset;
        this.request.LoanUtilization['Limit'] = Limit;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;

        return this.http
            .post(
                `${environment.apiUrl}/LoanUtilization/SearchLoanForUtilization`,
                this.request,
                { headers: this.httpUtils.getHTTPHeaders() }
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    save(value) {
        value.Status = 'P';
        

        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        (this.request.Circle = {
            CircleIds: '53444,53443,53442,53441',
        }),
            (this.request.DEVICELOCATION = {
                BTSID: '0',
                BTSLOC: '',
                LAT: '33.65898',
                LONG: '73.057665',
                SRC: 'GPS',
            }),
            (this.request.LoanUtilization = { UtilizationDetail: value });
        this.request.TranId = 2830;
        this.request.doPerformOTP = false;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.request.User = userInfo.User;

        return this.http
            .post<any>(
                `${environment.apiUrl}/LoanUtilization/SaveUpdateUtilization`,
                this.request
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    statusChange(value) {
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        (this.request.Circle = {
            CircleIds: '53444,53443,53442,53441',
        }),
            (this.request.DEVICELOCATION = {
                BTSID: '0',
                BTSLOC: '',
                LAT: '33.65898',
                LONG: '73.057665',
                SRC: 'GPS',
            }),
            (this.request.LoanUtilization = { UtilizationDetail: value });
        this.request.TranId = 2830;
        this.request.doPerformOTP = false;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.request.User = userInfo.User;
        return this.http
            .post<any>(
                `${environment.apiUrl}/LoanUtilization/ChangeUtilizationStatus`,
                this.request
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    SaveMedia(file, loanutilization: any, val: string) {
        //append work

        var formData = new FormData();

        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        (this.request.Circle = {
            CircleIds: '53444,53443,53442,53441',
        }),
            (this.request.DEVICELOCATION = {
                BTSID: '0',
                BTSLOC: '',
                LAT: '33.65898',
                LONG: '73.057665',
                SRC: 'GPS',
            }),
            // this.request.LoanUtilization={"UtilizationDetail":value}
            (this.request.TranId = 2830);
        this.request.doPerformOTP = false;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.request.User = userInfo.User;
        
        var req = JSON.stringify(this.request);

        formData.append('UtilizationID', loanutilization.ID);
        formData.append('Lat', loanutilization.Lat);
        formData.append('Lng', loanutilization.Lng);
        formData.append('UserID', userInfo.User.UserId);
        formData.append('IsVideo', val);
        formData.append('File', file);

        );
        );
        );
        );
        );
        );

        return this.http
            .post<any>(
                `${environment.apiUrl}/LoanUtilization/UploadUtlization`,
                formData
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    GetMedia(data) {
        this.request = new BaseRequestModel();
        this.request.LoanUtilization = {
            UtilizationDetail: {
                LoanCaseNo: data.LoanCaseNo,
                LoanDisbID: data.LoanDisbID,
            },
        };
        this.request.TranId = 2830;
        (this.request.DEVICELOCATION = {
            BTSID: '0',
            BTSLOC: '',
            LAT: '33.65898',
            LONG: '73.057665',
            SRC: 'GPS',
        }),
            (this.request.Circle = {
                CircleIds: '53444,53443,53442,53441',
            }),
            (this.request.doPerformOTP = false);
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;

        return this.http
            .post(
                `${environment.apiUrl}/LoanUtilization/GetUploadedUtilizations`,
                this.request,
                { headers: this.httpUtils.getHTTPHeaders() }
            )
            .pipe(map((res: BaseResponseModel) => res));
    }
    DeleteMedia(id: string) {
        this.request = new BaseRequestModel();
        this.request.LoanUtilization = { UtilizationDetail: { ID: id } };
        this.request.TranId = 2830;
        (this.request.DEVICELOCATION = {
            BTSID: '0',
            BTSLOC: '',
            LAT: '33.65898',
            LONG: '73.057665',
            SRC: 'GPS',
        }),
            (this.request.Circle = {
                CircleIds: '53444,53443,53442,53441',
            }),
            (this.request.doPerformOTP = false);
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;

        return this.http
            .post(
                `${environment.apiUrl}/LoanUtilization/DeleteUtilizationFile`,
                this.request,
                { headers: this.httpUtils.getHTTPHeaders() }
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    GetLoanGL(value) {
        this.request = new BaseRequestModel();
        this.request.LoanUtilization = {
            UtilizationDetail: { LoanCaseNo: value },
        };
        this.request.TranId = 2830;
        (this.request.DEVICELOCATION = {
            BTSID: '0',
            BTSLOC: '',
            LAT: '33.65898',
            LONG: '73.057665',
            SRC: 'GPS',
        }),
            (this.request.Circle = {
                CircleIds: '53444,53443,53442,53441',
            }),
            (this.request.doPerformOTP = false);

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = {
            BranchId: '102',
            BranchCode: '20238',
            Name: 'NOORPUR TOWN',
            WorkingDate: '11012021',
            Id: 0,
        };
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        return this.http
            .post(
                `${environment.apiUrl}/LoanUtilization/GetGLForLoan`,
                this.request,
                { headers: this.httpUtils.getHTTPHeaders() }
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    //   SearchDeceasedCustomer(){
    //
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
    //     
    //

    //     return this.http.post(`${environment.apiUrl}/Customer/SearchDeceasedCustomer`, req,
    //     { headers: this.httpUtils.getHTTPHeaders() }).pipe(
    //       map((res: BaseResponseModel) => res)
    //     );
    //   }

    SearchDeceasedCustomer(
        customer: Customer,
        isUserAdmin: boolean,
        isZoneUser: boolean
    ): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        var deceasedInfo = new Customer();
        deceasedInfo = {
            CustomerName: '',
            Cnic: '',
            FatherName: '',
            CustomerStatus: '-1',
        };
        this.request.SearchData = {
            CurrentIndex: '0',
            Count: '1000',
        };
        // this.request.Customer = deceasedInfo
        this.request.Customer = customer;
        this.request.Customer['CustomerStatus'] = '-1';
        this.request.TranId = 0;
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;

        return this.http
            .post(
                `${environment.apiUrl}/Customer/SearchDeceasedCustomer`,
                this.request,
                { headers: this.httpUtils.getHTTPHeaders() }
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    GetPendingDeceasedCustomerByCnic() {
        var deceasedInfo = new Customer();
        this.request = new BaseRequestModel();
        deceasedInfo = {
            CustomerName: null,
            Cnic: '3840320934203',
            FatherName: null,
            CustomerStatus: null,
        };

        this.request.Customer = deceasedInfo;
        this.request.TranId = 0;
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;

        return this.http
            .post(
                `${environment.apiUrl}/Customer/GetPendingDeceasedCustomerByCnic`,
                this.request,
                { headers: this.httpUtils.getHTTPHeaders() }
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    MarkAsDeceasedCustomer(form, file: File) {
        var deceasedInfo = new Customer();

        this.request = new BaseRequestModel();
        var formData = new FormData();
        var userInfo = this.userUtilsService.getUserDetails();
        var a = userInfo.User.BranchId;

        formData.append('CustomerCnic', form.Cnic);

        formData.append('PPNo', userInfo.User.UserName);

        formData.append('UserID', userInfo.User.UserId);

        formData.append('BranchID', userInfo.User.BranchId);

        formData.append('NadraNo', form.NadraNo);

        formData.append(
            'IsNadraCertificateVerified',
            form.IsNadraCertificateVerified
        );

        let dod = this.datePipe.transform(form.DateofDeath, 'ddMMyyyy'); //converstion date to string
        formData.append('DateOfDeath', dod);

        formData.append('Remarks', form.MakerRemarks);

        if (form.LegalHeirPay == 'N') {
            formData.delete('OtherSourceOfIncome');
        } else {
            formData.append('OtherSourceOfIncome', form.DetailSourceIncome);
        }

        formData.append('LegalHeirPay', form.LegalHeirPay);

        formData.append('File', file);

        formData.append('DeceasedID', form.DeceasedID);
        if (formData.append) {
            return this.http
                .post<any>(
                    `${environment.apiUrl}/Customer/MarkAsDeceasedCustomer`,
                    formData
                )
                .pipe(map((res: BaseResponseModel) => res));
            // return this.http.post(`${environment.apiUrl}/Customer/MarkAsDeceasedCustomer`, formData,
            //   { headers: this.httpUtils.getHTTPHeaders() }).pipe(
            //     map((res: BaseResponseModel) => res)
            //   );
        }
    }

    GetListOfRejectedDeceasedPerson() {
        var deceasedInfo = new Customer();
        this.request = new BaseRequestModel();
        deceasedInfo.Cnic = '';
        this.request.Customer = deceasedInfo;
        this.request.TranId = 0;
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;

        return this.http
            .post(
                `${environment.apiUrl}/Customer/GetListOfRejectedDeceasedPerson`,
                this.request,
                { headers: this.httpUtils.getHTTPHeaders() }
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    SubmitCustomerNADRA() {
        this.request = new BaseRequestModel();
        this.request.TranId = 0;
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;

        return this.http
            .post(
                `${environment.apiUrl}/Customer/SubmitCustomerNADRA`,
                this.request,
                { headers: this.httpUtils.getHTTPHeaders() }
            )
            .pipe(map((res: BaseResponseModel) => res));
    }
}
