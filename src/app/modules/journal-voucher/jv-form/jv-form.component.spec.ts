import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JvFormComponent } from './jv-form.component';

describe('JvFormComponent', () => {
  let component: JvFormComponent;
  let fixture: ComponentFixture<JvFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JvFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JvFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
