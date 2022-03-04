import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoanersComponent} from './loaners.component';

describe('LoanersComponent', () => {
    let component: LoanersComponent;
    let fixture: ComponentFixture<LoanersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoanersComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoanersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
