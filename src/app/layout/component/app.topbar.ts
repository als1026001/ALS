import {
    CommonModule
} from '@angular/common';

import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild
} from '@angular/core';

import {
    RouterModule
} from '@angular/router';

import { StyleClassModule } from 'primeng/styleclass';

import {
    AppConfigurator
} from './app.configurator';

import {
    LayoutService
} from '../service/layout.service';

import {
    MenuService
} from '../../core/services/menu.service';

import {
    AppMenuItem
} from '../../core/models/app-menu-item';


@Component({
    selector: 'app-topbar',

    standalone: true,

    imports: [
        CommonModule,
        RouterModule,
        StyleClassModule,
        AppConfigurator
    ],

    templateUrl:
        './app.topbar.html',

    styleUrl:
        './app.topbar.scss'
})
export class AppTopbar
    implements OnInit {


    @ViewChild(
        'menuScroll'
    )
    menuScroll?: ElementRef<HTMLDivElement>;


    items: AppMenuItem[] = [];


    openMenu:
        AppMenuItem | null = null;


    menuTop = 0;

    menuLeft = 0;


    canScrollLeft = false;

    canScrollRight = false;


    constructor(

        public layoutService:
            LayoutService,

        private menuService:
            MenuService

    ) {
    }


    ngOnInit(): void {

        this.loadMenu();

    }


    private loadMenu(): void {

        this.menuService
            .getMenu()
            .subscribe({

                next: menu => {

                    this.items =
                        menu ?? [];


                    setTimeout(
                        () => {

                            this.updateScrollButtons();

                        }
                    );

                },


                error: error => {

                    console.error(
                        'Unable to load menu.',
                        error
                    );


                    this.items = [];

                }

            });

    }


    toggleMenu(
        item: AppMenuItem,
        event: MouseEvent
    ): void {

        event.stopPropagation();


        if (
            this.openMenu?.menuId
            ===
            item.menuId
        ) {

            this.closeMenu();

            return;

        }


        const button = event.currentTarget as HTMLElement | null;

        if (!button) return;

        const rect =
            button
                .getBoundingClientRect();


        this.menuTop =
            rect.bottom + 6;


        this.menuLeft =
            rect.left;


        this.openMenu =
            item;

    }


    closeMenu(): void {

        this.openMenu = null;

    }


    @HostListener(
        'document:click'
    )
    onDocumentClick(): void {

        this.closeMenu();

    }


    onMenuScroll(): void {

        this.updateScrollButtons();

    }


    onMenuWheel(
        event: WheelEvent
    ): void {

        const element =
            this.menuScroll
                ?.nativeElement;


        if (!element) {

            return;

        }


        if (
            Math.abs(event.deltaY)
            >
            Math.abs(event.deltaX)
        ) {

            element.scrollLeft +=
                event.deltaY;


            event.preventDefault();

        }


        this.updateScrollButtons();

    }


    scrollMenuLeft(): void {

        const element =
            this.menuScroll
                ?.nativeElement;


        if (!element) {

            return;

        }


        element.scrollBy({

            left: -250,

            behavior: 'smooth'

        });

    }


    scrollMenuRight(): void {

        const element =
            this.menuScroll
                ?.nativeElement;


        if (!element) {

            return;

        }


        element.scrollBy({

            left: 250,

            behavior: 'smooth'

        });

    }


    updateScrollButtons(): void {

        const element =
            this.menuScroll
                ?.nativeElement;


        if (!element) {

            this.canScrollLeft =
                false;

            this.canScrollRight =
                false;

            return;

        }


        this.canScrollLeft =
            element.scrollLeft > 2;


        this.canScrollRight =
            element.scrollLeft
            +
            element.clientWidth
            <
            element.scrollWidth - 2;

    }


    toggleDarkMode(): void {

        this.layoutService
            .layoutConfig
            .update(
                state => ({
                    ...state,

                    darkTheme:
                        !state.darkTheme
                })
            );

    }

}
