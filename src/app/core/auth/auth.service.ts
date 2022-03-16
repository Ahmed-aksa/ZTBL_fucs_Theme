/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {UserService} from 'app/core/user/user.service';
import {BaseRequestModel, OTP} from "../../shared/models/base_request.model";
import {environment} from "../../../environments/environment";
import {BaseResponseModel} from "../../shared/models/base_response.model";
import {UserUtilsService} from "../../shared/services/users_utils.service";

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    private request: BaseRequestModel;


    constructor(
        private httpUtils: HttpClient,
        private _userService: UserService,
        private _userUtilsService: UserUtilsService,
    ) {

    }

    set accessToken(token: string) {
        if (typeof token != 'undefined') {
            localStorage.setItem('accessToken', token);

        }
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    set ZTBLUserRefreshToke(token: string) {
        if (typeof token != 'undefined') {
            localStorage.setItem('ZTBLUserRefreshToke', token);

        }
    }

    get ZTBLUserRefreshToke(): string {
        return localStorage.getItem('ZTBLUserRefreshToke') ?? '';
    }

    forgotPassword(email: string): Observable<any> {
        return this.httpUtils.post('api/auth/forgot-password', email);
    }


    resetPassword(password: string): Observable<any> {
        return this.httpUtils.post('api/auth/reset-password', password);
    }


    signIn(credentials: { email: string; password: string, App: string }): Observable<any> {

        this.request = new BaseRequestModel();
        this.request.User = credentials;
        this.request.UserPasswordDetails = credentials;
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this.httpUtils.post(`${environment.apiUrl}/Account/Login`, this.request,
            {headers: this.getHTTPHeaders()}).pipe(
            map((response: BaseResponseModel) => {
                if (response.Success && !response.isWebOTPEnabled) {
                    localStorage.setItem('ZTBLUser', JSON.stringify(response));
                    this.accessToken = response.Token;
                    this.ZTBLUserRefreshToke = response.RefreshToken;
                    this._authenticated = true;
                }

                return response;
            })
        );

    }

    SendOTPResuest(text, loginMode): Observable<BaseResponseModel> {
        let request = new BaseRequestModel();
        request.OTP = new OTP();
        request.OTP.Id = "1";
        request.OTP.Text = text;
        request.User = loginMode;
        request.UserPasswordDetails = loginMode;
        debugger;
        return this.httpUtils.post(`${environment.apiUrl}/Account/VerifyOTP`, request,
            {headers: this.getHTTPHeaders()}).pipe(
            map((response: BaseResponseModel) => {
                debugger;
                localStorage.setItem('ZTBLUser', JSON.stringify(response));
                this.accessToken = response.Token;
                this.ZTBLUserRefreshToke = response.RefreshToken;
                this._authenticated = true;
                return response;
            })
        );
    }

    refreshToken(token: string) {

        this.request = new BaseRequestModel();
        const refreshToken = (localStorage.getItem('ZTBLUserRefreshToke'));
        const expiredToken = (localStorage.getItem('accessToken'));
        this.request.Token = expiredToken;
        this.request.RefreshToken = refreshToken;

        return this.httpUtils.post(`${environment.apiUrl}/Account/RefreshToken`, this.request);
    }

    setAuthenticated(value: boolean) {
        this._authenticated = value;
    }

    signInUsingToken(): Observable<any> {
        // Renew token
        return this.httpUtils.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    // signOut(): Observable<any> {
    //     // Remove the access token from the local storage
    //     localStorage.clear();
    //
    //     // Set the authenticated flag to false
    //     this._authenticated = false;
    //
    //     // Return the observable
    //     return of(true);
    // }

    signOut(): Observable<any> {
        this.request = new BaseRequestModel();
        //this._authenticated = false;
        // localStorage.clear();
        var userInfo = this._userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        return this.httpUtils.post<any>(`${environment.apiUrl}/Account/Logout`, this.request)
            .pipe(
                map((res: BaseResponseModel) => res
                )
            );
        // return this.httpUtils.post<any>(`${environment.apiUrl}/Account/Logout`, this.request)
        //     .pipe(
        //         map((res: BaseResponseModel) => {
        //                 res;
        //             }
        //         )
        //     );
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this.httpUtils.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this.httpUtils.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        // if (AuthUtils.isTokenExpired(this.accessToken)) {
        //     return of(false);
        // }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    getHTTPHeaders(): HttpHeaders {

        const result = new HttpHeaders();
        result.set('Access-Control-Allow-Origin', '*');
        result.set('Content-Type', 'application/json');
        return result;
    }

    changePassword(old_password, new_password) {
        var request: any;
        request = {
            User: JSON.parse(localStorage.getItem('ZTBLUser')).User,
            UserPasswordDetails: {
                OldPassword: old_password,
                Password: new_password
            }
        }
        return this.httpUtils.post(`${environment.apiUrl}/Account/ChangePassword`, request);
    }
}
