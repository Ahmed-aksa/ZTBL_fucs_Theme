import {BaseRequestModel} from "../models/base_request.model";
import {Injectable} from "@angular/core";
import {BaseResponseModel} from "../models/base_response.model";
import {RecoveryDataModel} from "../../modules/journal-voucher/models/recovery_data.model";
import {HttpClient} from "@angular/common/http";
import {UserUtilsService} from "./users_utils.service";
import {Observable} from "rxjs";
import {HttpUtilsService} from "./http_utils.service";
import {Activity} from "../models/activity.model";
import {LandInfo} from "../models/land_info.model";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class RecoveryService {

    public request = new BaseRequestModel();
    public activity = new Activity();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }


    saveCustomerLandInfo(landInfo: LandInfo): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();


        this.activity.ActivityID = 1;
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        this.request.LandInfo = landInfo;
        this.request.Activity = this.activity;

        var req = JSON.stringify(this.request);

       
        return this.http.post(`${environment.apiUrl}/Land/SaveCustomerLandInfo`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    saveCustomerLandInfoDetail(landInfoDetails: any): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();

        this.activity.ActivityID = 1;
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        this.request.LandInfoDetailsList = landInfoDetails;
        this.request.Activity = this.activity;
        var req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Land/SaveCustomerLandInfoDetail`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    SaveChargeCreation(request: BaseRequestModel): Observable<BaseResponseModel> {

        var req = JSON.stringify(request);

       
        return this.http.post(`${environment.apiUrl}/Land/SaveChargeCreation`, req,
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

        return this.http.post(`${environment.apiUrl}/Land/SaveChargeCreationDetail`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    SubmitLandInfo(): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        var req = JSON.stringify(this.request);

       
        return this.http.post(`${environment.apiUrl}/Land/SubmitLandInfo`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getLoanTransaction(transactionDate: string, voucherNo: string, instrumentNO: string, recoveryType, lcno: string, status: string, currentIndex: string, count: string): Observable<BaseResponseModel> {
        debugger
        var userInfo = this.userUtilsService.getUserDetails();
        console.log('user info');
        console.log(userInfo);
        var recoveryData = {RecoveryType: recoveryType};
        var recovery = {
            TransactionDate: transactionDate,
            VoucherNo: voucherNo,
            InstrumentNO: instrumentNO,
            Lcno: lcno,
            Status: status,
            CurrentIndex: currentIndex,
            Count: count,
            WorkingDate: userInfo.Branch.WorkingDate,
            RecoveryData: recoveryData
        };
        var request = {
            Zone: userInfo.Zone,
            Branch: userInfo.Branch,
            doPerformOTP: false,
            TranId: 0,
            DeviceLocation: {},
            Recovery: recovery
        };

        console.log("getLoanTransaction request");
        console.log(request);
        return this.http.post(`${environment.apiUrl}/Recovery/GetLoanTransaction`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getTransactiondetailByID(lnTransactionID: string, lcno: string): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        var req = JSON.stringify(this.request);

        var branch = {BranchID: userInfo.Branch.BranchId};
        var recovery = {
            LnTransactionID: lnTransactionID, Lcno: lcno, RecoveryData: {}
        };
        var request = {Branch: branch, Recovery: recovery};
        var req = JSON.stringify(request);

        return this.http.post(`${environment.apiUrl}/Recovery/GetTransactiondetailByID`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getAccountDetails(LoanDisbID: string, type: string, recoveryType: string, effectiveDate: string): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;


        var branch = {BranchId: userInfo.Branch.BranchId, WorkingDate: userInfo.Branch.WorkingDate};
        var recovery = {
            Type: type,
            DisbursementGL: {LoanDisbID: LoanDisbID},
            RecoveryData: {RecoveryType: recoveryType, EffectiveDate: effectiveDate}
        };
        var request = {Branch: branch, Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/GetAccountDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getSubProposalGL(TransactionType: string, ForInterBranch: boolean, ForSBs: boolean, LoanCaseNo: string, circleID: string, contraBranchCode, mode: number): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        var req = JSON.stringify(this.request);

        var branch = {BranchId: userInfo.Branch.BranchId};
        var recovery = {
            RecoveryData: {ContraBranchCode: contraBranchCode},
            SubProposalGL: {
                ForInterBranch: ForInterBranch,
                ForSBs: ForSBs,
                TransactionType: TransactionType,
                LoanCaseNo: LoanCaseNo,
                CircleID: circleID,
                Mode: mode
            }
        };
        var request = {Branch: branch, Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/GetSubProposalGL`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getDisbursementByGL(SanctionID: string): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        var recovery = {DisbursementGL: {SanctionID: SanctionID}};
        var request = {Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/GetDisbursementByGL`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getCoordinatorsByID(RecoveryThroughType: string, LoanCaseNo: string): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        var req = JSON.stringify(this.request);

        var recovery = {RecoveryData: {RecoveryThroughType: RecoveryThroughType, LoanCaseNo: LoanCaseNo}};
        var request = {Branch: userInfo.Branch, Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/GetcoordinatorsByID`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    saveRecoveryData(RecoveryData: RecoveryDataModel): Observable<BaseResponseModel> {
        debugger
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        RecoveryData.UserID = userInfo.User.UserId;


        var activity = {ActivityID: 1};
        var recovery = {RecoveryData: RecoveryData};

        var request = {
            Activity: activity,
            Branch: userInfo.Branch,
            DeviceLocation: {
                BtsId: "0",
                BtsLoc: "",
                Lat: "0.000000000000000",
                Long: "0.000000000000000",
                Src: "GPS"
            },
            doPerformOTP: false,
            Recovery: recovery,
            TranId: 0,
            User: userInfo.User,
            Zone: userInfo.Zone
        };


        var req = JSON.stringify(request);
        console.log('saveRecoveryData request packet');
        console.log(request);

        return this.http.post(`${environment.apiUrl}/Recovery/SaveRecoveryData`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    submitRecovery(transactionID: string, remarks: string, disbursementID: string, recoveryType: string, tranDate: string): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        var user = {UserId: userInfo.User.UserId};
        var recovery = {
            RecoveryData: {
                DisbursementID: disbursementID,
                TransactionID: transactionID,
                Remarks: remarks,
                RecoveryType: recoveryType,
                TranDate: tranDate
            }
        };
        var request = {Branch: userInfo.Branch, User: user, Recovery: recovery};
        console.log('SubmitRecovery request packet');
        console.log(request);
       
        return this.http.post(`${environment.apiUrl}/Recovery/SubmitRecovery`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    deleteRecovery(transactionID: string, recoveryType: string): Observable<BaseResponseModel> {

        var userInfo = this.userUtilsService.getUserDetails();
        var recovery = {RecoveryData: {TransactionID: transactionID, RecoveryType: recoveryType}};
        var request = {User: userInfo.User, Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/DeleteRecovery`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getLoanApplicationsInquiry(lcNo: string, LnTransactionID: string): Observable<BaseResponseModel> {

        var userInfo = this.userUtilsService.getUserDetails();
        var branch = {BranchId: userInfo.Branch.BranchId};
        var recovery = {Lcno: lcNo, LnTransactionID: LnTransactionID};
        var request = {Branch: branch, Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/GetLoanApplicationsInquiry`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getLoanApplicationsInquiryDisbursment(LnTransactionID: string): Observable<BaseResponseModel> {


        var recovery = {LnTransactionID: LnTransactionID};
        var request = {Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/GetLoanApplicationsInquiryDisbursment`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getViewLoanDocument(documentType: string, documentId: string): Observable<BaseResponseModel> {

        var ViewDocumnets = {ID: documentId, Type: documentType};
        var request = {ViewDocumnets: ViewDocumnets};

        return this.http.post(`${environment.apiUrl}/Recovery/GetLoanApplicationsInquiryDisbursment`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getCircles(): Observable<BaseResponseModel> {

        var userInfo = this.userUtilsService.getUserDetails();
        var request = {Branch: userInfo.Branch, TranId: 0};

        return this.http.post(`${environment.apiUrl}/Recovery/GetCircles`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getReceiptDetail(recoveryData): Observable<BaseResponseModel> {

        var userInfo = this.userUtilsService.getUserDetails();
        var request = {
            User: userInfo.User, Branch:
            userInfo.Branch,
            Recovery: {
                RecoveryData: {
                    TransactionID: recoveryData.TransactionID,
                    DisbursementID: recoveryData.DisbursementID,
                    BranchWorkingDate: recoveryData.BranchWorkingDate,
                    ReceiptNo: recoveryData.ReceiptId
                }
            }
        };
        // var req = JSON.stringify(request)
        // console.log(req)
       
        return this.http.post(`${environment.apiUrl}/Recovery/GetReceiptDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getReceiptDetailSubmit(recoveryData): Observable<BaseResponseModel> {

        var userInfo = this.userUtilsService.getUserDetails();
        var request = {
            User: userInfo.User, Branch:
            userInfo.Branch,
            Recovery: {
                RecoveryData: {
                    TransactionID: recoveryData.TransactionID,
                    DisbursementID: recoveryData.DisbursementID,
                    BranchWorkingDate: recoveryData.BranchWorkingDate,
                    ReceiptNo: recoveryData.ReceiptId
                }
            }
        };
        // var req = JSON.stringify(request)
        // console.log(req)
       
        return this.http.post(`${environment.apiUrl}/Recovery/GetReceiptDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    updateSignature(file, TransactionID: string, ReceiptId: string): Observable<BaseResponseModel> {

        var request = {ParentDocId: TransactionID, ImageBase64: file, ReferenceNo: ReceiptId};
       
        return this.http.post(`${environment.apiUrl}/Recovery/UploadSignaturePortal`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );


    }
}
