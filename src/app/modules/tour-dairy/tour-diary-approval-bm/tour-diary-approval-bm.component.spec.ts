import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryApprovalBmComponent } from './tour-diary-approval-bm.component';

describe('TourDiaryApprovalBmComponent', () => {
  let component: TourDiaryApprovalBmComponent;
  let fixture: ComponentFixture<TourDiaryApprovalBmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryApprovalBmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryApprovalBmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
