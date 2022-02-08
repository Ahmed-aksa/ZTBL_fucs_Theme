import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TourDiaryZmComponent} from './tour-dairy-zm.component';

describe('TourDiaryZmComponent', () => {
    let component: TourDiaryZmComponent;
    let fixture: ComponentFixture<TourDiaryZmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TourDiaryZmComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDiaryZmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
