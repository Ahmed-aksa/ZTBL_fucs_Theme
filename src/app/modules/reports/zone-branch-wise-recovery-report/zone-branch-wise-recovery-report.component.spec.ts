import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneBranchWiseRecoveryReportComponent } from './zone-branch-wise-recovery-report.component';

describe('ZoneBranchWiseRecoveryReportComponent', () => {
  let component: ZoneBranchWiseRecoveryReportComponent;
  let fixture: ComponentFixture<ZoneBranchWiseRecoveryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneBranchWiseRecoveryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneBranchWiseRecoveryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
