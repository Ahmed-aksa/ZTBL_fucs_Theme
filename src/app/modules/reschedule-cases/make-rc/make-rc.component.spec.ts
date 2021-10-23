import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeRcComponent } from './make-rc.component';

describe('MakeRcComponent', () => {
  let component: MakeRcComponent;
  let fixture: ComponentFixture<MakeRcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeRcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeRcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
