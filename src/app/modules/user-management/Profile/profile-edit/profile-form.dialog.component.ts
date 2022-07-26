import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Activity, Profile} from '../../activity/activity.model';
import {ProfileService} from 'app/shared/services/profile.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {ActivityService} from '../../activity/activity.serivce';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {RoleEditComponent} from '../role-edit/role-edit.component';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'kt-profile-form.dialog',
    templateUrl: './profile-form.dialog.component.html',
    styleUrls: ['profile-form.dialog.component.scss'],
})
export class ProfileFormDialogComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    displayedColumnsPortal = ['activityName', 'create', 'read', 'update', 'delete'];
    displayedColumnsActivity = ['activityName'];
    expanded: boolean = false;
    create = 'Cr';
    update = 'U';
    delete = 'D';
    read = 'R';
    loading: boolean;
    AllowShow: boolean;
    ActivityShow: boolean;
    SaveButtonShow: boolean;
    ShowButton: boolean;
    saving = false;
    submitted = false;
    profileForm: FormGroup;
    profile: Profile = new Profile();
    hasFormErrors = false;
    viewLoading = false;
    loadingAfterSubmit = false;
    activities: Activity[] = [];
    baseActivities: Activity[] = [];
    public activity = new Activity();
    userActivities: any[] = [];
    isActivityStringValid: boolean;
    gridHeight: string = '10px';
    profiles: any[];
    SingleProfile: any;
    isLoading: boolean = false;
    _currentActivity: Activity = new Activity();
    lists_record: any = [];
    private componentSubscriptions: Subscription;

    /**
     * Component constructor
     *
     * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
     * @param data: any
     * @param store: Store<AppState>
     */
    constructor(
        private _profileService: ProfileService,
        private formBuilder: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private _activityService: ActivityService,
        private _cdf: ChangeDetectorRef,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private spinner: NgxSpinnerService,
        private userUtilsService: UserUtilsService
    ) {
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit() {

        this.AllowShow = true;
        this.ShowButton = true;
        this.ActivityShow = true;
        this.SaveButtonShow = true;
        this.isActivityStringValid = true;
        this.profileForm = this.formBuilder.group({
            ProfileID: [this.profile.ProfileID, [Validators.required, Validators.maxLength(60)],],
            App: [this.profile.ProfileID],
            Portal: [this.profile.ProfileID]
        });


        this.GetAllProfiles();

        this._currentActivity = this.userUtilsService.getActivity('Pages');

    }

    ngAfterViewInit() {
        this.gridHeight = window.innerHeight - 390 + 'px';
    }


    GetAllProfiles() {

        this._profileService.getAllProfiles()
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.profiles = baseResponse.Profiles;
                    this._cdf.detectChanges();
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }
            });
    }

    GetActivities() {
        this.spinner.show();
        this.activity = new Activity();

        this._activityService.getAllActivities(this.activity).pipe(finalize(() => {
            this.spinner.hide()
        })).subscribe((response: BaseResponseModel) => {
            this.activities = response.Activities;

            this.dataSource.data = response.Activities;
            this.getBaseActivity();
            this.activities.forEach((o, i) => {

                o.C = false;
                o.R = false;
                o.U = false;
                o.D = false;
            });

        });

    }

    getBaseActivity() {
        this._activityService.getAllActivities(this.activity).subscribe((response: BaseResponseModel) => {
            this.baseActivities = response.Activities;
        });
    }

    getProfile(ProfileID) {

        this.spinner.show()
        this.ShowButton = false;
        this.AllowShow = false;
        this.ActivityShow = false;
        this.SingleProfile = this.profiles.filter(p => p.ProfileID == ProfileID.value);
        this.GetActivities();

        if (true) {

            this.loading = true;
            this.profile.ProfileID = ProfileID.value;
            this._profileService
                .getProfileByID(this.profile)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                        this.spinner.hide()
                    })
                )
                .subscribe((baseResponse: any) => {
                    if (baseResponse.Success) {

                        this.userActivities = baseResponse.Activities;
                        document.getElementById('focus-removal').className = document.getElementById('focus-removal').className.replace('mat-focused', '');
                        var newActivities = this.userActivities;
                        if (this.userActivities.length > 0) {
                            this.userActivities.forEach((o, i) => {
                                newActivities.forEach((oo, i) => {
                                    if (o.ActivityID == oo.ActivityID) {
                                        oo.C = o.C;
                                        oo.R = o.R;
                                        oo.U = o.U;
                                        oo.D = o.D;
                                        this.changeActivityItemCheckbox(o.ActivityID);
                                    }

                                });


                            });

                            // this.profileForm.controls['ProfileID'].setValue(this.userActivities[0].ProfileID);

                        }

                    } else {

                        this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                    }
                });

            this._cdf.detectChanges();
        }
    }


    changeActivityItemCheckbox(activityId: number) {

        this.isActivityStringValid = true;
        var parent = this.userActivities.filter(x => x.ActivityID == activityId)[0];

        this.activities.forEach((o, i) => {
            if (o.ActivityID == activityId) {
                if (o.C == true || o.R == true || o.U == true || o.D == true) {
                    o.isActivityChecked = true;
                    parent.isActivityChecked = true;
                } else {
                    o.isActivityChecked = false;
                }
                o.R = true;
            }
        });
        this.checkParentActivityCheckbox(activityId);
    }

    checkParentActivityCheckbox(activityId: number) {

        var parentActivityId = this.userActivities.filter(x => x.ActivityID == activityId)[0]?.ParentActivityID;
        var isParentChecked = false;
        var childActivities = this.userActivities.filter(x => x.ParentActivityID == parentActivityId);
        childActivities.forEach((o, i) => {
            if (o.isActivityChecked == true) {
                isParentChecked = true;
            }
        });

        this.activities.forEach((o, i) => {
            if (o.ActivityID == parentActivityId) {
                o.isActivityChecked = isParentChecked;
            }
        });
    }

    onSubmit(): void {
        let flat_array = [];
        this.userActivities.forEach(activity => {
            activity.ChildActvities.forEach(child => {
                flat_array.push(child);
            });
        });
        this.spinner.show();
        this._profileService
            .updateProfile(flat_array, this.profile.ProfileID)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                    this.submitted = false;
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                    //this.close(this.profile);
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }
            });

    }


    /**
     * On destroy
     */
    ngOnDestroy() {
        if (this.componentSubscriptions) {
            this.componentSubscriptions.unsubscribe();
        }
    }


    /**
     * Returns role for save
     */


    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    getTitle(): string {
        //if (this.data.profile && this.data.profile.ProfileID) {
        //  return 'Edit Profile';
        //}
        return 'Assign Pages';
    }

    toggleAccordion(activity_id) {
        if (!this.lists_record.includes(activity_id)) {
            this.lists_record.push(activity_id)
            document.getElementById('table_' + activity_id).style.display = 'block';
        } else {
            this.lists_record.pop(activity_id);
            document.getElementById('table_' + activity_id).style.display = 'none';
        }
    }

    updateActivityDetails(parentActivityId, childActivityID, operation, currentCheckBox) {

        let childActivity = this.userActivities.filter(activity => activity.ActivityID == parentActivityId)[0]
            .ChildActvities.filter(childActivity => childActivity.ActivityID == childActivityID)[0];
        if (operation == 'read') {
            if (currentCheckBox == false) {
                childActivity.R = true;
            } else {
                childActivity.R = false;
            }
        } else if (operation == 'update') {
            if (currentCheckBox == false) {
                childActivity.U = true;
            } else {
                childActivity.U = false;
            }
        } else if (operation == 'create') {
            if (currentCheckBox == false) {
                childActivity.C = true;
            } else {
                childActivity.C = false;
            }
        } else if (operation == 'delete') {
            if (currentCheckBox == false) {
                childActivity.D = true;
            } else {
                childActivity.D = false;
            }
        }

    }

    updateAllActivityDetails(event=null, ActivityID: any, child: any, from_all = null) {
        if (!from_all) {
            // @ts-ignore
            document.getElementById(ActivityID + 'activity').checked = false;
        }
        if (event.target.checked) {
            child.C = child.R = child.U = child.D = false;
            this.updateActivityDetails(ActivityID, child.ActivityID, 'create', child.C ? true : false)
            this.updateActivityDetails(ActivityID, child.ActivityID, 'read', child.R ? true : false)
            this.updateActivityDetails(ActivityID, child.ActivityID, 'update', child.U ? true : false)
            this.updateActivityDetails(ActivityID, child.ActivityID, 'delete', child.D ? true : false)
        } else {
            child.C = child.R = child.U = child.D = true;
            this.updateActivityDetails(ActivityID, child.ActivityID, 'create', child.C ? true : false)
            this.updateActivityDetails(ActivityID, child.ActivityID, 'read', child.R ? true : false)
            this.updateActivityDetails(ActivityID, child.ActivityID, 'update', child.U ? true : false)
            this.updateActivityDetails(ActivityID, child.ActivityID, 'delete', child.D ? true : false)
        }
    }

    updateGeneralActivityDetails($event: Event, activity) {

        activity.ChildActvities.forEach(single_child => {
            this.updateAllActivityDetails($event, activity.ActivityID, single_child, true);
            // @ts-ignore
            document.getElementById(single_child.ActivityID).checked = $event.target.checked;
        })
    }

    SelectedAllStatus(activityId){

        var status=true;
        this.userActivities.forEach((x)=>{
            if(x.ActivityID==activityId){
                    x.ChildActvities.forEach((y)=>{
                        if(y.C == false || y.R == false || y.U == false || y.D== false){
                            if(status){
                                status = false;
                            }
                        }
                    })
            }
        });
        return status;
    }
}

export interface ActivityId{
    ActivityID: any;
}
