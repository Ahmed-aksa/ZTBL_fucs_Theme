import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryRoComponent } from './tour-diary-ro.component';

describe('TourDiaryRoComponent', () => {
  let component: TourDiaryRoComponent;
  let fixture: ComponentFixture<TourDiaryRoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryRoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryRoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
