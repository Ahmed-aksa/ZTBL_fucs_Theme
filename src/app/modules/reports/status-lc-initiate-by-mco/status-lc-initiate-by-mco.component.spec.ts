import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusLcInitiateByMcoComponent } from './status-lc-initiate-by-mco.component';

describe('StatusLcInitiateByMcoComponent', () => {
  let component: StatusLcInitiateByMcoComponent;
  let fixture: ComponentFixture<StatusLcInitiateByMcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusLcInitiateByMcoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusLcInitiateByMcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
