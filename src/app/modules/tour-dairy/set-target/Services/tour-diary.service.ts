import {Injectable} from '@angular/core';
import {BaseRequestModel} from '../../../../shared/models/base_request.model';
import {Activity} from '../../../../shared/models/activity.model';
import {HttpClient} from '@angular/common/http';
import {HttpUtilsService} from '../../../../shared/services/http_utils.service';
import {UserUtilsService} from '../../../../shared/services/users_utils.service';
import {DatePipe} from '@angular/common';
import {CommonService} from '../../../../shared/services/common.service';
import {map} from 'rxjs/operators';
import {BaseResponseModel} from '../../../../shared/models/base_response.model';
import {environment} from '../../../../../environments/environment';
import {Profile} from "../../../user-management/activity/activity.model";
import {TourPlan} from "../../../tour-plan/Model/tour-plan.model";
import moment, {Moment} from "moment";
import {Validators} from "@angular/forms";

@Injectable({
    providedIn: 'root',
})
export class TourDiaryService {
    dod: Date;

    public request = new BaseRequestModel();
    public activity = new Activity();
    userInfo = this.userUtilsService.getUserDetails();
    Profile = new Profile();

    // SearchTourDiary(zone,branch,TourDiary) {
    //     this.request = new BaseRequestModel();
    //     var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    //     this.request.User = userInfo.User;
    //     this.request.Zone = zone;
    //     this.request.Branch = branch;
    //     this.request.TourDiary=TourDiary;
    //
    //     return this.http
    //         .post(`${environment.apiUrl}/TourPlanAndDiary/SearchTourDiary`, this.request, {
    //             headers: this.httpUtils.getHTTPHeaders(),
    //         })
    //         .pipe(map((res: BaseResponseModel) => res));
    // }

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService,
        private userUtilsService: UserUtilsService,
        private datePipe: DatePipe,
        private _common: CommonService
    ) {
    }

    ChanageTourStatus(tourPlan: TourPlan) {
        this.request = new BaseRequestModel();
        this.request.User = this.userInfo.User;
        var v = JSON.stringify(tourPlan)

        this.request.TourPlan = {
            "TourPlanStatus": {"Status": tourPlan.Status, "TourPlanIds": [tourPlan.TourPlanId]}
        };


        var v = JSON.stringify(this.request)


        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/ChanageTourPlanStatus`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    SearchTourPlan(zone, branch, date) {
        let request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        request.Zone = zone;
        request.Branch = branch;
        request.User = userInfo.User;
        let TourPlan = {
            "Limit": 500,
            "Offset": 0,
            "Status": "S",
            "StartDate": date,
            "EndDate": "",
            "TourDate": date,
        }
        request.TourPlan = TourPlan;

        return this.http
            .post(`${environment.apiUrl}/TourPlanAndDiary/SearchTourPlan`, request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    GetScheduleBaseTourPlan(zone, branch, date, role, query = null, arrival_id = null, departure_id = null) {

        this.request = new BaseRequestModel();

        // var userInfo = this.userUtilsService.getUserDetails();
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();

        let request = new BaseRequestModel();
        let TourDiary = null;
        request.Zone = zone;
        request.Branch = branch;
        request.User = userInfo.User;
        let TourPlan = {
            "Limit": 500,
            "Offset": 0,
            "StartDate": date,
            "Status": "A",
            "EndDate": date,
        }
        if (!query) //query for diary documents purpose
            TourDiary = {
                "TourDate": date,
                "ArrivalAtId": arrival_id,
                "DepartureFromId": departure_id
            }
        else
            TourDiary = {
                "Query": query
            }

        userInfo.User.ProfileId = this.getProfileId(role)
        request.TourPlan = TourPlan;
        request.TourDiary = TourDiary;
        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/GetScheduleBaseTourPlan`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetTargets(value: string, zone, branch, circle, UserID) {
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.request = new BaseRequestModel();


        this.request.Target = {
            Duration: value,
            Targets: null,
        };
        this.request.Target['Targets'] = null;
        this.request.TranId = 2830;
        if (userInfo?.UserCircleMappings) {
            var circle = userInfo.UserCircleMappings;
        } else {
            var circleIds = [];
            circle?.forEach((element) => {
                circleIds.push(element.CircleId);
            });
        }
        var _circles = JSON.stringify(circleIds);

        this.request.doPerformOTP = false;
        this.request.Circle = {
            CircleIds: _circles,
        }

        this.request.User = userInfo.User;
        this.Profile.ProfileID = UserID;
        this.request.Profile = this.Profile;
        this.request.Zone = zone;
        this.request.Branch = branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity
        return this.http
            .post(`${environment.apiUrl}/Target/GetTargets`, this.request, {
                headers: this.httpUtils.getHTTPHeaders(),
            })
            .pipe(map((res: BaseResponseModel) => res));
    }

    SearchTourDiary(tourDiary, Limit, Offset, branch, zone, circle, is_zc = false) {

        this.request = new BaseRequestModel();

        var userInfo = this.userUtilsService.getUserDetails();

        this.request.User = userInfo.User;
        this.request.TourDiary = tourDiary;
        this.request.TourDiary.Limit = Limit;
        this.request.TourDiary.Offset = Offset;
        this.request.Zone = zone;
        this.request.Branch = branch;
        this.request.Circle = circle;
        if (is_zc) {
            this.request.User["ProfileId"] = environment.ZC;
        }
        var req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/SearchTourDiary`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    saveDiary(zone, branch, circle, TourDiary, role) {

        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        userInfo.User.ProfileId = this.getProfileId(role)
        this.request.Zone = zone;
        this.request.Branch = branch;
        this.request.Circle = circle;
        this.request.User = userInfo.User;
        this.request.TourDiary = TourDiary;
        return this.http
            .post<any>(
                `${environment.apiUrl}/TourPlanAndDiary/CreateUpdateTourDiary`,
                this.request
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    getTourDiaryDetail(zone, branch, circle, TourDiary, role = null) {
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        userInfo.User.ProfileId = this.getProfileId(role)
        if (zone)
            this.request.Zone = zone;
        else this.request.Zone = {
            ZoneId: TourDiary.ZoneId
        }
        this.request.Branch = branch;
        this.request.Circle = circle;
        this.request.User = userInfo.User;
        this.request.TourDiary = TourDiary;
        return this.http
            .post<any>(
                `${environment.apiUrl}/TourPlanAndDiary/GetTourDiaryApprovalDetail`,
                this.request
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    ChangeStatusDiary(zone, branch, circle, TourDiary, Status, role = null) {
        //this.request = new BaseRequestModel();
        var req;
        var userInfo = this.userUtilsService.getUserDetails();
        var circles = [], circleIds;

        if (userInfo.UserCircleMappings && userInfo.UserCircleMappings.length != 0) {
            userInfo.UserCircleMappings.forEach(element => {
                circles.push(element.CircleId);
            });
        } else {
            circleIds = [0]
        }
        circleIds = circles.toString();

        userInfo.User.ProfileId = this.getProfileId(role)
        TourDiary.DiaryId = TourDiary.DiaryId.toString();
        if (TourDiary.Ppno)
            TourDiary.Ppno = TourDiary?.Ppno?.toString();
        else
            TourDiary.Ppno = TourDiary?.PPNO?.toString();
        TourDiary.TourPlanId = TourDiary.TourPlanId.toString();
        // TourDiary.TourDate = TourDiary.TourDate.toString();


        req = {
            User: userInfo.User,
            Branch: branch,
            Zone: zone,
            Circle: {
                CircleIds: circleIds
            },
            TourDiary: {
                DiaryId: TourDiary.DiaryId,
                Ppno: TourDiary.Ppno,
                Status: Status,
                TourPlanId: TourDiary.TourPlanId,
                TourDate: TourDiary.TourDate
            }
        }

        return this.http
            .post<any>(
                `${environment.apiUrl}/TourPlanAndDiary/ChangeTourDiaryStatus`,
                req
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    submitTargets(bankAssignedTargets, Duration, UserID, TagName, assignedTarget, Label) {

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
            (this.request.TranId = 2830);
        this.request.doPerformOTP = false;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.request.User = userInfo.User;

        this.Profile.ProfileID = UserID;
        this.request.Profile = this.Profile;
        if (TagName != undefined || TagName != "") {

            this.request.Target = {
                TagName: TagName
            };

        } else {
            this.request.Target = {Targets: null};
        }


        this.request.Target.Duration = Duration.toString();

        if (assignedTarget) {
            if (Object.keys(assignedTarget)?.length) {
                // this.request.Target["AssignedTarget"] = assignedTarget;
                // var obj = Object.assign({},assignedTarget)
                // obj.Name= Label;
                // this.request.Target["AssignedTarget"] =obj;

                this.request.Target["AssignedTarget"] = this._common.simpleClone(assignedTarget)
                this.request.Target.AssignedTarget["Name"] = Label
            }
        }

        if (bankAssignedTargets) {
            if (Object.keys(bankAssignedTargets)?.length) {
                // var obj = Object.assign({},bankAssignedTargets[0])
                // obj.Name= Label;
                // this.request.Target["AssignedTarget"] =obj;

                this.request.Target["AssignedTarget"] = this._common.simpleClone(bankAssignedTargets[0])
                this.request.Target.AssignedTarget["Name"] = Label
            }
        }

        var req = JSON.stringify(this.request);

        return this.http
            .post<any>(
                `${environment.apiUrl}/Target/SubmitTarget`,
                this.request
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    getProfileId(role) {

        if (role == 'ZC') {
            return environment.ZC;
        } else if (role == 'MCO') {
            return environment.MCO_Group_ID;
        } else if (role == 'ZM') {
            return environment.ZM;
        } else if (role == 'BM') {
            return environment.BM;
        } else if (role == 'PC') {
            return environment.PROVINCIAL_CHEIF;
        } else if (role == 'RC') {
            return environment.Regional_CHIEF;
        } else if (role == 'RO') {
            return environment.RECOVERY_OFFICER;
        } else {
            return this.userInfo.User.ProfileId;
        }
    }


    searchTourDiaryApproval(
        approval_from: any,
        itemsPerPage: number, offset: string, branch: any, zone: any, circle: any, user_id, tour_date = null) {

        let start_date: Moment = moment(approval_from.FromDate);
        let end_date: Moment = moment(approval_from.ToDate);
        let request = {
            TourDiary: {
                CreatedBy: user_id,
                CircleId: circle?.CircleId,
                BranchCode: branch?.BranchCode,
                ZoneId: zone?.ZoneId,
                StartDate: start_date.format('YYYY-MM-DD'),
                EndDate: end_date.format('YYYY-MM-DD'),
                // Status: approval_from.Status,
                Status: 'S',
                TourDate: tour_date,
                Limit: String(itemsPerPage),
                Offset: offset,
                Ppno: approval_from.PPNo,
            },
            Zone: zone,
            Branch: branch,
            Circle: circle,
            User: this.userInfo.User,
        }
        if (request.TourDiary.StartDate == "Invalid date") {
            request.TourDiary.StartDate = null;
        }
        if (request.TourDiary.EndDate == "Invalid date") {
            request.TourDiary.EndDate = null;
        }

        console.log(JSON.stringify(request));

        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/SearchTourDiaryForApproval`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: any) => res)
        );
    }

    combineDateAndTime(date, time) {


        const yy = new Date(date).getFullYear();
        const mm = new Date(date).getMonth() + 1;
        const dd = new Date(date).getDate();

        var interMedDt = new Date(mm + '-' + dd + '-' + yy);
        interMedDt.setHours((time.split(' ')[0]).split(':')[0]);
        interMedDt.setMinutes((time.split(' ')[0]).split(':')[1]);
        return interMedDt
    }

    getTourDiaryDetailForDocument(query: string) {
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.TourDiary = {
            Query: query
        };
        return this.http
            .post<any>(
                `${environment.apiUrl}/TourPlanAndDiary/GetTourDiaryDetailForReport`,
                this.request
            )
            .pipe(map((res: BaseResponseModel) => res));
    }

    removeValidators(form) {
        this.removeValidations('mutation', form)
        this.removeValidations('utilization', form)
        this.removeValidations('rec', form)
        this.removeValidations('technology', form)
        this.removeValidations('loan', form)
        this.removeValidations('other', form)
    }

    removeValidations(value, form) {
        if (form) {
            const controls = form.controls;
            Object.keys(controls).forEach(controlName => {
                    if (controlName.toLocaleLowerCase().includes(value)) {
                        controls[controlName].removeValidators(Validators.required);
                    }
                }
            );

        }
    }

    applyValidations(value, form) {
        if (form) {
            const controls = form.controls;
            Object.keys(controls).forEach(controlName => {
                    if (controlName.toLocaleLowerCase().includes(value)) {
                        controls[controlName].setValidators(Validators.required);
                        if (form.controls[controlName].value == null)
                            form.controls[controlName].setValue(null);
                    }
                }
            );

        }
    }

    changeValidators(gridForm, TourPlan, value) {
        debugger;
        this.removeValidators(gridForm);
        let purpose_name = TourPlan.filter(obj => obj.TourPlanId == value)[0]?.PurposeName;
        if (purpose_name == 'Checking of Mutations') {
            this.applyValidations('mutation', gridForm)
        } else if (purpose_name == "Checking of Utilization") {
            this.applyValidations('utilization', gridForm)
        } else if (purpose_name == 'Recovery Operations') {
            this.applyValidations('rec', gridForm)
        } else if (purpose_name == 'Dissemination of Technology') {
            this.applyValidations('technology', gridForm)
        } else if (purpose_name == "Loan Appraisal") {
            this.applyValidations('loan', gridForm)
        } else if (purpose_name == "Others") {
            this.applyValidations('other', gridForm)
        }
    }
}

export class Targets {
    TagName: string;
}
