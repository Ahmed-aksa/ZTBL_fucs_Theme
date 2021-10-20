import {Injectable} from '@angular/core';
// Angular
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {environment} from "../../../environments/environment";
import {BaseResponseModel} from "../models/base_response.model";
import {Activity} from "../models/activity.model";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class UserUtilsService {
    loginResponse: BaseResponseModel;
    tempResponse: BaseResponseModel;
    search_data: any = {Branch: null, UserCircleMappings: null, zone: null};


    constructor(private http: HttpClient = null) {
    }

    public getSearchResultsDataOfZonesBranchCircle() {

        /**
         * LOGIC:
         *  CASE 1:
         *      Zone, branch, circle !=null
         *      zone disabled
         *      branch disabled
         *      circle enabled  --> SELECT OPTION
         *          -> fetch mapping of circles from UserCircleMappings ( localstorage)
         *  CASE 2:
         *      Zone, branch !=null
         *      Circle=null
         *      Zone should be disabled
         *      Branch Enabled with SELECT OPTION -->fetch branch from localstorage
         *      Circle will be enabled w.r.t Branch from API
         *  Case 3:
         *      Zone !=null
         *      Branch, Circle =null
         *      Zone Enabled
         *      Fetch Branch w.r.t Zone from API
         *      Fetch Circle w.r.t Branch from API
         *  Case 4:
         *      Zone, Branch, Circle =null
         *      First hit API  ---->getZone<----
         *      All Will be enabled as discussed in Case 3
         */
        let user_data = JSON.parse(localStorage.getItem('ZTBLUser'));
        /**
         * Branch Data Manipulation
         */
        if (
            user_data.Branch &&
            user_data.UserCircleMappings &&
            user_data.Zone) {

            /**
             * Case 1
             */
            this.search_data.Branch = user_data.Branch;
            this.search_data.UserCircleMappings = user_data.UserCircleMappings;
            this.search_data.Zone = user_data.Zone;
        } else if (
            (user_data.Branch != null || user_data.Branch != undefined) &&
            (user_data.Zone != null || user_data.Zone != undefined) &&
            user_data.UserCircleMappings == undefined) {
            /**
             * Case 2
             */
            this.search_data.Branch = user_data.Branch;
            this.search_data.UserCircleMappings = true;
            this.search_data.Zone = null;
        } else if (
            (user_data.Branch == null || user_data.Branch == undefined) &&
            (user_data.UserCircleMappings == null || user_data.UserCircleMappings == undefined) &&
            (user_data.Zone != null || user_data.Zone != undefined)
        ) {
            /**
             * Case 3
             */
            this.search_data.Branch = true;
            this.search_data.UserCircleMappings = true;
            this.search_data.Zone = user_data.Zone;
        } else if (
            !user_data.Branch &&
            !user_data.UserCircleMappings &&
            !user_data.Zone) {
            /**
             * Case 4
             */

            this.search_data.branch = null;
            this.search_data.UserCircleMappings = null;
            this.search_data.zone = null;

        }
        return this.search_data;
    }

    public getUserDetails(): BaseResponseModel {

        var userMenu = this.getUserMenu();
        if (userMenu != undefined && userMenu != null) {
            var data = Cookie.get(environment.userInfoKey);
            if (data != undefined) {
                this.loginResponse = JSON.parse(data);
                this.loginResponse.MenuBar = this.getUserMenu();
                this.loginResponse.Activities = this.getUserActivities();
                this.loginResponse.Success = true;
                return this.loginResponse;
            }
            return new BaseResponseModel();
        }
    }

    public setUserDetails(response: BaseResponseModel) {

        localStorage.setItem(environment.menuBar, JSON.stringify(response.MenuBar));
        localStorage.setItem(environment.userActivities, JSON.stringify(response.Activities));

        this.tempResponse = new BaseResponseModel();
        this.tempResponse.User = response.User;
        this.tempResponse.User.App = 1;

        this.tempResponse.Token = response.Token;
        this.tempResponse.TokenExpirayTime = response.TokenExpirayTime;
        this.tempResponse.Zone = response.Zone;
        this.tempResponse.Branch = response.Branch;
        this.tempResponse.UserCircleMappings = response.UserCircleMappings;
        this.tempResponse.CanCollectRecoveryForAllMCO = response.CanCollectRecoveryForAllMCO;

        Cookie.set(environment.userInfoKey, JSON.stringify(this.tempResponse), 1);

    }


    public removeUserDetails() {

        //cookies
        Cookie.delete(environment.userInfoKey);
        //Cookie.deleteAll();

        localStorage.removeItem(environment.userActivities);
    }

    public setUserMenu(menu) {
        localStorage.setItem(environment.menuBar, menu);
    }

    public getUserMenu() {
        return JSON.parse(localStorage.getItem(environment.menuBar)).MenuBar;
    }

    public getUserActivities() {
        return JSON.parse(localStorage.getItem(environment.userActivities)).Activities;
    }

    public getActivity(activityName: string): Activity {
        //this.getUserDetails();
        var activities = this.getUserActivities();
        var act = activities.filter(x => x.ActivityName == activityName)[0];

        act.C = act.C == '1' ? true : false
        act.D = act.D == '1' ? true : false
        act.U = act.U == '1' ? true : false
        act.R = act.R == '1' ? true : false
        return act;
    }

    public isValidUrl(url: string): boolean {

        if (url == '/dashboard' || url == '/error' || url.includes(';LnTransactionID') || url.includes('/land-info-history') || url.includes(';upFlag'))
            return true;

        //this.getUserDetails();
        var activities = JSON.parse(localStorage.getItem(environment.userActivities));
        if (activities != null && activities != undefined) {
            var result = activities.filter(x => x.ActivityUrl == url)[0];

            if (result != null && result != undefined) {
                return true;
            }
        }
        if (url.includes('/dashboard')) {
            return true;
        }
        return false;
    }

    public isTokenExpired() {
        this.getUserDetails();
        if (this.loginResponse) {
            if (this.loginResponse.Token != null)
                return false;
        }
        return true;
    }

    getCircle(branch) {
        return this.http.post(`${environment.apiUrl}/Circle/GetCirclesByBranchCode`, branch);
    }

    getBranch(Zone) {
        return this.http.post(`${environment.apiUrl}/Branch/GetBranchByZone`, Zone);
    }

    getZone() {
        return this.http.post(`${environment.apiUrl}/Zone/GetZones`, null);
    }
}

