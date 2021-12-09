import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss']
})
export class CountComponent implements OnInit {

    @Input() count: number;

  constructor() { }

  ngOnInit(): void {
  }

}
