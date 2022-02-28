import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTourPlanRcComponent } from './create-tour-plan-rc.component';

describe('CreateTourPlanRcComponent', () => {
  let component: CreateTourPlanRcComponent;
  let fixture: ComponentFixture<CreateTourPlanRcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTourPlanRcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTourPlanRcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
