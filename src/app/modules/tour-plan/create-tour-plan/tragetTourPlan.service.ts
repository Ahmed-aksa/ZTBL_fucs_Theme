import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetTourplanService {

  
  hearderdate: BehaviorSubject<any>;
  constructor() {
  }
  getDatefromHaeder(date: Date) {
    this.hearderdate.next(date);
  }
}
