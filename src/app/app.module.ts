import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExtraOptions, PreloadAllModules, RouterModule} from '@angular/router';
import {MarkdownModule} from 'ngx-markdown';
import {FuseModule} from '@fuse';
import {FuseConfigModule} from '@fuse/services/config';
import {FuseMockApiModule} from '@fuse/lib/mock-api';
import {CoreModule} from 'app/core/core.module';
import {appConfig} from 'app/core/config/app.config';
import {mockApiServices} from 'app/mock-api';
import {LayoutModule} from 'app/layout/layout.module';
import {AppComponent} from 'app/app.component';
import {appRoutes} from 'app/app.routing';
import {SharedModule} from './shared/shared.module';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {metaReducers, reducers} from './shared/reducers';
import {HttpUtilsService} from './shared/services/http_utils.service';
import {TypesUtilsService} from './shared/services/types-utils.service';
import {LayoutUtilsService} from './shared/services/layout-utils.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ConfigurationManagementComponent} from './modules/configuration-management/configuration-management.component';
import {UserUtilsService} from './shared/services/users_utils.service';
import {TokenInterceptor} from './shared/httpInterceptor/httpconfig.interceptor';
import {NdcRequestsModule} from './modules/ndc-requests/ndc-requests.module';
import {DatePipe} from "@angular/common";
import {AngularImageViewerModule} from "@clarivate/angular-image-viewer";
import { EncryptDecryptInterceptor } from './shared/httpInterceptor/encrypt_decrypt.interceptor';

const routerConfig: ExtraOptions = {
    useHash: true,
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),
        CoreModule,
        LayoutModule,
        MarkdownModule.forRoot({}),
        SharedModule,
        NdcRequestsModule,
        AngularImageViewerModule,
        StoreModule.forRoot(reducers, {metaReducers}),
        EffectsModule.forRoot([]),
    ],
    providers: [
        HttpUtilsService,
        UserUtilsService,
        LayoutUtilsService,
        DatePipe,

       
        { provide: HTTP_INTERCEPTORS, useClass: EncryptDecryptInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }

    ],
    bootstrap: [
        AppComponent
    ],
})
export class AppModule {
}
