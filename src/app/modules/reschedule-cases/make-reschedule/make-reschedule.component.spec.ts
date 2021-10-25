import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeRescheduleComponent } from './make-reschedule.component';

describe('MakeRescheduleComponent', () => {
  let component: MakeRescheduleComponent;
  let fixture: ComponentFixture<MakeRescheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeRescheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeRescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
