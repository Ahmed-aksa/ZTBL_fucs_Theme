import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryApprovalTabComponent } from './tour-diary-approval-tab.component';

describe('TourDiaryApprovalTabComponent', () => {
  let component: TourDiaryApprovalTabComponent;
  let fixture: ComponentFixture<TourDiaryApprovalTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryApprovalTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryApprovalTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
