import { Injectable, inject } from '@angular/core';

import { LayoutService } from '@/app/layout/service/layout.service';

@Injectable({
    providedIn: 'root'
})
export class MenuStateService {
    private readonly layoutService = inject(LayoutService);

    setActivePath(path: string | null): void {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            activePath: path
        }));
    }

    openMenu(path: string | null): void {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            activePath: path,
            menuHoverActive: true
        }));
    }

    closeMenus(): void {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
            mobileMenuActive: false,
            menuHoverActive: false
        }));
    }

    getActivePath(): string | null {
        return this.layoutService.layoutState().activePath ?? null;
    }
}
