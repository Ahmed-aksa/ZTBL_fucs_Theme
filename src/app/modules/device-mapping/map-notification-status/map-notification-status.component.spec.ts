import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapNotificationStatusComponent } from './map-notification-status.component';

describe('MapNotificationStatusComponent', () => {
  let component: MapNotificationStatusComponent;
  let fixture: ComponentFixture<MapNotificationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapNotificationStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapNotificationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
