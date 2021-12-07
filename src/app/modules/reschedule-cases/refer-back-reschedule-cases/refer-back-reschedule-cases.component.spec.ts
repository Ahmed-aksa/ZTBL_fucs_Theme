import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReferBackRescheduleCasesComponent} from './refer-back-reschedule-cases.component';

describe('ReferBackRescheduleCasesComponent', () => {
    let component: ReferBackRescheduleCasesComponent;
    let fixture: ComponentFixture<ReferBackRescheduleCasesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReferBackRescheduleCasesComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ReferBackRescheduleCasesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
