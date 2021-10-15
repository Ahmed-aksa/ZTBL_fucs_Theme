import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionDetailComponent } from './exception-detail.component';

describe('ExceptionDetailComponent', () => {
  let component: ExceptionDetailComponent;
  let fixture: ComponentFixture<ExceptionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExceptionDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
