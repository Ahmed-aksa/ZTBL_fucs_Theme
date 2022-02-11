import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryApprovalMcoComponent } from './tour-diary-approval-mco.component';

describe('TourDiaryApprovalMcoComponent', () => {
  let component: TourDiaryApprovalMcoComponent;
  let fixture: ComponentFixture<TourDiaryApprovalMcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryApprovalMcoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryApprovalMcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
