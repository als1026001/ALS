import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { catchError, forkJoin, map, Observable, of } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { AppMenuItem } from '../models/app-menu-item';

interface IndexMenuApiItem {
    indexMenuId: number;

    publicId: string;

    menuNo: string;

    menuName: string;

    routerLink: string;

    icon?: string | null;

    seqNo: number;

    isVisible: boolean;

    isInactive: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private readonly http = inject(HttpClient);

    private readonly menuApiUrl = `${API_BASE_URL}/menu`;

    private readonly indexMenuApiUrl = `${API_BASE_URL}/indexmenu`;

    getMenu(): Observable<AppMenuItem[]> {
        return forkJoin({
            mainMenu: this.http.get<AppMenuItem[]>(this.menuApiUrl),

            indexMenus: this.http.get<IndexMenuApiItem[]>(this.indexMenuApiUrl).pipe(
                catchError((error) => {
                    console.error('Unable to load Index menus.', error);

                    return of([] as IndexMenuApiItem[]);
                })
            )
        }).pipe(map(({ mainMenu, indexMenus }) => this.mergeIndexMenus(mainMenu ?? [], indexMenus ?? [])));
    }

    private mergeIndexMenus(mainMenu: AppMenuItem[], indexMenus: IndexMenuApiItem[]): AppMenuItem[] {
        const indexMenu = mainMenu.find((x) => x.menuNo === 'mnuIndex' || x.routerLink === '/index');

        if (!indexMenu) {
            return mainMenu;
        }

        indexMenu.items ??= [];

        for (const item of indexMenus) {
            if (!item.isVisible || item.isInactive) {
                continue;
            }

            const exists = indexMenu.items.some((x) => x.routerLink === item.routerLink);

            if (exists) {
                continue;
            }

            indexMenu.items.push({
                menuId: -item.indexMenuId,

                publicId: item.publicId,

                menuNo: item.menuNo,

                label: item.menuName,

                menuTypeId: 1,

                icon: item.icon,

                routerLink: item.routerLink,

                url: null,

                isExternal: false,

                target: null,

                items: []
            });
        }

        return mainMenu;
    }
}
