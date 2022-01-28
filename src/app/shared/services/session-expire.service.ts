import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionExpireService {

  display: any;
  counter = 1;
  count: BehaviorSubject<number>;
  timer1:any;
  constructor() {
   
    //this.timer(this.counter);
  }
  
  
//    nextCount() {
//     this.count.next(++this.counter);
// }
  
  timer(minute: number) {
    // let minute = 1;
    if(!this.count){
      this.count = new BehaviorSubject(minute * 60);
    }
    else{
      clearInterval(this.timer1);
    }
    
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = seconds;
    const prefix = minute < 10 ? "0" : "";
     this.timer1 = setInterval(() => {
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
        clearInterval(this.timer1);
      }
    }, 1000);
  }
  


  // timerUnSubject(){
  //   this.count.unsubscribe();
  // }
  ngOnDestroy() {
    this.count.unsubscribe()
    clearInterval(this.timer1);
  }

}
