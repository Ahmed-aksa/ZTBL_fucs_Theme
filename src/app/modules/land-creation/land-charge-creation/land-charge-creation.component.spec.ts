import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LandChargeCreationComponent} from './land-charge-creation.component';

describe('LandChargeCreationComponent', () => {
    let component: LandChargeCreationComponent;
    let fixture: ComponentFixture<LandChargeCreationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LandChargeCreationComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LandChargeCreationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
