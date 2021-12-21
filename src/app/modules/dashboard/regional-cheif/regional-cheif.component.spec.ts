import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionalCheifComponent } from './regional-cheif.component';

describe('RegionalCheifComponent', () => {
  let component: RegionalCheifComponent;
  let fixture: ComponentFixture<RegionalCheifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionalCheifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionalCheifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
