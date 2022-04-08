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
import {EncryptDecryptService} from "../../../shared/services/encrypt_decrypt.service";

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
    constructor(private _fuseMockApiService: FuseMockApiService, private enc: EncryptDecryptService) {
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
        let menus = JSON.parse(this.enc.decryptStorageData(localStorage.getItem('ZTBLUser')))?.MenuBar;
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
