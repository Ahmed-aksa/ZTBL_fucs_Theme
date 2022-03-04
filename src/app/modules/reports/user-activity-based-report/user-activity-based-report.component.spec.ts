import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserActivityBasedReportComponent} from './user-activity-based-report.component';

describe('UserActivityBasedReportComponent', () => {
    let component: UserActivityBasedReportComponent;
    let fixture: ComponentFixture<UserActivityBasedReportComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserActivityBasedReportComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserActivityBasedReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
