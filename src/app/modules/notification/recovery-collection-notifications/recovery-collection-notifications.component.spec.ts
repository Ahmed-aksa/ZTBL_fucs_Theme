import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RecoveryCollectionNotificationsComponent} from './recovery-collection-notifications.component';

describe('RecoveryCollectionNotificationsComponent', () => {
    let component: RecoveryCollectionNotificationsComponent;
    let fixture: ComponentFixture<RecoveryCollectionNotificationsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RecoveryCollectionNotificationsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecoveryCollectionNotificationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
