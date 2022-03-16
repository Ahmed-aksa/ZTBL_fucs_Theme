import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-zone-branch-wise-recovery-report',
  templateUrl: './zone-branch-wise-recovery-report.component.html',
  styleUrls: ['./zone-branch-wise-recovery-report.component.scss']
})
export class ZoneBranchWiseRecoveryReportComponent implements OnInit {
    currentTime = new Date()
    currentYear;
    lastYear;
  constructor() { }

  ngOnInit(): void {
      this.currentYear = this.currentTime.getFullYear();
      this.lastYear = this.currentTime.getFullYear()-1;
  }

  printReport(){
      window.print();
  }

}
