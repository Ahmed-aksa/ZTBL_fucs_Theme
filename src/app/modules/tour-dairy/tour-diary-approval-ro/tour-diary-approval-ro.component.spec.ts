import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryApprovalRoComponent } from './tour-diary-approval-ro.component';

describe('TourDiaryApprovalRoComponent', () => {
  let component: TourDiaryApprovalRoComponent;
  let fixture: ComponentFixture<TourDiaryApprovalRoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryApprovalRoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryApprovalRoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
