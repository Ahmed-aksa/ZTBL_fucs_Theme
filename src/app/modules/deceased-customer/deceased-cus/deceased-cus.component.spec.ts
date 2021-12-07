import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DeceasedCusComponent} from './deceased-cus.component';

describe('DeceasedCusComponent', () => {
    let component: DeceasedCusComponent;
    let fixture: ComponentFixture<DeceasedCusComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeceasedCusComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DeceasedCusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
