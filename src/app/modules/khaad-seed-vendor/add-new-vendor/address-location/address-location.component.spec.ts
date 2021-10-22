import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressLocationComponent } from './address-location.component';

describe('AddressLocationComponent', () => {
  let component: AddressLocationComponent;
  let fixture: ComponentFixture<AddressLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
