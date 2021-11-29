import { Injectable } from '@angular/core';

import { formatDate } from '@angular/common';
import { regExps } from '../classes/lov.class';
import {BaseResponseModel} from "../models/base_response.model";
import {UserUtilsService} from "./users_utils.service";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
    LoggedInUserInfo: BaseResponseModel;
  constructor( private userUtilsService: UserUtilsService) { }


  isMatchSequentialInput(Input) {
    if (regExps.sequential.test(Input)) {
      return true;
    }
    else {

      if (regExps.sequentialsecond.test(Input))
        return true;
      else
      return false;
    }
  }

  workingDate(){
      debugger
      this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
      if(this.LoggedInUserInfo?.Branch){
          let dateString = this.LoggedInUserInfo.Branch.WorkingDate;
          var day = parseInt(dateString.substring(0, 2));
          var month = parseInt(dateString.substring(2, 4));
          var year = parseInt(dateString.substring(4, 8));
          return  new Date(year, month - 1, day);
      }else{
          let dateString = '11012021';
          var day = parseInt(dateString.substring(0, 2));
          var month = parseInt(dateString.substring(2, 4));
          var year = parseInt(dateString.substring(4, 8));
          return  new Date(year, month - 1, day);}
  }



  stringToDateOld(date) {
    if (date != undefined && date != null && date != '') {
      const day = date.substr(0, 2);
      const month = date.substr(2, 2);
      const year = date.substr(4, date.length);
      const Fdate = new Date(year, month, day);
      return Fdate;

    }
    else
      return '';

  }


  stringToDate(date) {
    if (date != undefined && date != null && date != '') {
      const day = date.substr(0, 2);
      const month = date.substr(2, 2);
      const year = date.substr(4, date.length);
      const Fdate = new Date(year+"-"+month+"-"+day);
      return Fdate;

    }
    else
      return '';

  }

  dateToString(date) {
    if (date != undefined && date != null && date != '') {
      const format = 'DDMMyyyy';
      const locale = 'en-US';
      return formatDate(date, format, locale);
    }
    else
      return '';

  }

}
