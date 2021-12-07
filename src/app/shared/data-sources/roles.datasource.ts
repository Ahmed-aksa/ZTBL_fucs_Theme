import {of} from 'rxjs';
import {catchError, finalize, tap, debounceTime, delay, distinctUntilChanged} from 'rxjs/operators';

import {Store, select} from '@ngrx/store';
import {AppState} from '../reducers';
import {
    selectQueryResult,
    selectRolesPageLoading,
    selectRolesShowInitWaitingMessage
} from '../selectors/role.selectors';
import {QueryResultsModel} from '../models/query-result.model';
import {BaseDataSource} from '../models/_base.datasource';


export class RolesDataSource extends BaseDataSource {
    constructor(private store: Store<AppState>) {
        super();

        this.loading$ = this.store.pipe(
            select(selectRolesPageLoading)
        );

        this.isPreloadTextViewed$ = this.store.pipe(
            select(selectRolesShowInitWaitingMessage)
        );

        this.store.pipe(
            select(selectQueryResult)
        ).subscribe((response: QueryResultsModel) => {
            this.paginatorTotalSubject.next(response.totalCount);
            this.entitySubject.next(response.items);
        });

    }
}
