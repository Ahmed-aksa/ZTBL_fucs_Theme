import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchJvComponent } from './search-jv.component';

describe('SearchJvComponent', () => {
  let component: SearchJvComponent;
  let fixture: ComponentFixture<SearchJvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchJvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchJvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
