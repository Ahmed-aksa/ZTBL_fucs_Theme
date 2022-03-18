import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {environment} from 'environments/environment';
import {EncryptDecryptService} from './shared/services/encrypt_decrypt.service';
import * as Forge from 'node-forge';
import {AuthGuard} from './core/auth/guards/auth.guard';
import {Observable} from 'rxjs';
import {CommonService} from "./shared/services/common.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    popup: any = false;

    constructor(private router: Router, private http: HttpClient, private encryptDecryptService: EncryptDecryptService,
                private authGuard: AuthGuard, private _common: CommonService) {
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
                            userdate.MenuBar?.forEach(x => {
                                var childURl = x?.children?.find(y => y.link?.includes(event1?.url));
                                if (childURl) {
                                    ismatch = true;
                                }
                            });
                            event1.url = event1.url.replace('%23', '#');
                            if (event1.url.includes('query') || event1.url.includes('tour-diary')) {
                                ismatch = true;
                            }
                            if (!ismatch) {
                                if (!event1?.url.includes('dashboard')) {
                                    this.router.navigate(["/dashboard"])
                                }
                            }

                        }
                    }
                }
            }
        });
    }

    checkSession$: Observable<boolean>;

    ngOnInit(): void {
        if (!environment.IsEncription) {
            return
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
