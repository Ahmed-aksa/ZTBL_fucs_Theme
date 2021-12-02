import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementPerformanceReportComponent } from './disbursement-performance-report.component';

describe('DisbursementPerformanceReportComponent', () => {
  let component: DisbursementPerformanceReportComponent;
  let fixture: ComponentFixture<DisbursementPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementPerformanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
