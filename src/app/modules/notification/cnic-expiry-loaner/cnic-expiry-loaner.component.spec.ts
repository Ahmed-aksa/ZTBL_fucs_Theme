import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnicExpiryLoanerComponent } from './cnic-expiry-loaner.component';

describe('CnicExpiryLoanerComponent', () => {
  let component: CnicExpiryLoanerComponent;
  let fixture: ComponentFixture<CnicExpiryLoanerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnicExpiryLoanerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnicExpiryLoanerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
