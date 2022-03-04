import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomerCwrComponent} from './customer-cwr.component';

describe('CustomerCwrComponent', () => {
    let component: CustomerCwrComponent;
    let fixture: ComponentFixture<CustomerCwrComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustomerCwrComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomerCwrComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
