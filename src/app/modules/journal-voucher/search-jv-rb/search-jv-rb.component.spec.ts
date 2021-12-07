import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchJvRbComponent} from './search-jv-rb.component';

describe('SearchJvRbComponent', () => {
    let component: SearchJvRbComponent;
    let fixture: ComponentFixture<SearchJvRbComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchJvRbComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchJvRbComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
