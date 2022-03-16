import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableDisableDeviceMappingComponent } from './enable-disable-device-mapping.component';

describe('EnableDisableDeviceMappingComponent', () => {
  let component: EnableDisableDeviceMappingComponent;
  let fixture: ComponentFixture<EnableDisableDeviceMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnableDisableDeviceMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableDisableDeviceMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
