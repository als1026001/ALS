import { Component, computed, inject, input, signal } from '@angular/core';

import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';

import { AppMenuItem } from './menu.types';
import { MenuNavigationService } from './services/menu-navigation.service';
import { MenuStateService } from './services/menu-state.service';

@Component({
    selector: '[app-menuitem]',
    imports: [CommonModule, RouterModule, RippleModule],
    template: `
        @if (root() && isVisible()) {
            <div class="layout-menuitem-root-text">{{ item().label }}</div>
        }
        @if ((!hasRouterLink() || hasChildren()) && isVisible()) {
            <a [attr.href]="item().url" (click)="itemClick($event)" [ngClass]="item()['class']" [attr.target]="item().target" tabindex="0" pRipple>
                <i [ngClass]="item().icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text">{{ item().label }}</span>
                @if (hasChildren()) {
                    <i class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
                }
            </a>
        }
        @if (hasRouterLink() && !hasChildren() && isVisible()) {
            <a
                (click)="itemClick($event)"
                [ngClass]="item()['class']"
                [routerLink]="item().routerLink"
                routerLinkActive="active-route"
                [routerLinkActiveOptions]="item().routerLinkActiveOptions || { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }"
                [fragment]="item().fragment"
                [queryParamsHandling]="item().queryParamsHandling"
                [preserveFragment]="item().preserveFragment"
                [skipLocationChange]="item().skipLocationChange"
                [replaceUrl]="item().replaceUrl"
                [state]="item().state"
                [queryParams]="item().queryParams"
                [attr.target]="item().target"
                tabindex="0"
                pRipple
            >
                <i [ngClass]="item().icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text">{{ item().label }}</span>
                @if (hasChildren()) {
                    <i class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
                }
            </a>
        }
        @if (hasChildren() && isVisible() && (root() || isActive())) {
            <ul [animate.enter]="initialized() ? 'p-submenu-enter' : null" [animate.leave]="'p-submenu-leave'" [class.layout-root-submenulist]="root()">
                @for (child of item().items; track child?.label) {
                    <li app-menuitem [item]="child" [parentPath]="fullPath()" [root]="false" [class]="child['badgeClass']"></li>
                }
            </ul>
        }
    `,
    host: {
        '[class.active-menuitem]': 'isActive()',
        '[class.layout-root-menuitem]': 'root()'
    },
    styles: [
        `
            .p-submenu-enter {
                animation: p-animate-submenu-expand 450ms cubic-bezier(0.86, 0, 0.07, 1) forwards;
            }

            .p-submenu-leave {
                animation: p-animate-submenu-collapse 450ms cubic-bezier(0.86, 0, 0.07, 1) forwards;
            }

            @keyframes p-animate-submenu-expand {
                from {
                    max-height: 0;
                    overflow: hidden;
                }
                to {
                    max-height: 1000px;
                    overflow: visible;
                }
            }

            @keyframes p-animate-submenu-collapse {
                from {
                    max-height: 1000px;
                    overflow: hidden;
                }
                to {
                    max-height: 0;
                    overflow: hidden;
                }
            }
        `
    ]
})
export class AppMenuitem {
    private readonly navigationService = inject(MenuNavigationService);

    private readonly stateService = inject(MenuStateService);

    item = input.required<AppMenuItem>();

    root = input<boolean>(false);

    parentPath = input<string | null>(null);

    isVisible = computed(() => {
        return this.item().visible !== false;
    });

    hasChildren = computed(() => {
        const items = this.item().items;

        return Array.isArray(items) && items.length > 0;
    });

    hasRouterLink = computed(() => {
        return !!this.item().routerLink;
    });

    fullPath = computed(() => {
        const itemPath = this.item().path;

        if (!itemPath) {
            return this.parentPath();
        }

        const parent = this.parentPath();

        if (parent && !itemPath.startsWith(parent)) {
            return parent + itemPath;
        }

        return itemPath;
    });

    isActive = computed(() => {
        const activePath = this.stateService.getActivePath();

        const path = this.fullPath();

        if (!path) {
            return false;
        }

        return activePath?.startsWith(path) ?? false;
    });

    initialized = signal(false);

    constructor() {
        this.navigationService.subscribeToNavigation(() => this.updateActiveStateFromRoute());
    }

    ngOnInit(): void {
        if (this.item().routerLink) {
            this.updateActiveStateFromRoute();
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.initialized.set(true);
        });
    }

    updateActiveStateFromRoute(): void {
        this.navigationService.updateActivePath(this.item(), this.parentPath());
    }

    itemClick(event: Event): void {
        const item = this.item();

        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (item.command) {
            item.command({
                originalEvent: event,
                item
            });
        }

        if (this.hasChildren()) {
            this.handleParentClick();
            return;
        }

        this.stateService.closeMenus();
    }

    private handleParentClick(): void {
        if (this.isActive()) {
            this.stateService.setActivePath(this.parentPath());

            return;
        }

        this.stateService.openMenu(this.fullPath());
    }
}
