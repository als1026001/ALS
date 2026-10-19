import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, shareReplay, startWith, switchMap } from 'rxjs';
import { AppMenuItem as ApiMenuItem } from '@/app/core/models/app-menu-item';
import { MenuService } from '@/app/core/services/menu.service';
import { APP_MENU } from '../config/menu.config';
import { SIDEBAR_MENU_CONFIG, SidebarMenuMode } from '../config/sidebar-menu.config';
import { AppMenuItem } from '../menu.types';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { LanguageService } from '@/app/core/services/language.service';
import { PermissionRefreshService } from '@/app/core/services/permission-refresh.service';

@Injectable({ providedIn: 'root' })
export class SidebarMenuService {
    private readonly apiMenuService = inject(MenuService);

    private readonly languageService = inject(LanguageService);
    private readonly permissionRefreshService = inject(PermissionRefreshService);

    private readonly modeSubject = new BehaviorSubject<SidebarMenuMode>(this.readInitialMode());

    readonly mode$ = this.modeSubject.asObservable();

    readonly menu$: Observable<AppMenuItem[]> = combineLatest([this.mode$, toObservable(this.languageService.selectedLanguage)]).pipe(
        switchMap(([mode, language]) =>
            this.permissionRefreshService.refresh$.pipe(
                startWith(undefined),
                switchMap(() => this.loadByMode(mode, language))
            )
        ),
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

    private loadByMode(mode: SidebarMenuMode, language: 'vi' | 'en' | 'cn'): Observable<AppMenuItem[]> {
        if (mode === 'fixed') {
            return of(this.cloneMenu(APP_MENU));
        }

        return this.apiMenuService.getMenu(language).pipe(
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
        const allowedLabels = new Set(SIDEBAR_MENU_CONFIG.hybridFixedRootLabels.map((label) => label.trim().toLocaleLowerCase()));

        const fixedRoots = this.cloneMenu(APP_MENU).filter((item) => allowedLabels.has((item.label ?? '').trim().toLocaleLowerCase()));

        return this.dedupeRootItems([...fixedRoots, ...apiMenu]);
    }

    private mapApiMenu(items: ApiMenuItem[], parentPath: string = ''): AppMenuItem[] {
        return items.map((item) => {
            const routerLink = item.routerLink?.trim();
            const externalUrl = item.url?.trim();

            // Stable unique menu path based on menuId.
            // Example: /menu/3/33/24
            const menuPath = `${parentPath}/menu/${item.menuId}`;

            const children = item.items?.length ? this.mapApiMenu(item.items, menuPath) : undefined;

            return {
                label: item.label,
                skipTranslation: true,
                icon: item.icon ?? undefined,

                routerLink: routerLink && !item.isExternal ? [routerLink] : undefined,

                url: externalUrl || (item.isExternal ? routerLink || undefined : undefined),

                target: item.target ?? (item.isExternal ? '_blank' : undefined),

                items: children,

                // Path dùng để điều khiển trạng thái menu,
                // không phải Angular Router URL.
                path: menuPath
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
