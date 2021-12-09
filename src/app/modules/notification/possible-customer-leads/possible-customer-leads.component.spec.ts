import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PossibleCustomerLeadsComponent } from './possible-customer-leads.component';

describe('PossibleCustomerLeadsComponent', () => {
  let component: PossibleCustomerLeadsComponent;
  let fixture: ComponentFixture<PossibleCustomerLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PossibleCustomerLeadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PossibleCustomerLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
