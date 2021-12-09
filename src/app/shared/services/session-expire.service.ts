import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionExpireService {

  display: any;
  counter = 1;
  count: BehaviorSubject<number>;
  constructor() {
    this.count = new BehaviorSubject(this.counter * 60);
    this.timer(this.counter);
   }
   nextCount() {
    this.count.next(++this.counter);
}
  timer(minute:number) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;
    const prefix = minute < 10 ? "0" : "";
    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;
      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;
      this.counter=textSec;
      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      
      this.count.next(this.counter);
      if (seconds == 0) {
        console.log("finished");
        clearInterval(timer);
      }
    }, 1000);
  }
}
