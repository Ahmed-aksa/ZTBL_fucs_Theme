import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintLoanBookletComponent } from './print-loan-booklet.component';

describe('PrintLoanBookletComponent', () => {
  let component: PrintLoanBookletComponent;
  let fixture: ComponentFixture<PrintLoanBookletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintLoanBookletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintLoanBookletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
