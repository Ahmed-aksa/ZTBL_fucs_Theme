import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomerListDialogComponent} from './customer-list-dialog.component';

describe('CustomerListDialogComponent', () => {
    let component: CustomerListDialogComponent;
    let fixture: ComponentFixture<CustomerListDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustomerListDialogComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomerListDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
