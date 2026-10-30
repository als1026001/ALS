import { Routes } from '@angular/router';
import { routePermissionGuard } from '../../core/guards/route-permission.guard';

export const featureRoutes: Routes = [
    {
        path: 'tenant',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/tenant' },
        loadComponent: () =>
            import('./tenant/tenant').then(m => m.Tenant)
    },
    {
        path: 'menuTranslation',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/menuTranslation' },
        loadComponent: () =>
            import('./menu-translation/menu-translation').then(m => m.MenuTranslation)
    },
    {
        path: 'uiTranslation',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/uiTranslation' },
        loadComponent: () =>
            import('./ui-translation/ui-translation').then(m => m.UiTranslation)
    },
    {
        path: 'permissionAdminScope',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/permissionAdminScope' },
        loadComponent: () =>
            import('./permission-admin-scope/permission-admin-scope').then(m => m.PermissionAdminScope)
    },
    {
        path: 'permissionAdminRoleScope',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/permissionAdminRoleScope' },
        loadComponent: () =>
            import('./permission-admin-role-scope/permission-admin-role-scope').then(m => m.PermissionAdminRoleScope)
    },
];
