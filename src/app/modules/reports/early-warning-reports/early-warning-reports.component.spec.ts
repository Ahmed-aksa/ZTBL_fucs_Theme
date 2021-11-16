import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyWarningReportsComponent } from './early-warning-reports.component';

describe('EarlyWarningReportsComponent', () => {
  let component: EarlyWarningReportsComponent;
  let fixture: ComponentFixture<EarlyWarningReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarlyWarningReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyWarningReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
