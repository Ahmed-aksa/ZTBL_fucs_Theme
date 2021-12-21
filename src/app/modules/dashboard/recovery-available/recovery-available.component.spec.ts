import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryAvailableComponent } from './recovery-available.component';

describe('RecoveryAvailableComponent', () => {
  let component: RecoveryAvailableComponent;
  let fixture: ComponentFixture<RecoveryAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoveryAvailableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
