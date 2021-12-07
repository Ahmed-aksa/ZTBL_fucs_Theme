import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LandHistoryComponent} from './land-history.component';

describe('LandHistoryComponent', () => {
    let component: LandHistoryComponent;
    let fixture: ComponentFixture<LandHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LandHistoryComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LandHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
