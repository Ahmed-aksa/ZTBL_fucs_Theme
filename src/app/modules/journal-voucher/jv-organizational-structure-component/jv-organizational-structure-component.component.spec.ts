import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JvOrganizationalStructureComponentComponent } from './jv-organizational-structure-component.component';

describe('JvOrganizationalStructureComponentComponent', () => {
  let component: JvOrganizationalStructureComponentComponent;
  let fixture: ComponentFixture<JvOrganizationalStructureComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JvOrganizationalStructureComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JvOrganizationalStructureComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
