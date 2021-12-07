import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GeoFencingListComponent} from './geo-fencing-list.component';

describe('GeoFencingListComponent', () => {
    let component: GeoFencingListComponent;
    let fixture: ComponentFixture<GeoFencingListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GeoFencingListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GeoFencingListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
