import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReregisterBiometricComponent } from './reregister-biometric.component';

describe('ReregisterBiometricComponent', () => {
  let component: ReregisterBiometricComponent;
  let fixture: ComponentFixture<ReregisterBiometricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReregisterBiometricComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReregisterBiometricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
