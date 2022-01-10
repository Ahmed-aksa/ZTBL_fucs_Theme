import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryBmComponent } from './tour-diary-bm.component';

describe('TourDiaryBmComponent', () => {
  let component: TourDiaryBmComponent;
  let fixture: ComponentFixture<TourDiaryBmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryBmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryBmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
