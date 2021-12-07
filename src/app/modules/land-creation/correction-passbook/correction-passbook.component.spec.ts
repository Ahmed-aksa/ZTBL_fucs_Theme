import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CorrectionPassbookComponent} from './correction-passbook.component';

describe('CorrectionPassbookComponent', () => {
    let component: CorrectionPassbookComponent;
    let fixture: ComponentFixture<CorrectionPassbookComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CorrectionPassbookComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CorrectionPassbookComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
