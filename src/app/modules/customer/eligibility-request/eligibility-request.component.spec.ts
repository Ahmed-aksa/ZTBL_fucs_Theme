import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityRequestComponent } from './eligibility-request.component';

describe('EligibilityRequestComponent', () => {
  let component: EligibilityRequestComponent;
  let fixture: ComponentFixture<EligibilityRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibilityRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
