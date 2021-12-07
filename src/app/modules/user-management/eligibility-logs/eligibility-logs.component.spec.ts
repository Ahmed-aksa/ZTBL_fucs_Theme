import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EligibilityLogsComponent} from './eligibility-logs.component';

describe('EligibilityLogsComponent', () => {
    let component: EligibilityLogsComponent;
    let fixture: ComponentFixture<EligibilityLogsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EligibilityLogsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EligibilityLogsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
