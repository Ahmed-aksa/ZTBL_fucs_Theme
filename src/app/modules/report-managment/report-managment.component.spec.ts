import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportManagmentComponent } from './report-managment.component';

describe('ReportManagmentComponent', () => {
  let component: ReportManagmentComponent;
  let fixture: ComponentFixture<ReportManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportManagmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
