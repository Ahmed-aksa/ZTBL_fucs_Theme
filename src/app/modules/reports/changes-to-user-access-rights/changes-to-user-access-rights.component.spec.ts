import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangesToUserAccessRightsComponent } from './changes-to-user-access-rights.component';

describe('ChangesToUserAccessRightsComponent', () => {
  let component: ChangesToUserAccessRightsComponent;
  let fixture: ComponentFixture<ChangesToUserAccessRightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangesToUserAccessRightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangesToUserAccessRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
