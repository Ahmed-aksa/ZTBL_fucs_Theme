import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TargetsTrackingComponent} from './targets-tracking.component';

describe('TargetsTrackingComponent', () => {
    let component: TargetsTrackingComponent;
    let fixture: ComponentFixture<TargetsTrackingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TargetsTrackingComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TargetsTrackingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
