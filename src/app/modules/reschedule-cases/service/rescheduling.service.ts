/* eslint-disable eol-last */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';

import {BaseRequestModel} from 'app/shared/models/base_request.model';
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {HttpUtilsService} from "../../../shared/services/http_utils.service";
import {Activity} from "../../../shared/models/activity.model";
import {CustomersLoanApp, Loan, MakeReschedule, ReschedulingList} from 'app/shared/models/Loan.model';
import {DatePipe} from "@angular/common";


@Injectable({
    providedIn: 'root'
})
export class ReschedulingService {

    request = new BaseRequestModel();
    activity = new Activity();
    CustomersLoanApp = new CustomersLoanApp();
    MakeReschedule = new MakeReschedule();
    ReschedulingList: ReschedulingList[] = [];
    Rescheduling = new ReschedulingList();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService, private datePipe: DatePipe) {
    }

    generalFunction() {
        this.request = new BaseRequestModel();
        this.request.TranId = 0;
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        var selectedCircleId = "";
        if (userInfo.UserCircleMappings?.length > 0) {
            userInfo.UserCircleMappings.forEach(function (value, key) {

                if (userInfo.UserCircleMappings.length == (key + 1)) {
                    selectedCircleId += value.CircleId;
                } else {
                    selectedCircleId += value.CircleId + ",";
                }
            })
        }

        this.request.Circle = {
            CircleIds: selectedCircleId
        }
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        return this.request;
    }

    generalFun() {
        this.request = new BaseRequestModel();
        this.request.TranId = 0;
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        return this.request;
    }

    GetRescheduling(res, branch, zone): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();
        var loanInfo = new Loan();
        this.generalFunction()
        this.CustomersLoanApp = res
        loanInfo.CustomersLoanApp = this.CustomersLoanApp
        this.request.Loan = loanInfo
        var req = JSON.stringify(this.request);
        this.request.Branch = branch;
        this.request.Zone = zone;
        return this.http.post(`${environment.apiUrl}/Loan/GetRescheduling`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    SaveMakeRescheduleLoan(res: MakeReschedule, branch, zone): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        var loanInfo = new Loan();
        this.generalFunction()
        this.MakeReschedule = res
        loanInfo.MakeReschedule = this.MakeReschedule
        this.request.Loan = loanInfo
        this.request.Activity = this.activity;
        var req = JSON.stringify(this.request);
        this.request.Branch = branch;
        this.request.Zone = zone;
        return this.http.post(`${environment.apiUrl}/Loan/SaveMakeRescheduleLoan`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    SubmitRescheduleData(rescheduling: MakeReschedule, branch, zone): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();
        var loanInfo = new Loan();
        this.generalFunction()

        let loanResch = rescheduling.LoanReschID;
        this.MakeReschedule.LoanReschID = loanResch;
        this.MakeReschedule.Remarks = "ok"
        loanInfo.MakeReschedule = this.MakeReschedule
        this.request.Loan = loanInfo
        this.request["DeviceLocation"] = {
            BtsId: "0",
            BtsLoc: "",
            id: 0,
            Lat: "0.0",
            Lng: "0.0",
            Src: "BTS",
            time: "0"
        }
        var req = JSON.stringify(this.request);
        this.request.Branch = branch;
        this.request.Zone = zone;

        return this.http.post(`${environment.apiUrl}/Loan/SubmitRescheduleData`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    CancelRescheduleData(rescheduling: MakeReschedule, branch, zone): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.generalFunction()
        var loanInfo = new Loan();
        this.MakeReschedule.LoanReschID = rescheduling.LoanReschID
        loanInfo.MakeReschedule = this.MakeReschedule
        this.request.Loan = loanInfo
        this.request.Branch = branch;
        this.request.Zone = zone;
        var req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/Loan/CancelRescheduleData`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetDisbursementByGl(id): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.generalFunction();
        var loanInfo = new Loan();
        this.MakeReschedule.LoanAppSanctionID = id
        loanInfo.MakeReschedule = this.MakeReschedule
        this.request.Loan = loanInfo
        var req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Loan/GetDisbursementByGl`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    AddReschedulLoanInstallment(res): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();
        var loanInfo = new Loan();
        this.generalFun();
        this.ReschedulingList = res
        loanInfo.ReschedulingList = this.ReschedulingList
        this.request.Loan = loanInfo
        var req = JSON.stringify(this.request);
        // Getting error because of branch
        return this.http.post(`${environment.apiUrl}/Loan/AddReschedulLoanInstallment`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    RescheduleSearch(search, branch, zone): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();
        var loanInfo = new Loan();
        this.generalFun()
        loanInfo.Status = search.Status;
        loanInfo.Appdt = this.datePipe.transform(search.TrDate, 'ddMMyyyy');
        loanInfo.LcNo = search.Lcno;
        this.request.Loan = loanInfo;
        this.request.Branch = branch;
        this.request.Zone = zone;
        var req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/Loan/RescheduleSearch`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetSubProposalGL(lCNo, branch, zone): Observable<BaseResponseModel> {
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        var circleIds = [];

        if (userInfo.UserCircleMappings && userInfo.UserCircleMappings.length != 0) {
            userInfo.UserCircleMappings.forEach(element => {
                circleIds.push(element.CircleId);
            });
        } else {
            circleIds = ["0"]
        }
        var _circles = circleIds.toString();
        let circle = {
            CircleIds: _circles
        }
        this.request = new BaseRequestModel();
        var loanInfo = new Loan();
        this.generalFun()
        loanInfo.LcNo = lCNo;
        this.request.Loan = loanInfo
        var req = JSON.stringify(this.request);
        this.request.Branch = branch;
        this.request.Zone = zone;
        this.request.Circle = circle;
        return this.http.post(`${environment.apiUrl}/Loan/GetSubProposalGL`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetReshTransactionByID(loanReschID, zone, branch): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.Zone = zone;
        this.request.Branch = branch
        var loanInfo = new Loan();
        this.generalFunction()
        this.MakeReschedule.LoanReschID = loanReschID
        loanInfo.MakeReschedule = this.MakeReschedule;
        this.request.Loan = loanInfo
        var req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Loan/GetReshTransactionByID`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }
}
