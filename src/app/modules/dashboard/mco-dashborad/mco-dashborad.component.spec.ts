import {ComponentFixture, TestBed} from '@angular/core/testing';

import {McoDashboradComponent} from './mco-dashborad.component';

describe('McoDashboradComponent', () => {
    let component: McoDashboradComponent;
    let fixture: ComponentFixture<McoDashboradComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [McoDashboradComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(McoDashboradComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
