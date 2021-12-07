import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignatureDailogDairyComponent} from './signature-dailog-dairy.component';

describe('SignatureDailogDairyComponent', () => {
    let component: SignatureDailogDairyComponent;
    let fixture: ComponentFixture<SignatureDailogDairyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SignatureDailogDairyComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SignatureDailogDairyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
