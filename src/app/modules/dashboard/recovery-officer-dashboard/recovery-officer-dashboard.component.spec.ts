import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryOfficerDashboardComponent } from './recovery-officer-dashboard.component';

describe('RecoveryOfficerDashboardComponent', () => {
  let component: RecoveryOfficerDashboardComponent;
  let fixture: ComponentFixture<RecoveryOfficerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoveryOfficerDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryOfficerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
