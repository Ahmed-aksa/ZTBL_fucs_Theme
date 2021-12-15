import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCustomerLegalHeirsComponent } from './get-customer-legal-heirs.component';

describe('GetCustomerLegalHeirsComponent', () => {
  let component: GetCustomerLegalHeirsComponent;
  let fixture: ComponentFixture<GetCustomerLegalHeirsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetCustomerLegalHeirsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetCustomerLegalHeirsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
