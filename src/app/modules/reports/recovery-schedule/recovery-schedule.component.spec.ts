import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RecoveryScheduleComponent} from './recovery-schedule.component';

describe('RecoveryScheduleComponent', () => {
    let component: RecoveryScheduleComponent;
    let fixture: ComponentFixture<RecoveryScheduleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RecoveryScheduleComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecoveryScheduleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
