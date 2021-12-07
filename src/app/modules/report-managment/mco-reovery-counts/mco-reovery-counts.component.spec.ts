import {ComponentFixture, TestBed} from '@angular/core/testing';

import {McoReoveryCountsComponent} from './mco-reovery-counts.component';

describe('McoReoveryCountsComponent', () => {
    let component: McoReoveryCountsComponent;
    let fixture: ComponentFixture<McoReoveryCountsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [McoReoveryCountsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(McoReoveryCountsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
