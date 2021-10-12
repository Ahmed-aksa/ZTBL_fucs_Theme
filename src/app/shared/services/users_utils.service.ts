import {Injectable} from '@angular/core';
// Angular
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {environment} from "../../../environments/environment";
import {BaseResponseModel} from "../models/base_response.model";
import {Activity} from "../models/activity.model";
@Injectable()
export class UserUtilsService {
    loginResponse: BaseResponseModel;
    tempResponse: BaseResponseModel;

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

        localStorage.removeItem(environment.menuBar);
        localStorage.removeItem(environment.userName);
        localStorage.removeItem(environment.userActivities);
    }

    public setUserMenu(menu) {
        localStorage.setItem(environment.menuBar, menu);
    }

    public getUserMenu() {
        return JSON.parse(localStorage.getItem(environment.menuBar));
    }

    public getUserActivities() {
        return JSON.parse(localStorage.getItem(environment.userActivities));
    }

    public getActivity(activityName: string): Activity {
        //this.getUserDetails();
        var activities = JSON.parse(localStorage.getItem(environment.userActivities));
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

}

