import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferbackDeceasedComponent } from './referback-deceased.component';

describe('ReferbackDeceasedComponent', () => {
  let component: ReferbackDeceasedComponent;
  let fixture: ComponentFixture<ReferbackDeceasedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferbackDeceasedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferbackDeceasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
