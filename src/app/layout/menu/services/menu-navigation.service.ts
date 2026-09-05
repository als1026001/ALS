import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AppMenuItem } from '../menu.types';
import { LayoutService } from '@/app/layout/service/layout.service';

@Injectable({
    providedIn: 'root'
})
export class MenuNavigationService {
    private readonly router = inject(Router);
    private readonly layoutService = inject(LayoutService);

    subscribeToNavigation(callback: () => void): void {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => callback());
    }

    isRouteActive(item: AppMenuItem): boolean {
        if (!item.routerLink?.length) {
            return false;
        }

        return this.router.isActive(item.routerLink[0], {
            paths: 'exact',
            queryParams: 'ignored',
            matrixParams: 'ignored',
            fragment: 'ignored'
        });
    }

    updateActivePath(item: AppMenuItem, parentPath: string | null): void {
        if (!this.isRouteActive(item)) {
            return;
        }

        if (parentPath) {
            this.layoutService.layoutState.update((state) => ({
                ...state,
                activePath: parentPath
            }));
        }
    }
}
