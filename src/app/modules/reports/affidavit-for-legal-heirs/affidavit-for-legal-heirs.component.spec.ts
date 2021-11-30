import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffidavitForLegalHeirsComponent } from './affidavit-for-legal-heirs.component';

describe('AffidavitForLegalHeirsComponent', () => {
  let component: AffidavitForLegalHeirsComponent;
  let fixture: ComponentFixture<AffidavitForLegalHeirsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffidavitForLegalHeirsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffidavitForLegalHeirsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
