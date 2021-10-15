import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApilogsListComponent } from './apilogs-list.component';

describe('ApilogsListComponent', () => {
  let component: ApilogsListComponent;
  let fixture: ComponentFixture<ApilogsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApilogsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApilogsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
