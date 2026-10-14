import { CommonModule } from '@angular/common';

import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

import { Router, RouterModule } from '@angular/router';

import { Subject, debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';

import { StyleClassModule } from 'primeng/styleclass';

import { AppConfigurator } from './app.configurator';

import { LayoutService } from '../service/layout.service';

import { MenuService } from '../../core/services/menu.service';

import { AuthService } from '../../core/services/auth.service';

import { CenterSearchService } from '../../core/services/center-search.service';

import { AppMenuItem } from '../../core/models/app-menu-item';

import { CenterSearchItem } from '../../core/models/center-search.model';

import { TranslocoService } from '@jsverse/transloco';

import { AppLanguage, LanguageService } from '../../core/services/language.service';

import { TranslocoPipe } from '@jsverse/transloco';

import { PopoverModule } from 'primeng/popover';

import { MenuTranslationService } from '../../core/services/menu-translation.service';

import { Popover } from 'primeng/popover';
@Component({
    selector: 'app-topbar',

    standalone: true,

    imports: [CommonModule, RouterModule, StyleClassModule, AppConfigurator, TranslocoPipe, PopoverModule],

    templateUrl: './app.topbar.html',

    styleUrl: './app.topbar.scss'
})
export class AppTopbar implements OnInit {
    @ViewChild('menuScroll')
    menuScroll?: ElementRef<HTMLDivElement>;

    items: AppMenuItem[] = [];

    openMenu: AppMenuItem | null = null;

    currentUserName = '';

    searchText = '';

    searchResults: CenterSearchItem[] = [];

    searchLoading = false;

    searchOpen = false;

    selectedSearchIndex = -1;

    private readonly searchSubject = new Subject<string>();

    menuTop = 0;

    menuLeft = 0;

    canScrollLeft = false;

    canScrollRight = false;

    constructor(
        public layoutService: LayoutService,
        private menuService: MenuService,
        private authService: AuthService,
        private centerSearchService: CenterSearchService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        public languageService: LanguageService,
        public transloco: TranslocoService,
        public menuTranslationService: MenuTranslationService
    ) {}

    ngOnInit(): void {
        const currentUser = this.authService.getCurrentUser();

        this.currentUserName = currentUser?.displayName || currentUser?.username || 'User';

        this.loadMenu();

        this.initializeCenterSearch();
    }

    private loadMenu(): void {
        this.menuService.getMenu(this.languageService.selectedLanguage()).subscribe({
            next: (menu) => {
                this.items = menu ?? [];
                this.openMenu = null;

                this.cdr.detectChanges();

                setTimeout(() => {
                    this.updateScrollButtons();
                    this.cdr.detectChanges();
                }, 0);
            },
            error: (error) => {
                console.error('Unable to load menu.', error);
                this.items = [];
                this.openMenu = null;
                this.cdr.detectChanges();
            }
        });
    }

    private initializeCenterSearch(): void {
        this.searchSubject
            .pipe(
                debounceTime(300),

                distinctUntilChanged(),

                switchMap((search) => {
                    const value = search.trim();

                    if (value.length < 1) {
                        this.searchLoading = false;
                        this.searchResults = [];
                        this.searchOpen = false;

                        this.cdr.markForCheck();

                        return of([] as CenterSearchItem[]);
                    }

                    this.searchLoading = true;
                    this.searchOpen = true;

                    this.cdr.markForCheck();

                    return this.centerSearchService.search(value, 10).pipe(
                        catchError((error) => {
                            console.error('Center search failed.', error);

                            return of([] as CenterSearchItem[]);
                        })
                    );
                })
            )
            .subscribe((results) => {
                this.searchResults = results;

                this.searchLoading = false;

                this.searchOpen = true;

                this.selectedSearchIndex = results.length > 0 ? 0 : -1;

                this.cdr.markForCheck();
            });
    }

    onSearchInput(event: Event): void {
        const input = event.target as HTMLInputElement;

        this.searchText = input.value;

        if (this.searchText.trim().length < 1) {
            this.searchResults = [];
            this.searchLoading = false;
            this.searchOpen = false;
            this.selectedSearchIndex = -1;

            this.cdr.markForCheck();
        }

        this.searchSubject.next(this.searchText);
    }

    onSearchFocus(): void {
        if (this.searchText.trim().length >= 1 && (this.searchResults.length > 0 || this.searchLoading)) {
            this.searchOpen = true;

            this.cdr.markForCheck();
        }
    }

    onSearchKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.closeSearch();
            return;
        }

        if (!this.searchOpen || this.searchResults.length === 0) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();

            this.selectedSearchIndex = (this.selectedSearchIndex + 1) % this.searchResults.length;

            this.cdr.markForCheck();

            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();

            this.selectedSearchIndex = this.selectedSearchIndex <= 0 ? this.searchResults.length - 1 : this.selectedSearchIndex - 1;

            this.cdr.markForCheck();

            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();

            const item = this.searchResults[this.selectedSearchIndex];

            if (item) {
                this.selectSearchResult(item);
            }
        }
    }

    selectSearchResult(item: CenterSearchItem): void {
        this.searchOpen = false;
        this.searchText = '';
        this.searchResults = [];
        this.selectedSearchIndex = -1;
        this.cdr.markForCheck();

        if (!item.routerLink) {
            return;
        }

        this.router.navigate([item.routerLink], {
            queryParams: {
                id: item.id
            }
        });
    }

    closeSearch(): void {
        if (!this.searchOpen) {
            return;
        }

        this.searchOpen = false;

        this.cdr.markForCheck();
    }

    toggleMenu(item: AppMenuItem, event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        if (this.openMenu?.menuId === item.menuId) {
            this.closeMenu();
            return;
        }

        const button = event.currentTarget as HTMLElement | null;

        if (!button) {
            return;
        }

        const rect = button.getBoundingClientRect();

        this.menuTop = rect.bottom + 6;
        this.menuLeft = rect.left;

        this.openMenu = item;

        this.cdr.detectChanges();
    }

    closeMenu(): void {
        if (!this.openMenu) {
            return;
        }

        this.openMenu = null;

        this.cdr.detectChanges();
    }

    @HostListener('document:click')
    onDocumentClick(): void {
        this.closeMenu();
        this.closeSearch();
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this.closeMenu();

        this.updateScrollButtons();
    }

    @ViewChild('languagePopover')
    languagePopover?: Popover;

    @HostListener('window:scroll')
    onWindowScroll(): void {
        this.languagePopover?.hide();
    }

    onMenuScroll(): void {
        this.updateScrollButtons();
    }

    onMenuWheel(event: WheelEvent): void {
        const element = this.menuScroll?.nativeElement;

        if (!element) {
            return;
        }

        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            element.scrollLeft += event.deltaY;

            event.preventDefault();
        }

        this.updateScrollButtons();
    }

    scrollMenuLeft(): void {
        const element = this.menuScroll?.nativeElement;

        if (!element) {
            return;
        }

        element.scrollBy({
            left: -250,

            behavior: 'smooth'
        });

        setTimeout(() => {
            this.updateScrollButtons();

            this.cdr.detectChanges();
        }, 300);
    }

    scrollMenuRight(): void {
        const element = this.menuScroll?.nativeElement;

        if (!element) {
            return;
        }

        element.scrollBy({
            left: 250,

            behavior: 'smooth'
        });

        setTimeout(() => {
            this.updateScrollButtons();

            this.cdr.detectChanges();
        }, 300);
    }

    updateScrollButtons(): void {
        const element = this.menuScroll?.nativeElement;

        if (!element) {
            this.canScrollLeft = false;

            this.canScrollRight = false;

            return;
        }

        this.canScrollLeft = element.scrollLeft > 2;

        this.canScrollRight = element.scrollLeft + element.clientWidth < element.scrollWidth - 2;
    }

    logout(): void {
        this.closeMenu();

        this.authService.logout();

        this.router.navigateByUrl('/auth/login');
    }

    readonly languageOptions: {
        code: AppLanguage;
        flag: string;
        name: string;
    }[] = [
        { code: 'vi', flag: 'VN', name: 'Tiếng Việt' },
        { code: 'en', flag: 'EN', name: 'English' },
        { code: 'cn', flag: 'CN', name: '简体中文' }
    ];

    get currentLanguageCode(): string {
        return this.languageService.selectedLanguage().toUpperCase();
    }

    selectLanguage(language: AppLanguage): void {
        if (this.languageService.selectedLanguage() === language) {
            return;
        }

        this.languageService.setLanguage(language);

        // Close the currently opened horizontal dropdown.
        this.closeMenu();

        // Reload horizontal menu using the new language.
        this.loadMenu();
    }

    toggleDarkMode(): void {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,

            darkTheme: !state.darkTheme
        }));
    }
}
