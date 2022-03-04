import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoanDefaultersComponent} from './loan-defaulters.component';

describe('LoanDefaultersComponent', () => {
    let component: LoanDefaultersComponent;
    let fixture: ComponentFixture<LoanDefaultersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoanDefaultersComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoanDefaultersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
