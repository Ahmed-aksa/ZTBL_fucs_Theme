import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MapReqDialogComponent} from './map-req-dialog.component';

describe('MapReqDialogComponent', () => {
    let component: MapReqDialogComponent;
    let fixture: ComponentFixture<MapReqDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MapReqDialogComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MapReqDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
