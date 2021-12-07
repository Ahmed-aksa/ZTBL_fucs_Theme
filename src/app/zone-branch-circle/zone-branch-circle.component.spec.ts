import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ZoneBranchCircleComponent} from './zone-branch-circle.component';

describe('ZoneBranchCircleComponent', () => {
    let component: ZoneBranchCircleComponent;
    let fixture: ComponentFixture<ZoneBranchCircleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ZoneBranchCircleComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ZoneBranchCircleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
