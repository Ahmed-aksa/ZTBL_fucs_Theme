import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryApprovalZmComponent } from './tour-diary-approval-zm.component';

describe('TourDiaryApprovalZmComponent', () => {
  let component: TourDiaryApprovalZmComponent;
  let fixture: ComponentFixture<TourDiaryApprovalZmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryApprovalZmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryApprovalZmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
