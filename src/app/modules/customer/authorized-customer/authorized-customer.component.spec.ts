import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthorizedCustomerComponent} from './authorized-customer.component';

describe('AuthorizedCustomerComponent', () => {
    let component: AuthorizedCustomerComponent;
    let fixture: ComponentFixture<AuthorizedCustomerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AuthorizedCustomerComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthorizedCustomerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
