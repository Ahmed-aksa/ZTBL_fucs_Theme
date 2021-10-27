import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGlCodeComponent } from './new-gl-code.component';

describe('NewGlCodeComponent', () => {
  let component: NewGlCodeComponent;
  let fixture: ComponentFixture<NewGlCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGlCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGlCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
