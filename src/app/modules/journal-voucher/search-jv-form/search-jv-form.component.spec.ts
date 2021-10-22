import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchJvFormComponent } from './search-jv-form.component';

describe('SearchJvFormComponent', () => {
  let component: SearchJvFormComponent;
  let fixture: ComponentFixture<SearchJvFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchJvFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchJvFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
