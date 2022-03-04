import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EvpCreditDashboardComponent} from './evp-credit-dashboard.component';

describe('EvpCreditDashboardComponent', () => {
    let component: EvpCreditDashboardComponent;
    let fixture: ComponentFixture<EvpCreditDashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EvpCreditDashboardComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EvpCreditDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
