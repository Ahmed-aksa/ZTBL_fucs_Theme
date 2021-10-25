import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustLandListComponent } from './cust-land-list.component';

describe('CustLandListComponent', () => {
  let component: CustLandListComponent;
  let fixture: ComponentFixture<CustLandListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustLandListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustLandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
