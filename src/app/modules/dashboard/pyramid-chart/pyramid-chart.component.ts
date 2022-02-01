import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pyramid-chart',
  templateUrl: './pyramid-chart.component.html',
  styleUrls: ['./pyramid-chart.component.scss']
})
export class PyramidChartComponent implements OnInit {
  @Input() item: any;
  isData = true;
  constructor() { }

  ngOnInit(): void {
    if (this.item?.Recovery == 0 && this.item?.Disbursment && this.item?.Margin) {
      this.isData = false;
    }
  }

}
