import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityLogDetailComponent } from './eligibility-log-detail.component';

describe('EligibilityLogDetailComponent', () => {
  let component: EligibilityLogDetailComponent;
  let fixture: ComponentFixture<EligibilityLogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibilityLogDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityLogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
