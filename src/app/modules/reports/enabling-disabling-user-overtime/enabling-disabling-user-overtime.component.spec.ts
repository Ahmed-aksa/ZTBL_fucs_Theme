import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EnablingDisablingUserOvertimeComponent} from './enabling-disabling-user-overtime.component';

describe('EnablingDisablingUserOvertimeComponent', () => {
    let component: EnablingDisablingUserOvertimeComponent;
    let fixture: ComponentFixture<EnablingDisablingUserOvertimeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EnablingDisablingUserOvertimeComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EnablingDisablingUserOvertimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
