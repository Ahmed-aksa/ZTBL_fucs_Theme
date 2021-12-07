import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetUnsuccessfulLoginComponent } from './get-unsuccessful-login.component';

describe('GetUnsuccessfulLoginComponent', () => {
  let component: GetUnsuccessfulLoginComponent;
  let fixture: ComponentFixture<GetUnsuccessfulLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetUnsuccessfulLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetUnsuccessfulLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
