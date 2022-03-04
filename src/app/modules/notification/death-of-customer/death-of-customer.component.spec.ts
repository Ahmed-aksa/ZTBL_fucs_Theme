import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DeathOfCustomerComponent} from './death-of-customer.component';

describe('DeathOfCustomerComponent', () => {
    let component: DeathOfCustomerComponent;
    let fixture: ComponentFixture<DeathOfCustomerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeathOfCustomerComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DeathOfCustomerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
