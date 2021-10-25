import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewfileComponent } from './viewfile.component';

describe('ViewfileComponent', () => {
  let component: ViewfileComponent;
  let fixture: ComponentFixture<ViewfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
