import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewVendorComponent } from './add-new-vendor.component';

describe('AddNewVendorComponent', () => {
  let component: AddNewVendorComponent;
  let fixture: ComponentFixture<AddNewVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
