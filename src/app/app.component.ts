import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router, Event } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    popup: any = false;
    constructor(private router: Router, private http: HttpClient,) {
        this.router.events.subscribe((event: any) => {
            var event1 = event;
            if (event instanceof NavigationStart) {
                // // if (event1?.url) {
                // //     if (!event1?.url.includes('auth') &&!event1?.url.includes('sign-out')) {
                // //         var user = localStorage.getItem("ZTBLUser")
                // //         if (user) {
                // //             var userdate = JSON.parse(user);
                // //             var ismatch = false
                // //             userdate.MenuBar.forEach(x => {
                // //                 var childURl = x?.children?.find(y => y.link?.includes(event1?.url))
                // //                 if (childURl) {
                // //                     ismatch = true;
                // //                 }
                // //                 else {
                // //
                // //                 }
                // //
                // //             });
                // //             if (!ismatch) {
                // //                 if(!event1?.url.includes('dashboard')){
                // //                     this.router.navigate(["/dashboard"])
                // //                 }
                // //             }
                // //
                // //         }
                // //     }
                // }
            }

            // if (event instanceof NavigationEnd) {
            //     // Hide loading indicator
            // }

            // if (event instanceof NavigationError) {
            //     // Hide loading indicator

            //     // Present error to user
            //     console.log(event.error);
            // }
        });
    }

    ngOnInit(): void {

        // console.log(this.newGuid());
        // var valueToEncrypt = "Ahmed Javed"
        // var date = {
        //     id: '1',
        //     Name: 'ahmed Javed',
        //   };
        // const rsa = Forge.pki.publicKeyFromPem(publicKey);
        // let enr = window.btoa(rsa.encrypt(JSON.stringify(date)));
        // console.log(window.atob(enr));
        // debugger;
        // let res = Forge.pki.privateKeyFromPem(privateKey);

        // console.log(res.decrypt(window.atob(enr)))

        // this.http.post(`${environment.apiUrl}/Account/HealthCheck`,"").subscribe(result=>{
        // });

    }
    getNewKey() {
        let key = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return key
    }
    newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
export const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDObZtjxfplZYRgo6TKZM9E6b3RVQpXTpKTOiqefTKEpT9//ru1
x0rHgqpsjcw1BoXFX3SuYRPn3ijCM/C9WHnc2PDjEgGu0KezIxvqE7nCjbHed7pf
f6fov6ZajFsiwcf2r3oOwCjWMW1ChHP0ZYF2Ai1HmInarJutHTwE+Elb3QIDAQAB
AoGAHLkVmRFwIPG6NLQwdtUGHiGj/t+lW7acII5EZd8ny1su9cFdHxMG7bHZwtcM
JgitTmRU2Pq7CVVZOIR/p+kKs5cPE6gH5UGlYi0MTZV3sD4hSWMRs+baNiRkaWLE
COxk0o4Xe80StheoL89K2dIwFrc28BAowdvrHHjeqvYRsgECQQDymDTCXjoHGAhG
T77gnAVmOY9QsB00mIeVxC06LHwC1TfM51k8QgalUDIp/pxaCZp5F0l4Uy2Tzg+B
phr2+OVdAkEA2dXIh0rSJM8zw312MJT5YFwNkDpgmMN/aN1FPAVHtLVoMn8d7p8p
w7DUEQ5sl+Sk5XwWWa9AEckkG3SRW3BogQJBAL5Flwvj78tklAjhvypX9PwqpTd6
Ck4YXC+hQH/iKBnote1mftz+REwgzFeXtXYBFkFnfF59jr/g3NSpPXj72pkCQCan
LZ78Is/PSIMexxMVzC5SB0IZabyRrBECel+NHE0vh162eaw25+VGgkrIgXJuaugh
naGqXDcLtvF8PLK5/oECQQDkQl/IAPBbI5QXLmfiseu7duRtZ9px/7HYDOEDtjia
sOyBGW2Ml7FYxYTPJX6uIhxfIpX1Bt1Kdtue3Wu3OMRC
-----END RSA PRIVATE KEY-----`;

export const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDObZtjxfplZYRgo6TKZM9E6b3R
VQpXTpKTOiqefTKEpT9//ru1x0rHgqpsjcw1BoXFX3SuYRPn3ijCM/C9WHnc2PDj
EgGu0KezIxvqE7nCjbHed7pff6fov6ZajFsiwcf2r3oOwCjWMW1ChHP0ZYF2Ai1H
mInarJutHTwE+Elb3QIDAQAB
-----END PUBLIC KEY-----`;