import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkOnCaComponent } from './mark-on-ca.component';

describe('MarkOnCaComponent', () => {
  let component: MarkOnCaComponent;
  let fixture: ComponentFixture<MarkOnCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkOnCaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkOnCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
