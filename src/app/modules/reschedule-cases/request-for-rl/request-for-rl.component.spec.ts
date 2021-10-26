import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForRlComponent } from './request-for-rl.component';

describe('RequestForRlComponent', () => {
  let component: RequestForRlComponent;
  let fixture: ComponentFixture<RequestForRlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestForRlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestForRlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
