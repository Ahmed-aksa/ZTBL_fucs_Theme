// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    userEmailKey: 'userEmail',
    userName: 'userName',
    userInfoKey: 'ZTBLUser',
    menuBar: 'ZTBLUser',
    userActivities: 'ZTBLUser',
    isMockEnabled: true, // You have to switch this, when your real back-end is done
    authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',
    apiUrl: 'http://172.16.1.228:8070/ZTBL.Api', //admins
    // apiUrl: 'http://10.250.10.139/ZTBL.Apis'
    ///apiUrl: 'https://localhost:44346/ZTBL.Api', //admins
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
