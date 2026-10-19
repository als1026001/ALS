import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppMenuitem } from './app.menuitem';
import { AppMenuItem } from './menu.types';
import { SidebarMenuService } from './services/sidebar-menu.service';
import { MenuStateService } from './services/menu-state.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            @for (item of model(); track item.label) {
                @if (!item.separator) {
                    <li app-menuitem [item]="item" [root]="true"></li>
                } @else {
                    <li class="menu-separator"></li>
                }
            }
        </ul>
    `
})
export class AppMenu implements OnInit, OnDestroy {
    private readonly sidebarMenuService = inject(SidebarMenuService);
    private readonly router = inject(Router);
    private readonly menuStateService = inject(MenuStateService);
    private readonly destroy$ = new Subject<void>();

    readonly model = signal<AppMenuItem[]>([]);

    ngOnInit(): void {
        this.sidebarMenuService.menu$.pipe(takeUntil(this.destroy$)).subscribe((menu) => {
            this.model.set(menu);

            // Restore expanded sidebar menu from current URL.
            this.restoreActiveMenu(menu);
        });
    }

    private restoreActiveMenu(items: AppMenuItem[]): void {
        const currentUrl = this.router.url.split('?')[0].split('#')[0];

        const activePath = this.findActiveMenuPath(items, currentUrl);

        this.menuStateService.setActivePath(activePath);
    }

    private findActiveMenuPath(items: AppMenuItem[], currentUrl: string): string | null {
        for (const item of items) {
            const routerLink = item.routerLink;

            if (Array.isArray(routerLink) && routerLink.length > 0) {
                const itemUrl = routerLink[0];

                if (itemUrl === currentUrl) {
                    return item.path ?? null;
                }
            }

            if (item.items?.length) {
                const childPath = this.findActiveMenuPath(item.items, currentUrl);

                if (childPath) {
                    return childPath;
                }
            }
        }

        return null;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
