import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDairyZmComponent } from './tour-dairy-zm.component';

describe('TourDairyZmComponent', () => {
  let component: TourDairyZmComponent;
  let fixture: ComponentFixture<TourDairyZmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDairyZmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDairyZmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
