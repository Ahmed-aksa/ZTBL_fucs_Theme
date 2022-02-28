import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTourPlanZmComponent } from './create-tour-plan-zm.component';

describe('CreateTourPlanZmComponent', () => {
  let component: CreateTourPlanZmComponent;
  let fixture: ComponentFixture<CreateTourPlanZmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTourPlanZmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTourPlanZmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
