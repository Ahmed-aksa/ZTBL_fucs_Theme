import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryPcComponent } from './tour-diary-pc.component';

describe('TourDiaryPcComponent', () => {
  let component: TourDiaryPcComponent;
  let fixture: ComponentFixture<TourDiaryPcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryPcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryPcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
