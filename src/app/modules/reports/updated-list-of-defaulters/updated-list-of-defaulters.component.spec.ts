import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdatedListOfDefaultersComponent} from './updated-list-of-defaulters.component';

describe('UpdatedListOfDefaultersComponent', () => {
    let component: UpdatedListOfDefaultersComponent;
    let fixture: ComponentFixture<UpdatedListOfDefaultersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UpdatedListOfDefaultersComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UpdatedListOfDefaultersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
