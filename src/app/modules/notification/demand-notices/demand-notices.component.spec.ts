import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DemandNoticesComponent} from './demand-notices.component';

describe('DemandNoticesComponent', () => {
    let component: DemandNoticesComponent;
    let fixture: ComponentFixture<DemandNoticesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DemandNoticesComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DemandNoticesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
