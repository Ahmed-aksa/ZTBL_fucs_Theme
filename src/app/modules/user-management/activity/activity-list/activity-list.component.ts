// Angular
import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    ChangeDetectionStrategy,
    OnDestroy,
    ChangeDetectorRef, AfterViewInit
} from '@angular/core';

import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LayoutUtilsService, MessageType} from 'app/shared/services/layout_utils.service';
import {ActivityService} from '../activity.serivce';
import {Activity, Profile} from '../activity.model';
import {finalize} from 'rxjs/operators';
import {ActivityFormDialogComponent} from '../activity-edit/activity-form.dialog.component';
import {ProfileService} from '../profile.service';

;

//import { BaseComponentPage } from '../../../base-component.component';

@Component({
    selector: 'kt-activity-list',
    templateUrl: './activity-list.component.html',
    styleUrls: ['activity-list.component.scss'],

})
export class ActivityListComponent implements OnInit {
    // Table fields
    profile: Profile = new Profile();
    // Selection
    selection = new SelectionModel<Activity>(true, []);
    activitiesResult: Activity[] = [];
    baseActivities: Activity[] = [];
    activities: Activity[] = [];
    gridHeight: string;
    userActivities: any;

    public activity = new Activity();

    lists_record: any = [];

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private layoutUtilsService: LayoutUtilsService,
        private _cdf: ChangeDetectorRef,
        private _profileService: ProfileService,
        private _activityService: ActivityService,
        private cdRef: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.getUserActivities();

    }

    ngAfterViewInit() {
    }

    deleteActivity(_item: Activity) {
        const _title = 'Activity';
        const _description = 'Are you sure to permanently delete this activity?';
        const _waitDesciption = 'Activity is deleting...';
        const _deleteMessage = `Activity has been deleted`;

        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }

            this.activity = new Activity();
            this.activity.ActivityID = _item.ActivityID;

            this._activityService.deleteActivity(this.activity).pipe(
                finalize(() => {
                })
            ).subscribe((baseResponse) => {
                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                    this.getUserActivities();

                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }
            });


        });


    }

    addActivity() {

        const newActivity = new Activity();
        newActivity.clear(); // Set all defaults fields
        this.editActivity(newActivity);


    }

    editActivity(activity: Activity) {
        const _saveMessage = activity.ActivityID ? 'New activity successfully has been added.' : 'Activity successfully has been updated.';
        const _messageType = activity.ActivityID ? MessageType.Update : MessageType.Create;
        const dialogRef = this.dialog.open(ActivityFormDialogComponent, {
            width: '840px',
            data: {activity: activity},
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.getUserActivities();

        });

    }


    toggleAccordion(activity_id: string) {
        if (!this.lists_record.includes(activity_id)) {
            this.lists_record.push(activity_id)
            document.getElementById('table_' + activity_id).style.display = 'block';
        } else {
            this.lists_record.pop(activity_id);
            document.getElementById('table_' + activity_id).style.display = 'none';
        }
    }

    getUserActivities() {
        this.profile.ProfileID = 1;
        this._profileService
            .getProfileByID(this.profile)
            .subscribe((baseResponse: any) => {
                if (baseResponse.Success) {
                    this.userActivities = baseResponse.Activities;
                    this.cdRef.detectChanges();
                    this.expendTable();
                }
            });
    }

    expendTable() {
        this.lists_record.forEach(i => {
            document.getElementById('table_' + i).style.display = 'block';
        });
    }
}
