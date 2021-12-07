import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PaymentBehaviorComponent} from './payment-behavior.component';

describe('PaymentBehaviorComponent', () => {
    let component: PaymentBehaviorComponent;
    let fixture: ComponentFixture<PaymentBehaviorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PaymentBehaviorComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PaymentBehaviorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
