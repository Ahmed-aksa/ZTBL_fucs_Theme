import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpcomingVisitsComponent} from './upcoming-visits.component';

describe('UpcomingVisitsComponent', () => {
    let component: UpcomingVisitsComponent;
    let fixture: ComponentFixture<UpcomingVisitsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UpcomingVisitsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UpcomingVisitsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
