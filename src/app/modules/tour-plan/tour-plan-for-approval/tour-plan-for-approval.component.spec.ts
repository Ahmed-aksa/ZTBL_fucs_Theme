import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TourPlanForApprovalComponent} from './tour-plan-for-approval.component';

describe('TourPlanForApprovalComponent', () => {
    let component: TourPlanForApprovalComponent;
    let fixture: ComponentFixture<TourPlanForApprovalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TourPlanForApprovalComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TourPlanForApprovalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
