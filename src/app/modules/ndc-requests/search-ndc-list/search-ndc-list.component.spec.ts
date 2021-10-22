import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNdcListComponent } from './search-ndc-list.component';

describe('SearchNdcListComponent', () => {
  let component: SearchNdcListComponent;
  let fixture: ComponentFixture<SearchNdcListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchNdcListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNdcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
