import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDeceasedComponent } from './search-deceased.component';

describe('SearchDeceasedComponent', () => {
  let component: SearchDeceasedComponent;
  let fixture: ComponentFixture<SearchDeceasedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchDeceasedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDeceasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
