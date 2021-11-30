import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherPostingDayComponent } from './voucher-posting-day.component';

describe('VoucherPostingDayComponent', () => {
  let component: VoucherPostingDayComponent;
  let fixture: ComponentFixture<VoucherPostingDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherPostingDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherPostingDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
