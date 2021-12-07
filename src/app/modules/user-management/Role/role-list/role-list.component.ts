import {SelectionModel} from '@angular/cdk/collections';
import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Store} from '@ngrx/store';
import {Activity} from 'app/shared/models/activity.model';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {AppState} from 'app/shared/reducers';
import {LayoutUtilsService, MessageType} from 'app/shared/services/layout_utils.service';
import {temperature} from 'chroma-js';
import {NgxSpinnerService} from 'ngx-spinner';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {Profile} from '../../activity/activity.model';
import {ActivityService} from '../../activity/activity.serivce';
import {ProfileService} from '../../activity/profile.service';
import {CreateEditRoleComponent} from '../create-edit-role/create-edit-role.component';

@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
    providers: [ProfileService]
})
export class RoleListComponent implements OnInit, OnDestroy {

    dataSource = new MatTableDataSource();
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    loading: boolean;
    displayedColumns = ['name', 'GroupName', 'Description', 'actions'];
    itemsPerPage = 5;
    pageIndex = 1;
    offSet = 0;
    matTableLenght: boolean = false;
    totalItems: number | any;
    dv: number | any; //use later
    selection = new SelectionModel<Activity>(true, []);
    activitiesResult: Activity[] = [];
    baseActivities: Activity[] = [];
    activities: Activity[] = [];
    gridHeight: string;
    profiles: any[];
    public activity = new Activity();


    ////


    isLoading: boolean = true;
    products$: Observable<any[]>;

    constructor(
        private _profileService: ProfileService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private layoutUtilsService: LayoutUtilsService,
        private _cdf: ChangeDetectorRef,
        private _activityService: ActivityService,
        private spinner: NgxSpinnerService) {
    }

    ngOnInit() {

        //this.loadActivityList();
        this.GetAllProfiles();

    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.offSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }

    GetAllProfiles() {
        this.spinner.show()
        this.loading = true;
        this._profileService.getAllProfiles()
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.profiles = baseResponse.Profiles;
                    this.dataSource.data = this.profiles;
                    this.dv = this.dataSource.data;
                    this.matTableLenght = true
                    this.totalItems = this.profiles.length;
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }
            });
    }

    loadActivityList() {
        this.loading = true;
        this.activity = new Activity();
        this._activityService.getActivitiesList()
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {
                this.activities = baseResponse.Activities;
                this.dataSource.data = baseResponse.Activities;
                this.activities.forEach((o, i) => {
                    o.C = false;
                    o.R = false;
                    o.U = false;
                    o.D = false;
                });

                this.getBaseActivity();
            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
            }

        });
    }

    getBaseActivity() {
        this._activityService.getActivitiesList().subscribe((response: BaseResponseModel) => {
            this.baseActivities = response.Activities;
            this.activities.forEach((o, i) => {
                this.baseActivities.forEach((oo, i) => {
                    if (o.ActivityID == oo.ActivityID) {
                        o.C = oo.C;
                        o.D = oo.D;
                        o.U = oo.U;
                        o.R = oo.R;
                        o.IsParent = oo.IsParent == '1' ? 1 : 0;
                    }
                });
            });
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 300 + 'px';
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }


    loadActivitiesPage() {
        this.loadActivityList();
    }

    filterConfiguration(): any {
        const filter: any = {};
        const searchText: string = this.searchInput.nativeElement.value;
        filter.title = searchText;
        return filter;
    }


    ngOnDestroy() {
        //this.subscriptions.forEach(el => el.unsubscribe());
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
            this.activity.ActivityID = _item.ProfileID;

            this._activityService.deleteActivity(this.activity).pipe(
                finalize(() => {

                })
            ).subscribe((x) => {
                this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
                this.loadActivitiesPage();


            });

        });
    }

    // addRole() {
    //   const newActivity = new Profile();
    //   // newActivity.clear(); // Set all defaults fields
    //   this.editRole(newActivity);
    // }

    // editRole(profile: Profile) {

    //   const _saveMessage = profile.ProfileID ? 'New activity successfully has been added.' : 'Activity successfully has been updated.';
    //   const _messageType = profile.ProfileID ? MessageType.Update : MessageType.Create;
    //   const dialogRef = this.dialog.open(CreateEditRoleComponent, { data: { profile: profile }, disableClose: true });
    //   dialogRef.afterClosed().subscribe(res => {

    //     if (!res) {
    //       return;
    //     }

    //     this.loadActivitiesPage();
    //   });
    // }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.activitiesResult.length;
        return numSelected === numRows;
    }

    /**
     * Toggle selection
     */
    masterToggle() {
        if (this.selection.selected.length === this.activitiesResult.length) {
            this.selection.clear();
        } else {
            this.activitiesResult.forEach(row => this.selection.select(row));
        }
    }


    createOrEditItem(item?: any) {
        const dialogRef = this.dialog.open(CreateEditRoleComponent, {
            width: '840px',
            data: {profile: item},
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {

            if (!res) {
                return;
            }

            this.loadActivitiesPage();
        });
    }

    MathCeil(value: any) {
        return Math.ceil(value);
    }
}
