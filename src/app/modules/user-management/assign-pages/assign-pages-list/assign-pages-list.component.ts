import {Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {debounceTime, distinctUntilChanged, tap, skip, take, delay} from 'rxjs/operators';
import {fromEvent, merge, Observable, of, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {AssignPageEditDialogComponent} from '../assign-pages-edit/assign-pages-edit.dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Role} from '../role.model';
import {AppState} from 'app/shared/reducers';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LayoutUtilsService, MessageType} from 'app/shared/services/layout_utils.service';
import {QueryParamsModel} from 'app/shared/models/query_params.model';
import {RoleDeleted, RolesPageRequested} from 'app/shared/actions/role.actions';
import {RolesDataSource} from 'app/shared/data-sources/roles.datasource';

@Component({
    selector: 'kt-assign-pages-list',
    templateUrl: './assign-pages-list.component.html',
    styleUrls: ['assign-pages-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignPageListComponent implements OnInit, OnDestroy {
    // Table fields
    dataSource: RolesDataSource;
    displayedColumns = ['select', 'id', 'title', 'actions'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild('sort1', {static: true}) sort: MatSort;

    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;

    selection = new SelectionModel<Role>(true, []);
    rolesResult: Role[] = [];


    private subscriptions: Subscription[] = [];


    constructor(
        private store: Store<AppState>,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private layoutUtilsService: LayoutUtilsService) {
    }

    ngOnInit() {

        const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        this.subscriptions.push(sortSubscription);

        const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
            tap(() => {
                this.loadRolesList();
            })
        )
            .subscribe();
        this.subscriptions.push(paginatorSubscriptions);


        const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
            // tslint:disable-next-line:max-line-length
            debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
            distinctUntilChanged(), // This operator will eliminate duplicate values
            tap(() => {
                this.paginator.pageIndex = 0;
                this.loadRolesList();
            })
        )
            .subscribe();
        this.subscriptions.push(searchSubscription);

        // Init DataSource
        this.dataSource = new RolesDataSource(this.store);
        const entitiesSubscription = this.dataSource.entitySubject.pipe(
            skip(1),
            distinctUntilChanged()
        ).subscribe(res => {
            this.rolesResult = res;
        });
        this.subscriptions.push(entitiesSubscription);

        // First load
        of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
            this.loadRolesList();
        });
    }

    /**
     * On Destroy
     */
    ngOnDestroy() {
        this.subscriptions.forEach(el => el.unsubscribe());
    }

    /**
     * Load Roles List
     */
    loadRolesList() {
        this.selection.clear();
        const queryParams = new QueryParamsModel(
            this.filterConfiguration(),
            this.sort.direction,
            this.sort.active,
            this.paginator.pageIndex,
            this.paginator.pageSize
        );
        // Call request from server
        this.store.dispatch(new RolesPageRequested({page: queryParams}));
        this.selection.clear();
    }

    /**
     * Returns object for filter
     */
    filterConfiguration(): any {
        const filter: any = {};
        const searchText: string = this.searchInput.nativeElement.value;
        filter.title = searchText;
        return filter;
    }

    /** ACTIONS */
    /**
     * Delete role
     *
     * @param _item: Role
     */
    deleteRole(_item: Role) {
        const _title = 'User Role';
        const _description = 'Are you sure to permanently delete this role?';
        const _waitDesciption = 'Role is deleting...';
        const _deleteMessage = `Role has been deleted`;

        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.store.dispatch(new RoleDeleted({id: _item.id}));
            this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
            this.loadRolesList();
        });
    }

    /** Fetch */
    /**
     * Fetch selected rows
     */
    fetchRoles() {
        const messages = [];
        this.selection.selected.forEach(elem => {
            messages.push({
                text: `${elem.title}`,
                id: elem.id.toString(),
                // status: elem.username
            });
        });
        this.layoutUtilsService.fetchElements(messages);
    }

    /**
     * Add role
     */
    addRole() {
        const newRole = new Role();
        newRole.clear(); // Set all defaults fields
        this.editRole(newRole);
    }

    /**
     * Edit role
     *
     * @param role: Role
     */
    editRole(role: Role) {
        const _saveMessage = `Role successfully has been saved.`;
        const _messageType = role.id ? MessageType.Update : MessageType.Create;
        const dialogRef = this.dialog.open(AssignPageEditDialogComponent, {data: {roleId: role.id}});
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }

            this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
            this.loadRolesList();
        });
    }

    /**
     * Check all rows are selected
     */
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.rolesResult.length;
        return numSelected === numRows;
    }

    /**
     * Toggle selection
     */
    masterToggle() {
        if (this.selection.selected.length === this.rolesResult.length) {
            this.selection.clear();
        } else {
            this.rolesResult.forEach(row => this.selection.select(row));
        }
    }
}
