import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlMoveComponent } from './gl-move.component';

describe('GlMoveComponent', () => {
  let component: GlMoveComponent;
  let fixture: ComponentFixture<GlMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlMoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
