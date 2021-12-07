import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoanAmountsConvertToDefaultComponent} from './loan-amounts-convert-to-default.component';

describe('LoanAmountsConvertToDefaultComponent', () => {
    let component: LoanAmountsConvertToDefaultComponent;
    let fixture: ComponentFixture<LoanAmountsConvertToDefaultComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoanAmountsConvertToDefaultComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoanAmountsConvertToDefaultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
