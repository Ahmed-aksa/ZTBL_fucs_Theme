import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourApprovalTabComponent } from './tour-approval-tab.component';

describe('TourApprovalTabComponent', () => {
  let component: TourApprovalTabComponent;
  let fixture: ComponentFixture<TourApprovalTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourApprovalTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourApprovalTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
