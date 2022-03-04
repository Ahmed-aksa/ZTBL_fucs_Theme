import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EvpOdDashboardComponent} from './evp-od-dashboard.component';

describe('EvpOdDashboardComponent', () => {
    let component: EvpOdDashboardComponent;
    let fixture: ComponentFixture<EvpOdDashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EvpOdDashboardComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EvpOdDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
