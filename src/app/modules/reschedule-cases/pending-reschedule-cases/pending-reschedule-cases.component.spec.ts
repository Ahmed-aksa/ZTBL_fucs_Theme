import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PendingRescheduleCasesComponent} from './pending-reschedule-cases.component';

describe('PendingRescheduleCasesComponent', () => {
    let component: PendingRescheduleCasesComponent;
    let fixture: ComponentFixture<PendingRescheduleCasesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PendingRescheduleCasesComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PendingRescheduleCasesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
