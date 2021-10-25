import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDairyMcoComponent } from './tour-dairy-mco.component';

describe('TourDairyMcoComponent', () => {
  let component: TourDairyMcoComponent;
  let fixture: ComponentFixture<TourDairyMcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDairyMcoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDairyMcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
