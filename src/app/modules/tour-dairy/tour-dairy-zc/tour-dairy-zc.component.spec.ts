import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TourDairyZcComponent} from './tour-dairy-zc.component';

describe('TourDairyZcComponent', () => {
    let component: TourDairyZcComponent;
    let fixture: ComponentFixture<TourDairyZcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TourDairyZcComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDairyZcComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
