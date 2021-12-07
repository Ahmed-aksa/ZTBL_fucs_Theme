import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BufricationOfOsBalancesLcComponent} from './bufrication-of-os-balances-lc.component';

describe('BufricationOfOsBalancesLcComponent', () => {
    let component: BufricationOfOsBalancesLcComponent;
    let fixture: ComponentFixture<BufricationOfOsBalancesLcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BufricationOfOsBalancesLcComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BufricationOfOsBalancesLcComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
