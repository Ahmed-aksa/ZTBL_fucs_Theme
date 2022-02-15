import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturePadForTourComponent } from './app-signature-pad-for-diary-approval';

describe('SignaturePadForTourComponent', () => {
  let component: SignaturePadForTourComponent;
  let fixture: ComponentFixture<SignaturePadForTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignaturePadForTourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignaturePadForTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
