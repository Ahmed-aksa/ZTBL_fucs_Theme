import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClDocumentViewComponent} from './cl-document-view.component';

describe('ClDocumentViewComponent', () => {
    let component: ClDocumentViewComponent;
    let fixture: ComponentFixture<ClDocumentViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ClDocumentViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClDocumentViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
