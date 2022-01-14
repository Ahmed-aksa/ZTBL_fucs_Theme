import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetTourplanService {
    closeCalendarSource = new BehaviorSubject<any>(new Date());
    isCloseCalander = this.closeCalendarSource.asObservable();
  constructor() {
   // this.hearderdate = new BehaviorSubject(new Date());
  }
//   getDatefromHaeder(date: Date) {
//      this.hearderdate.next(date);
//   }
  closeCalander(message: Date) {
    this.closeCalendarSource.next(message)
  }

  getDaysArray(start, end) {
    for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        arr.push({date: new Date(dt).toISOString().slice(0, 10), isCheck: false}) //();
    }
    return arr;
};

dateFormte(date) {
    if (date) {
        try {
            var myArray = date.split("-");
            var VisitedDate = myArray[2] + "" + myArray[1] + "" + myArray[0];
            return VisitedDate;

        } catch (e) {
        }
    }
}
}
