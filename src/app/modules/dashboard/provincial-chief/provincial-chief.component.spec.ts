import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProvincialChiefComponent} from './provincial-chief.component';

describe('ProvincialChiefComponent', () => {
    let component: ProvincialChiefComponent;
    let fixture: ComponentFixture<ProvincialChiefComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProvincialChiefComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProvincialChiefComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
