import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchRcComponent} from './search-rc.component';

describe('SearchRcComponent', () => {
    let component: SearchRcComponent;
    let fixture: ComponentFixture<SearchRcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchRcComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchRcComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
