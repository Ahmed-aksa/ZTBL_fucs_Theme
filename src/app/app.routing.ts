import {Route} from '@angular/router';
import {AuthGuard} from 'app/core/auth/guards/auth.guard';
import {NoAuthGuard} from 'app/core/auth/guards/noAuth.guard';
import {LayoutComponent} from 'app/layout/layout.component';
import {InitialDataResolver} from 'app/app.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
    {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'auth', loadChildren: () => import('app/modules/auth/auth.module').then(m => m.AuthModule)
            }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)
            },
            {
                path: 'unlock-session',
                loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)
            },

        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'home',
                loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)
            },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'user-management',
                loadChildren: () => import('app/modules/user-management/user-management.module').then(m => m.UserManagementModule)
            },
            {
                path: 'geo-fencing',
                loadChildren: () => import('app/modules/geo-fencing/geo-fencing.module').then(m => m.GeoFencingModule)
            },
            {
                path: 'borrower-information',
                loadChildren: () => import('app/modules/borrower-information/borrower-information.module').then(m => m.BorrowerInformationModule)
            },
            {
                path: 'configuration-management',
                loadChildren: () => import('app/modules/configuration-management/configuration-management.module').then(m => m.ConfigurationManagementModule)
            },
            {
                path: 'report-management',
                loadChildren: () => import('app/modules/report-managment/report-managment.module').then(m => m.ReportManagmentModule)
            },
            {
                path: 'loan-recovery',
                loadChildren: () => import('app/modules/loan-recover/loan-recover.module').then(m => m.LoanRecoverModule)
            },
            {
                path: 'loan',
                loadChildren: () => import('app/modules/loan/loan.module').then(m => m.LoanModule)
            },
            {
                path: 'loan-utilization',
                loadChildren: () => import('app/modules/loan-utilization/loan-utilization.module').then(m => m.LoanUtilizationModule)
            },
            {
                path: 'journal-voucher',
                loadChildren: () => import('app/modules/journal-voucher/journal-voucher.module').then(m => m.JournalVoucherModule)
            },
            {
                path: '**',
                redirectTo: 'dashboard',
            }
        ]
    }
];
