import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DailyVoucherProofComponent} from './daily-voucher-proof.component';

describe('DailyVoucherProofComponent', () => {
    let component: DailyVoucherProofComponent;
    let fixture: ComponentFixture<DailyVoucherProofComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DailyVoucherProofComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DailyVoucherProofComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
