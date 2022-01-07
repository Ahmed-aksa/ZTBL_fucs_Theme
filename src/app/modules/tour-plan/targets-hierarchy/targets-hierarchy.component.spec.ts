import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetsHierarchyComponent } from './targets-hierarchy.component';

describe('TargetsHierarchyComponent', () => {
  let component: TargetsHierarchyComponent;
  let fixture: ComponentFixture<TargetsHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetsHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetsHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
