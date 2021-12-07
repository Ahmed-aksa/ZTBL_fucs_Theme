import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FaViewCircleWiseComponent} from './fa-view-circle-wise.component';

describe('FaViewCircleWiseComponent', () => {
    let component: FaViewCircleWiseComponent;
    let fixture: ComponentFixture<FaViewCircleWiseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FaViewCircleWiseComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FaViewCircleWiseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
