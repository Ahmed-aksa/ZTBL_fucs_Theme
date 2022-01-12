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
}
