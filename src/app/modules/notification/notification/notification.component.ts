import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(
      private router:Router
  ) { }

  ngOnInit(): void {
  }

    onClick(){
      this.router.navigateByUrl('/notifications/notification-details')
    }

}
