import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLoanCasesByCnicComponent } from './search-loan-cases-by-cnic.component';

describe('SearchLoanCasesByCnicComponent', () => {
  let component: SearchLoanCasesByCnicComponent;
  let fixture: ComponentFixture<SearchLoanCasesByCnicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchLoanCasesByCnicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLoanCasesByCnicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
