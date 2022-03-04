import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoanMoveComponent} from './loan-move.component';

describe('LoanMoveComponent', () => {
    let component: LoanMoveComponent;
    let fixture: ComponentFixture<LoanMoveComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoanMoveComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoanMoveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
