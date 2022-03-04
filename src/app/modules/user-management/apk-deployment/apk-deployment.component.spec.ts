import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ApkDeploymentComponent} from './apk-deployment.component';

describe('ApkDeploymentComponent', () => {
    let component: ApkDeploymentComponent;
    let fixture: ComponentFixture<ApkDeploymentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApkDeploymentComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApkDeploymentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
