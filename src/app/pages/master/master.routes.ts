import { Routes } from '@angular/router';
import { routePermissionGuard } from '../../core/guards/route-permission.guard';

export const featureRoutes: Routes = [
    {
        path: 'province',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/province' },
        loadComponent: () =>
            import('./province/province').then(m => m.Province)
    },
    {
        path: 'ward',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/ward' },
        loadComponent: () =>
            import('./ward/ward').then(m => m.Ward)
    },
    {
        path: 'attendantDevice',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/attendantDevice' },
        loadComponent: () =>
            import('./attendant-device/attendant-device').then(m => m.AttendantDevice)
    },
];
