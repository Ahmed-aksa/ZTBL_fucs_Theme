import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetFenceViolationComponent } from './get-fence-violation.component';

describe('GetFenceViolationComponent', () => {
  let component: GetFenceViolationComponent;
  let fixture: ComponentFixture<GetFenceViolationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetFenceViolationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetFenceViolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
