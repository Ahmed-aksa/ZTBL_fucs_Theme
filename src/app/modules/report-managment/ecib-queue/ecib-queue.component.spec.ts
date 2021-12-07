import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EcibQueueComponent} from './ecib-queue.component';

describe('EcibQueueComponent', () => {
    let component: EcibQueueComponent;
    let fixture: ComponentFixture<EcibQueueComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EcibQueueComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcibQueueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
