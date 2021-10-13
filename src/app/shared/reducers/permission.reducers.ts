// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { Permission } from 'app/modules/user-management/assign-pages/permission.model';
import { PermissionActions, PermissionActionTypes } from '../actions/permission.actions';
// Actions


export interface PermissionsState extends EntityState<Permission> {
    _isAllPermissionsLoaded: boolean;
}

export const adapter: EntityAdapter<Permission> = createEntityAdapter<Permission>();

export const initialPermissionsState: PermissionsState = adapter.getInitialState({
    _isAllPermissionsLoaded: false
});

export function permissionsReducer(state = initialPermissionsState, action: PermissionActions): PermissionsState {
    switch  (action.type) {
        case PermissionActionTypes.AllPermissionsRequested:
            return {...state,
                _isAllPermissionsLoaded: false
        };
        case PermissionActionTypes.AllPermissionsLoaded:
            return adapter.addMany(action.payload.permissions, {
                ...state,
                _isAllPermissionsLoaded: true
            });
        default:
            return state;
    }
}

export const getRoleState = createFeatureSelector<PermissionsState>('permissions');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
