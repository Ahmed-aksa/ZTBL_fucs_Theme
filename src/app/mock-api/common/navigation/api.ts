import {Injectable} from '@angular/core';
import {cloneDeep} from 'lodash-es';
import {FuseNavigationItem} from '@fuse/components/navigation';
import {FuseMockApiService} from '@fuse/lib/mock-api';
import {
    compactNavigation,
    defaultNavigation,
    futuristicNavigation,
    horizontalNavigation
} from 'app/mock-api/common/navigation/data';

@Injectable({
    providedIn: 'root'
})
export class NavigationMockApi {
    private readonly _compactNavigation: FuseNavigationItem[] = compactNavigation;
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] = futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] = horizontalNavigation;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        let menus = JSON.parse(localStorage.getItem('ZTBLUser'))?.MenuBar;
        if (menus) {
            menus.forEach((single_menu, index_parent) => {
                if (single_menu.IsActive) {
                    single_menu.forEach((single_child_menu, index) => {
                        if (!single_child_menu.IsActive) {
                            single_child_menu.splice(index, 1);
                        }
                    });
                } else {
                    menus.splice(index_parent, 1)
                }
            });
        }

        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {

                // Fill compact navigation children using the default navigation
                this._compactNavigation.forEach((compactNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if (defaultNavItem.id === compactNavItem.id) {
                            compactNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });
                return [
                    200,
                    {
                        // compact   : cloneDeep(this._compactNavigation),
                        default: cloneDeep(menus),
                        //futuristic: cloneDeep(this._futuristicNavigation),
                        //horizontal: cloneDeep(this._horizontalNavigation)
                    }
                ];
            });
    }
}
