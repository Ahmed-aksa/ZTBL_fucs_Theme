import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pyramid-chart',
  templateUrl: './pyramid-chart.component.html',
  styleUrls: ['./pyramid-chart.component.scss']
})
export class PyramidChartComponent implements OnInit {
  @Input() item :any;
  constructor() { }

  ngOnInit(): void {
  }

}
