import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryApprovalRcComponent } from './tour-diary-approval-rc.component';

describe('TourDiaryApprovalRcComponent', () => {
  let component: TourDiaryApprovalRcComponent;
  let fixture: ComponentFixture<TourDiaryApprovalRcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryApprovalRcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryApprovalRcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
