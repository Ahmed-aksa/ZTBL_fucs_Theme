import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAccountBalanceComponent } from './loan-account-balance.component';

describe('LoanAccountBalanceComponent', () => {
  let component: LoanAccountBalanceComponent;
  let fixture: ComponentFixture<LoanAccountBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanAccountBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanAccountBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
