import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DisbursementPerformancePurposeWiseComponent} from './disbursement-performance-purpose-wise.component';

describe('DisbursementPerformancePurposeWiseComponent', () => {
    let component: DisbursementPerformancePurposeWiseComponent;
    let fixture: ComponentFixture<DisbursementPerformancePurposeWiseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DisbursementPerformancePurposeWiseComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DisbursementPerformancePurposeWiseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
