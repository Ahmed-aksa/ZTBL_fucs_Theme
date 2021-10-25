import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingRequestComponent } from './mapping-request.component';

describe('MappingRequestComponent', () => {
  let component: MappingRequestComponent;
  let fixture: ComponentFixture<MappingRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
