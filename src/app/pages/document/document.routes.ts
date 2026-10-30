import { Routes } from '@angular/router';
import { routePermissionGuard } from '../../core/guards/route-permission.guard';

export const featureRoutes: Routes = [
    {
        path: 'documentManagement',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/documentManagement' },
        loadComponent: () =>
            import('./document-management/document-management').then(m => m.DocumentManagement)
    },
    {
        path: 'documentFolder',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/documentFolder' },
        loadComponent: () =>
            import('./document-folder/document-folder').then(m => m.DocumentFolder)
    },
];
