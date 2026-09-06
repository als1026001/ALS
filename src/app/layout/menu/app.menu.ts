import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppMenuitem } from './app.menuitem';
import { AppMenuItem } from './menu.types';
import { SidebarMenuService } from './services/sidebar-menu.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            @for (item of model; track item.label) {
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
    private readonly destroy$ = new Subject<void>();

    model: AppMenuItem[] = [];

    ngOnInit(): void {
        this.sidebarMenuService.menu$
            .pipe(takeUntil(this.destroy$))
            .subscribe((menu) => {
                this.model = menu;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
