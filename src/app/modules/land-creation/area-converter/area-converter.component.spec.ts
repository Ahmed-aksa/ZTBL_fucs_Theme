import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaConverterComponent } from './area-converter.component';

describe('AreaConverterComponent', () => {
  let component: AreaConverterComponent;
  let fixture: ComponentFixture<AreaConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaConverterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
