import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApilogDetailComponent } from './apilog-detail.component';

describe('ApilogDetailComponent', () => {
  let component: ApilogDetailComponent;
  let fixture: ComponentFixture<ApilogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApilogDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApilogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
