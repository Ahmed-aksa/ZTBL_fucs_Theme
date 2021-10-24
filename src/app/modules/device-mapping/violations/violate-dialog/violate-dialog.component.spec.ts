import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolateDialogComponent } from './violate-dialog.component';

describe('ViolateDialogComponent', () => {
  let component: ViolateDialogComponent;
  let fixture: ComponentFixture<ViolateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViolateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
