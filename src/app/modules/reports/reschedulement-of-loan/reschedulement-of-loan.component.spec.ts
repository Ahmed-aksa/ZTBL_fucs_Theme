import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReschedulementOfLoanComponent} from './reschedulement-of-loan.component';

describe('ReschedulementOfLoanComponent', () => {
    let component: ReschedulementOfLoanComponent;
    let fixture: ComponentFixture<ReschedulementOfLoanComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReschedulementOfLoanComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ReschedulementOfLoanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
