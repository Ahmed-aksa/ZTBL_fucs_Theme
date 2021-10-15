import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionLogComponent } from './exception-log.component';

describe('ExceptionLogComponent', () => {
  let component: ExceptionLogComponent;
  let fixture: ComponentFixture<ExceptionLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExceptionLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
