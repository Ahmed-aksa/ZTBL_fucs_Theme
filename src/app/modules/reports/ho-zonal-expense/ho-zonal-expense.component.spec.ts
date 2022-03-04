import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HoZonalExpenseComponent} from './ho-zonal-expense.component';

describe('HoZonalExpenseComponent', () => {
    let component: HoZonalExpenseComponent;
    let fixture: ComponentFixture<HoZonalExpenseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HoZonalExpenseComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HoZonalExpenseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
