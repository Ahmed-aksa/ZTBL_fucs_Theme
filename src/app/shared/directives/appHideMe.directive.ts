import { Directive, AfterViewInit, Input, ElementRef } from "@angular/core";

@Directive({
    selector: '[appHideMe]'
  })
  export class HideMeDirective implements AfterViewInit {
  
    @Input() appHideMe: string;
  
    constructor(
      private el: ElementRef
    ) { }
  
    ngAfterViewInit() {
      debugger;
      if (this.appHideMe === 'hide') {
        // this.el.nativeElement.style.display = 'none';
        this.el.nativeElement.hide=true;
      }
      // should be displayed
      // this.el.nativeElement.style.display = 'none';
    }
  }