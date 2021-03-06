/* eslint-disable no- */
/* eslint-disable eqeqeq */
/* eslint-disable no- */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Activity} from 'app/shared/models/activity.model';
import {BaseRequestModel} from 'app/shared/models/base_request.model';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {HttpUtilsService} from 'app/shared/services/http_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {environment} from 'environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ReportsService {
    public request = new BaseRequestModel();
    public activity = new Activity();
    userDetail = this.userUtilsService.getUserDetails();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    updatedList(user, reportsFilter) {


        var request = {
            ReportsFilterCustom: reportsFilter,
            User: this.userDetail.User,
            Zone: user.Zone,
            Branch: user.Branch,
            Circle: {
                CircleCode: user.Circle.Id
            }
        }
        return this.http.post<any>(`${environment.apiUrl}/Reports/ReportsDynamic`, request)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    reportDynamic(reportsFilter, zone = null, branch = null, circle = null, tourDiary = null) {
        let user = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        let final_zone = null;
        let final_branch = null;
        let final_circle = null;
        var circles, circleIds = [];

        if (user.UserCircleMappings) {
            user.UserCircleMappings.forEach(element => {
                circleIds.push(element.CircleId)
            })
            circles = circleIds.toString();
        } else {
            circles = '';
        }
        //let reqReportNumber = reportsFilter.ReportsNo;


        if (zone == null) {
            final_zone = user.Zone;
            final_branch = user.Branch;
            if (final_branch == undefined) {
                final_branch = null;
            }
        } else {
            final_zone = zone;
            final_branch = branch;
        }

        let request = null;
        if (reportsFilter.ReportsNo == '20' || reportsFilter.ReportsNo == '19' || reportsFilter.ReportsNo == '17') {
            request = {
                ReportsFilterCustom: reportsFilter,
                User: user.User,
                Zone: final_zone,
                Branch: final_branch,
                Circle: {
                    CircleCode: circle.CircleId,
                    CircleId: circle.CircleCode,
                    CircleIds: circles
                }
            }
        } else if (reportsFilter.ReportsNo == '18') {
            if (circle != null) {
                request = {
                    ReportsFilterCustom: reportsFilter,
                    User: user.User,
                    Zone: final_zone,
                    Branch: final_branch,
                    Circle: {
                        CircleCode: circle.CircleId,
                        CircleId: circle.CircleCode,
                        CircleIds: circles
                    }
                }
            }
        } else if (reportsFilter.ReportsNo == '24') {
            reportsFilter.BranchId = final_branch.BranchId;
            request = {
                ReportsFilterCustom: reportsFilter,
                User: user.User,
                Zone: final_zone,
                Branch: final_branch,
            }
        }
        else if (reportsFilter.ReportsNo == '33') {
            request = {
                ReportsFilterCustom: reportsFilter,
                TourDiary: tourDiary,
                User: user.User,
                Zone: final_zone,
                Branch: final_branch,
                Circle: {
                    CircleCode: circle?.CircleId,
                    CircleId: circle?.CircleCode,
                    CircleIds: circles
                }
            }
        }
        else {
            request = {
                ReportsFilterCustom: reportsFilter,
                User: user.User,
                Zone: final_zone,
                Branch: final_branch,
            }
        }

        return this.http.post<any>(`${environment.apiUrl}/Reports/ReportsDynamic`, request)
            .pipe(
                map((res: BaseResponseModel) => res)
            );

        // if(reqReportNumber == '15'){
        //     return this.http.post<any>(`${environment.apiUrl}/Reports/DownloadCWR`, request)
        //         .pipe(
        //             map((res: BaseResponseModel) => res)
        //         );
        // }else{
        // }
    }

    CustomDownloads(reportsFilter, Info, zone = null, branch = null, circle = null) {

        let user = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        let final_zone = null;
        let final_branch = null;

        if (zone == null) {
            final_zone = user.Zone;
            final_branch = user.Branch;
            if (final_branch == undefined) {
                final_branch = null;
            }
        } else {
            final_zone = zone;
            final_branch = branch;
        }

        let request = null;
        if (Info == 'LoanInfoDetail') {
            request = {
                ReportsFilterCustom: {
                    LoanInformation: reportsFilter,
                    ReportFormatType: '2',
                    ReportsNo: "25"
                },
                User: user.User,
                Zone: final_zone,
                Branch: final_branch,
            }
            return this.http.post<any>(`${environment.apiUrl}/Reports/DownloadLoanInformationReport`, request)
                .pipe(
                    map((res: BaseResponseModel) => res)
                );
        } else if (Info == 'CustomerCWR') {
            return this.http.post<any>(`${environment.apiUrl}/Reports/DownloadCWR`, request)
                .pipe(
                    map((res: BaseResponseModel) => res)
                );
        }

    }

    voucher(reportsFilter, zone = null, branch = null) {
        let user = null;
        let final_zone = null;
        let final_branch = null;

        if (zone == null) {
            user = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
            if (user.Branch.WorkingDate == undefined) {
                user.Branch.WorkingDate = reportsFilter.WorkingDate;
            } else if (user.Branch == undefined) {
                user.Branch = null
            }
        } else {
            final_zone = zone;
            final_branch = branch;
        }

        let request = {
            ReportsFilterCustom: reportsFilter,
            User: this.userDetail.User,
            Zone: final_zone,
            Branch: final_branch,
        }

        return this.http.post<any>(`${environment.apiUrl}/Reports/ReportsDynamic`, request)
            .pipe(
                map((res: BaseResponseModel) => res)
            );
    }

}
