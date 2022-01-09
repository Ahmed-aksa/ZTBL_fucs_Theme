import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LayoutUtilsService} from "../../../shared/services/layout-utils.service";
import {TourPlan} from '../Model/tour-plan.model';
import {TourPlanService} from "../Service/tour-plan.service";
import {CircleService} from "../../../shared/services/circle.service";
import {CommonService} from "../../../shared/services/common.service";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Circle} from 'app/shared/models/circle.model';
import {Branch} from 'app/shared/models/branch.model';
import {Zone} from 'app/shared/models/zone.model';
import {SlashDateFormats} from "../../../shared/models/slash-format.class";

@Component({
    selector: 'create-tour-plan',
    templateUrl: './create-tour-plan.component.html',
    styleUrls: ['./create-tour-plan.component.scss'],
})
export class CreateTourLlanComponent implements OnInit {
    tourPlanForm: FormGroup;

    branch: any;
    zone: any;
    circle: any;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.createForm();
    }

    private createForm() {
        this.tourPlanForm = this.fb.group({});
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }
}
