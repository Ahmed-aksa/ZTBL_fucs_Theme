import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTourDiaryTabComponent } from './search-tour-diary-tab.component';

describe('SearchTourDiaryTabComponent', () => {
  let component: SearchTourDiaryTabComponent;
  let fixture: ComponentFixture<SearchTourDiaryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchTourDiaryTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTourDiaryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
