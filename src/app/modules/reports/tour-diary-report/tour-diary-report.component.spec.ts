import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryReportComponent } from './tour-diary-report.component';

describe('TourDiaryReportComponent', () => {
  let component: TourDiaryReportComponent;
  let fixture: ComponentFixture<TourDiaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
