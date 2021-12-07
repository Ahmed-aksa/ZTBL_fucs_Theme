import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {Loan, LoanApplicationHeader} from "../../../shared/models/Loan.model";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {JournalVocherData} from "../models/journal_voucher.model";
import {HttpUtilsService} from "../../../shared/services/http_utils.service";
import {Activity} from 'app/shared/models/activity.model';

@Injectable({
    providedIn: 'root'
})
export class JournalVoucherService {
    pageIndex = 1;
    size = 10;
    public request = new BaseRequestModel();
    public activity = new Activity();


    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    saveApplicationHeader(loanReq: LoanApplicationHeader): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();

        var loanInfo = new Loan();
        loanInfo.ApplicationHeader = loanReq;

        this.request.Loan = loanInfo;
        this.request.TranId = 0;
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        var req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Loan/SaveApplicationHeader`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    createJVTransaction(jv: JournalVocherData): Observable<BaseResponseModel> {
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        //jv.UserBranchID = userInfo.Branch;
        //jv.zo = userInfo.Zone;
        var activity = {ActivityID: 1};
        this.activity.ActivityID = 1;

        var request = {
            Activity: activity,
            Branch: userInfo.Branch,
            DeviceLocation: {
                BtsId: "0",
                BtsLoc: "",
                Lat: "0.000000000000000",
                Long: "0.000000000000000",
                // Lat: "33.703988333333335",
                // Long: "73.06844500000001",
                Src: "GPS"
            },
            doPerformOTP: false,
            JournalVoucher: {
                JournalVoucherData: jv
            },
            TranId: 10043,
            User: userInfo.User,
            Zone: userInfo.Zone
        };

        var req = JSON.stringify(request)


        return this.http.post(`${environment.apiUrl}/JournalVoucher/CreateJVTransaction`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getJVMasterCodes(category: number, code: string) {

        var request = {
            JournalVoucher: {
                JvMasterCodes: {
                    JvCategory: category,
                    Code: code
                }
            },
            TranId: 0
        };
        var req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/JournalVoucher/GetJVMasterCodes`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getJVMasterCodesDetail(code: string) {
        var userInfo = this.userUtilsService.getUserDetails();
        var request = {
            JournalVoucher: {
                JvMasterCodes: {
                    Code: code
                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };
        //var req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/JournalVoucher/GetJVCodeDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    deleteJv(trDId: string) {
        var userInfo = this.userUtilsService.getUserDetails();
        var request = {
            JournalVoucher: {
                JournalVoucherData: {
                    TransactionDetailID: trDId,

                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };

        return this.http.post(`${environment.apiUrl}/JournalVoucher/DeleteTransactionDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getGLForLC(code: string) {

        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        var circle = userInfo.UserCircleMappings;
        var circleIds = [];

        circle.forEach(element => {
            circleIds.push(element.CircleId);
        });
        var _circles = JSON.stringify(circleIds)
        //
        var request = {
            JournalVoucher: {
                GLforJV: {
                    LCNo: code
                }
            },
            Circle: {
                CircleIds: _circles
            },
            TranId: 0,
            Branch: userInfo.Branch,
        };
        //var req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/JournalVoucher/GetGLForJv`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    async getChildNodesWithCode(code: string) {

        var userInfo = this.userUtilsService.getUserDetails();
        var request = {
            JournalVoucher: {
                JvMasterCodeDetail: {
                    ParentDetailId: code
                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };


        var response = await this.http.post(`${environment.apiUrl}/JournalVoucher/GetChildNodesWithCode`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).toPromise();
        return response;
    }

    getSearchJvTransactions(category: string, nature: string, manualVoucher: string, trDate: string, branch = null, zone = null) {
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        var request = {
            JournalVoucher: {
                JournalVoucherData: {
                    TransactionStatus: category,
                    Nature: nature,
                    ManualVoucherNo: manualVoucher,
                    TransactionDate: trDate
                }
            },
            TranId: 0,
            Branch: branch,
            User: userInfo.User,
            Zone: zone
        };


        return this.http.post(`${environment.apiUrl}/JournalVoucher/SearchJvTransactions?page=${this.pageIndex}&size=${this.size}`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getChangeTransactionStatusJV(trId: string, status: string, remarks: string) {


        var userInfo = this.userUtilsService.getUserDetails();
        var request = {
            JournalVoucher: {
                JournalVoucherData: {
                    TransactionStatus: status,
                    TransactionID: trId,
                    Remarks: remarks
                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };


        return this.http.post(`${environment.apiUrl}/JournalVoucher/ChangeTransactionStatusJV`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    bindGridWithTrDetail(trId: string) {


        var userInfo = this.userUtilsService.getUserDetails();
        var request = {
            JournalVoucher: {
                JournalVoucherData: {
                    TransactionID: trId,
                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };


        return this.http.post(`${environment.apiUrl}/JournalVoucher/BindGridWithTrDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getTransactionByID(trId: string) {


        var userInfo = this.userUtilsService.getUserDetails();
        var request = {
            JournalVoucher: {
                JournalVoucherData: {
                    TransactionID: trId,
                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };


        return this.http.post(`${environment.apiUrl}/JournalVoucher/GetTransactionByID`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

}
