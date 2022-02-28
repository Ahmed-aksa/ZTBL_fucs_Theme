import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTourPlanPcComponent } from './create-tour-plan-pc.component';

describe('CreateTourPlanPcComponent', () => {
  let component: CreateTourPlanPcComponent;
  let fixture: ComponentFixture<CreateTourPlanPcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTourPlanPcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTourPlanPcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
