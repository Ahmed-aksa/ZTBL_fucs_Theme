import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LargeFilesUploadComponent} from './large-files-upload.component';

describe('LargeFilesUploadComponent', () => {
    let component: LargeFilesUploadComponent;
    let fixture: ComponentFixture<LargeFilesUploadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LargeFilesUploadComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LargeFilesUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
