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

        console.log(this.newGuid());

        // this.http.post(`${environment.apiUrl}/Account/HealthCheck`,"").subscribe(result=>{


        // });
    }
    getNewKey() {
        let key= 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        return key
      }
      newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
}
