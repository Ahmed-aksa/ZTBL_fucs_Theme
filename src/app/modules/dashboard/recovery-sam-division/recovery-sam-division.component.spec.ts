import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RecoverySamDivisionComponent} from './recovery-sam-division.component';

describe('RecoverySamDivisionComponent', () => {
    let component: RecoverySamDivisionComponent;
    let fixture: ComponentFixture<RecoverySamDivisionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RecoverySamDivisionComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecoverySamDivisionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
