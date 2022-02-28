import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTourPlanRoComponent } from './create-tour-plan-ro.component';

describe('CreateTourPlanRoComponent', () => {
  let component: CreateTourPlanRoComponent;
  let fixture: ComponentFixture<CreateTourPlanRoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTourPlanRoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTourPlanRoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
