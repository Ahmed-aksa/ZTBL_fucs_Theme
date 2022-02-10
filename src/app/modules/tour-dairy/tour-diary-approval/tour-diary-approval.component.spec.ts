import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryApprovalComponent } from './tour-diary-approval.component';

describe('TourDiaryApprovalComponent', () => {
  let component: TourDiaryApprovalComponent;
  let fixture: ComponentFixture<TourDiaryApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
