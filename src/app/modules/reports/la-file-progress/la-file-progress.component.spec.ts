import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaFileProgressComponent } from './la-file-progress.component';

describe('LaFileProgressComponent', () => {
  let component: LaFileProgressComponent;
  let fixture: ComponentFixture<LaFileProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaFileProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaFileProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
