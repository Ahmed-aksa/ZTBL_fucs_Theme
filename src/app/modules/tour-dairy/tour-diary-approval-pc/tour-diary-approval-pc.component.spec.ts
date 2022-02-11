import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryApprovalPcComponent } from './tour-diary-approval-pc.component';

describe('TourDiaryApprovalPcComponent', () => {
  let component: TourDiaryApprovalPcComponent;
  let fixture: ComponentFixture<TourDiaryApprovalPcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryApprovalPcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryApprovalPcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
