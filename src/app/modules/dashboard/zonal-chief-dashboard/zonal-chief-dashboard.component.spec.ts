import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonalChiefDashboardComponent } from './zonal-chief-dashboard.component';

describe('ZonalChiefDashboardComponent', () => {
  let component: ZonalChiefDashboardComponent;
  let fixture: ComponentFixture<ZonalChiefDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZonalChiefDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonalChiefDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
