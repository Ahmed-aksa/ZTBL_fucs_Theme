import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchJvPendingComponent } from './search-jv-pending.component';

describe('SearchJvPendingComponent', () => {
  let component: SearchJvPendingComponent;
  let fixture: ComponentFixture<SearchJvPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchJvPendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchJvPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
