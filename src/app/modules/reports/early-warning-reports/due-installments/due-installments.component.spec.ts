import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueInstallmentsComponent } from './due-installments.component';

describe('DueInstallmentsComponent', () => {
  let component: DueInstallmentsComponent;
  let fixture: ComponentFixture<DueInstallmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DueInstallmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DueInstallmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
