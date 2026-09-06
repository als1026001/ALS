import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, shareReplay, switchMap } from 'rxjs';
import { AppMenuItem as ApiMenuItem } from '@/app/core/models/app-menu-item';
import { MenuService } from '@/app/core/services/menu.service';
import { APP_MENU } from '../config/menu.config';
import { SIDEBAR_MENU_CONFIG, SidebarMenuMode } from '../config/sidebar-menu.config';
import { AppMenuItem } from '../menu.types';

@Injectable({ providedIn: 'root' })
export class SidebarMenuService {
    private readonly apiMenuService = inject(MenuService);

    private readonly modeSubject = new BehaviorSubject<SidebarMenuMode>(this.readInitialMode());

    readonly mode$ = this.modeSubject.asObservable();

    readonly menu$: Observable<AppMenuItem[]> = this.mode$.pipe(
        switchMap((mode) => this.loadByMode(mode)),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    get mode(): SidebarMenuMode {
        return this.modeSubject.value;
    }

    /**
     * Change sidebar source at runtime.
     * The AppMenu subscription reloads automatically.
     */
    setMode(mode: SidebarMenuMode): void {
        if (!this.isValidMode(mode)) {
            return;
        }

        if (SIDEBAR_MENU_CONFIG.persistMode && typeof localStorage !== 'undefined') {
            localStorage.setItem(SIDEBAR_MENU_CONFIG.storageKey, mode);
        }

        this.modeSubject.next(mode);
    }

    /** Reset to the configured default mode. */
    resetMode(): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(SIDEBAR_MENU_CONFIG.storageKey);
        }

        this.modeSubject.next(SIDEBAR_MENU_CONFIG.defaultMode);
    }

    private loadByMode(mode: SidebarMenuMode): Observable<AppMenuItem[]> {
        if (mode === 'fixed') {
            return of(this.cloneMenu(APP_MENU));
        }

        return this.apiMenuService.getMenu().pipe(
            map((apiMenu) => this.mapApiMenu(apiMenu ?? [])),
            map((apiMenu) => {
                if (mode === 'api') {
                    return apiMenu;
                }

                return this.buildHybridMenu(apiMenu);
            }),
            catchError((error) => {
                console.error(`Unable to load sidebar menu in '${mode}' mode.`, error);

                if (SIDEBAR_MENU_CONFIG.fallbackToFixedOnApiError) {
                    return of(this.cloneMenu(APP_MENU));
                }

                return of([]);
            })
        );
    }

    private buildHybridMenu(apiMenu: AppMenuItem[]): AppMenuItem[] {
        const allowedLabels = new Set(
            SIDEBAR_MENU_CONFIG.hybridFixedRootLabels.map((label) => label.trim().toLocaleLowerCase())
        );

        const fixedRoots = this.cloneMenu(APP_MENU).filter((item) =>
            allowedLabels.has((item.label ?? '').trim().toLocaleLowerCase())
        );

        return this.dedupeRootItems([...fixedRoots, ...apiMenu]);
    }

    private mapApiMenu(items: ApiMenuItem[]): AppMenuItem[] {
        return items.map((item) => {
            const children = item.items?.length ? this.mapApiMenu(item.items) : undefined;
            const routerLink = item.routerLink?.trim();
            const externalUrl = item.url?.trim();

            return {
                label: item.label,
                icon: item.icon ?? undefined,
                routerLink: routerLink && !item.isExternal ? [routerLink] : undefined,
                url: externalUrl || (item.isExternal ? routerLink || undefined : undefined),
                target: item.target ?? (item.isExternal ? '_blank' : undefined),
                items: children,
                // Keep a stable path for Sakai parent-menu active state.
                path: routerLink || undefined
            } satisfies AppMenuItem;
        });
    }

    private dedupeRootItems(items: AppMenuItem[]): AppMenuItem[] {
        const result: AppMenuItem[] = [];
        const seen = new Set<string>();

        for (const item of items) {
            const key = this.menuKey(item);

            if (seen.has(key)) {
                continue;
            }

            seen.add(key);
            result.push(item);
        }

        return result;
    }

    private menuKey(item: AppMenuItem): string {
        const routerLink = Array.isArray(item.routerLink) ? item.routerLink.join('/') : String(item.routerLink ?? '');
        return `${item.label ?? ''}|${routerLink}|${item.url ?? ''}`.toLocaleLowerCase();
    }

    private cloneMenu(items: AppMenuItem[]): AppMenuItem[] {
        return items.map((item) => ({
            ...item,
            routerLink: Array.isArray(item.routerLink) ? [...item.routerLink] : item.routerLink,
            items: item.items ? this.cloneMenu(item.items) : undefined
        }));
    }

    private readInitialMode(): SidebarMenuMode {
        if (SIDEBAR_MENU_CONFIG.persistMode && typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem(SIDEBAR_MENU_CONFIG.storageKey);

            if (this.isValidMode(stored)) {
                return stored;
            }
        }

        return SIDEBAR_MENU_CONFIG.defaultMode;
    }

    private isValidMode(value: unknown): value is SidebarMenuMode {
        return value === 'fixed' || value === 'api' || value === 'hybrid';
    }
}
