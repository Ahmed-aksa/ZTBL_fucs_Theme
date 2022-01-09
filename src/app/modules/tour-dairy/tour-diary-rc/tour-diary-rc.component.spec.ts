import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryRcComponent } from './tour-diary-rc.component';

describe('TourDiaryRcComponent', () => {
  let component: TourDiaryRcComponent;
  let fixture: ComponentFixture<TourDiaryRcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDiaryRcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryRcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
