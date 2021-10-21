import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JvmasterCodeDialogComponentComponent } from './jvmaster-code-dialog-component.component';

describe('JvmasterCodeDialogComponentComponent', () => {
  let component: JvmasterCodeDialogComponentComponent;
  let fixture: ComponentFixture<JvmasterCodeDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JvmasterCodeDialogComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JvmasterCodeDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
