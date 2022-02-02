import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router, Event } from '@angular/router';
import { environment } from 'environments/environment';
import { EncryptDecryptService } from './shared/services/encrypt_decrypt.service';
import * as Forge from 'node-forge';
import * as NodeRSA from 'node-rsa';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import {CommonService} from "./shared/services/common.service";
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    popup: any = false;
    constructor(private router: Router, private http: HttpClient, private encryptDecryptService: EncryptDecryptService,
        private authGuard: AuthGuard,private _common:CommonService) {
        this.router.events.subscribe((event: any) => {
            var event1 = event;
            if (event instanceof NavigationStart) {
                if (event1?.url) {
                    if (!event1?.url.includes('auth') && !event1?.url.includes('sign-out')) {
                        var user = localStorage.getItem("ZTBLUser")
                        if (user) {
                            var userdate = JSON.parse(user);
                            var ismatch = false
                            var s = event.url;
                            var n = event.url.indexOf(';');
                            event.url = s.substring(0, n != -1 ? n : s.length);
                            userdate.MenuBar.forEach(x => {
                                var childURl = x?.children?.find(y => y.link?.includes(event1?.url));
                                if (childURl) {
                                    ismatch = true;
                                }
                                else {
                                    // console.log("Sam :LL");
                                }

                            });
                            if (!ismatch) {
                                if (!event1?.url.includes('dashboard')) {
                                    this.router.navigate(["/dashboard"])
                                }
                            }

                        }
                    }
                }
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

    checkSession$: Observable<boolean>;
    ngOnInit(): void {
        if (!environment.IsEncription) {
            return
        }
        var user = localStorage.getItem("ZTBLUser")
        if (!user) {
            let key = this.getNewKey();
            let UDID = this._common.newGuid();
            var data = {
                "DeviceInfo": {
                    "IMEI": UDID
                },
                "Key": key,
                "TranId": 0,
                "User": {
                    "IsActive": 0,
                    "App": 1,
                    "Channel": "user",
                    "ChannelID": 0,
                }
            }
            var responseEncript = this.encryptDecryptService.AESencrypt(key, data);

            var rsa1 = Forge.pki.publicKeyFromPem(environment.publicRSAKey);
            var encrypt = (rsa1.encrypt(key));
            encrypt = window.btoa(encrypt);


            var cusomeRequestModel = {
                "Key": encrypt,
                "Req": responseEncript

            }
            console.log(key);
            console.log(encrypt);
            console.log(responseEncript);
            this.http.post(`${environment.apiUrl}/Account/HealthCheck`, cusomeRequestModel).subscribe((result: any) => {
                if (result.Success) {
                    let Keydata = this.encryptDecryptService.AESdecrypt(key, result.Resp);
                    localStorage.setItem("ztblKey", JSON.parse(Keydata).Key);
                    localStorage.setItem("ztbludid", UDID);
                }
            });
        }

    }
    getBase64Encrypted(randomWordArray, pemKey): string {
        const pk = Forge.pki.publicKeyFromPem(pemKey);
        return Forge.util.encode64(pk.encrypt(Forge.util.hexToBytes(randomWordArray)));
    }
    getNewKey() {
        let key = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return key
    }

}
