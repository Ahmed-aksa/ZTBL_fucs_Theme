import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryApprovalZcComponent } from './tour-diary-approval-zc.component';

describe('TourDiaryApprovalZcComponent', () => {
  let component: TourDiaryApprovalZcComponent;
  let fixture: ComponentFixture<TourDiaryApprovalZcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryApprovalZcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryApprovalZcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
