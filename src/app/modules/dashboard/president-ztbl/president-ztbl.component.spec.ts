import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PresidentZtblComponent} from './president-ztbl.component';

describe('PresidentZtblComponent', () => {
    let component: PresidentZtblComponent;
    let fixture: ComponentFixture<PresidentZtblComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PresidentZtblComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PresidentZtblComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
