import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IntimateLoanerTextComponent} from './intimate-loaner-text.component';

describe('IntimateLoanerTextComponent', () => {
    let component: IntimateLoanerTextComponent;
    let fixture: ComponentFixture<IntimateLoanerTextComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IntimateLoanerTextComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IntimateLoanerTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
