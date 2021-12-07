import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BorrowerInformationComponent} from './borrower-information.component';

describe('BorrowerInformationComponent', () => {
    let component: BorrowerInformationComponent;
    let fixture: ComponentFixture<BorrowerInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BorrowerInformationComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BorrowerInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
