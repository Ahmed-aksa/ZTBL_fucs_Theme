import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CustLandInformationComponent} from './cust-land-information.component';

describe('CustLandInformationComponent', () => {
    let component: CustLandInformationComponent;
    let fixture: ComponentFixture<CustLandInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustLandInformationComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustLandInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
