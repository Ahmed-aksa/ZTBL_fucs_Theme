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
import {SharedModule} from "./shared/shared.module";
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { metaReducers, reducers } from './shared/reducers';
import { HttpUtilsService } from './shared/services/http_utils.service';
import { TypesUtilsService } from './shared/services/types-utils.service';
import { LayoutUtilsService } from './shared/services/layout-utils.service';
import { UserUtilsService } from './shared/services/user-utils.service';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent
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

        StoreModule.forRoot(reducers, {metaReducers}),
		EffectsModule.forRoot([]),
    ],
    providers: [
        HttpUtilsService,
        UserUtilsService,
        LayoutUtilsService 
    ],
    bootstrap: [
        AppComponent
    ],
  
})
export class AppModule {
}
