import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoanInformationDetailComponent} from './loan-information-detail.component';

describe('LoanInformationDetailComponent', () => {
    let component: LoanInformationDetailComponent;
    let fixture: ComponentFixture<LoanInformationDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoanInformationDetailComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoanInformationDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
