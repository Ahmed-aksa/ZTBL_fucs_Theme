import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementOfAffairsComponent } from './statement-of-affairs.component';

describe('StatementOfAffairsComponent', () => {
  let component: StatementOfAffairsComponent;
  let fixture: ComponentFixture<StatementOfAffairsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementOfAffairsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementOfAffairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
