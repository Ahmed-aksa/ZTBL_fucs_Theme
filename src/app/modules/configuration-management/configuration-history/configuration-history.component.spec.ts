import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfigurationHistoryComponent} from './configuration-history.component';

describe('ConfigurationHistoryComponent', () => {
    let component: ConfigurationHistoryComponent;
    let fixture: ComponentFixture<ConfigurationHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConfigurationHistoryComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigurationHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
