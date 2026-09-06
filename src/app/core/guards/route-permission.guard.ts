import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { PermissionService } from '../services/permission.service';

export const routePermissionGuard: CanActivateFn = (route) => {
    const permissions = inject(PermissionService);
    const router = inject(Router);
    const routerLink = route.data['permissionRoute'] as string | undefined;

    if (!routerLink) {
        return router.createUrlTree(['/auth/access']);
    }

    return permissions.getRouteAccess(routerLink).pipe(
        map((access) => access.canView ? true : router.createUrlTree(['/auth/access'])),
        catchError(() => of(router.createUrlTree(['/auth/access'])))
    );
};
