/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activity } from 'app/shared/models/activity.model';
import { BaseRequestModel } from 'app/shared/models/base_request.model';
import { HttpUtilsService } from 'app/shared/services/http_utils.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  public request = new BaseRequestModel();
  public activity = new Activity();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) { }
  userDetail = this.userUtilsService.getUserDetails();
  
  reportDynamic(user, reportsFilter){
    
  }
}
