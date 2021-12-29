import { Component } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router, Event } from '@angular/router';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    popup: any = false;
    constructor(private router: Router) {
        this.router.events.subscribe((event: any) => {
            var event1 = event;
            if (event instanceof NavigationStart) {
                if (event1?.urlAfterRedirects) {
                    if (!event1?.urlAfterRedirects.includes('auth')) {
                        var user = localStorage.getItem("ZTBLUser")
                        if (user) {
                            var userdate = JSON.parse(user);
                            var ismatch = false
                            userdate.MenuBar.forEach(x => {
                                var childURl = x?.children?.find(y => y.link?.includes(event1?.urlAfterRedirects))
                                if (childURl) {
                                    ismatch = true;
                                }
                                else {

                                }

                            });
                            if (!ismatch) {
                                debugger;
                                this.router.navigate(["/dashboard"])
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
}
