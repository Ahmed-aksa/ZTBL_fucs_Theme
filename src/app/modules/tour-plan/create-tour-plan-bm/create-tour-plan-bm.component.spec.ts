import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTourPlanBmComponent } from './create-tour-plan-bm.component';

describe('CreateTourPlanBmComponent', () => {
  let component: CreateTourPlanBmComponent;
  let fixture: ComponentFixture<CreateTourPlanBmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTourPlanBmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTourPlanBmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
