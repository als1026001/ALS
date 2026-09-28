import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/core/guards/auth.guard';
import { routePermissionGuard } from './app/core/guards/route-permission.guard';

export const appRoutes: Routes = [
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            {
                path: 'color',
                canActivate: [routePermissionGuard],
                data: { permissionRoute: '/color' },
                loadComponent: () => import('./app/pages/master/color/color').then((m) => m.ColorPage)
            },
            {
                path: 'saleChannel',
                canActivate: [routePermissionGuard],
                data: {
                    permissionRoute: '/saleChannel'
                },
                loadComponent: () => import('./app/pages/master/sale-channel/sale-channel').then((m) => m.SaleChannelPage)
            },
            {
                path: 'expenseCategory',
                canActivate: [routePermissionGuard],
                data: {
                    permissionRoute: '/index'
                },
                loadComponent: () => import('./app/pages/master/expense-category/expense-category').then((m) => m.ExpenseCategoryPage)
            },
            {
                path: 'financialAccount',

                canActivate: [routePermissionGuard],

                data: {
                    permissionRoute: '/index'
                },

                loadComponent: () => import('./app/pages/master/financial-account/financial-account').then((m) => m.FinancialAccountPage)
            },
            {
                path: 'menuSetup',

                canActivate: [routePermissionGuard],

                data: {
                    permissionRoute: '/menuSetup'
                },

                loadComponent: () => import('./app/pages/master/menu-setup/menu-setup').then((m) => m.MenuSetupPage)
            },
            {
                path: 'menuField',

                canActivate: [routePermissionGuard],

                data: {
                    permissionRoute: '/menuField'
                },

                loadComponent: () => import('./app/pages/master/menu-field/menu-field').then((m) => m.MenuFieldComponent)
            },
            {
                path: 'menuGroup',

                canActivate: [routePermissionGuard],

                data: { permissionRoute: '/menuGroup' },

                loadComponent: () => import('./app/pages/master/menu-group/menu-group').then((m) => m.MenuGroupComponent)
            },
            {
                path: 'menuType',

                canActivate: [routePermissionGuard],

                data: { permissionRoute: '/menuType' },

                loadComponent: () => import('./app/pages/master/menu-type/menu-type').then((m) => m.MenuTypeComponent)
            },
            {
                path: 'user',

                canActivate: [routePermissionGuard],

                data: {
                    permissionRoute: '/user'
                },

                loadComponent: () => import('./app/pages/master/user/user').then((m) => m.UserComponent)
            },
            {
                path: 'userRole',

                canActivate: [routePermissionGuard],

                data: {
                    permissionRoute: '/userRole'
                },

                loadComponent: () => import('./app/pages/master/user-role/user-role').then((m) => m.UserRoleComponent)
            },
            {
                path: 'userRolePermission',

                canActivate: [routePermissionGuard],

                data: {
                    permissionRoute: '/userRolePermission'
                },

                loadComponent: () => import('./app/pages/master/user-role-permission/user-role-permission').then((m) => m.UserRolePermissionComponent)
            },
            {
                path: 'userRoleRegister',

                canActivate: [routePermissionGuard],

                data: {
                    permissionRoute: '/userRoleRegister'
                },

                loadComponent: () => import('./app/pages/master/user-role-register/user-role-register').then((m) => m.UserRoleRegisterComponent)
            },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
