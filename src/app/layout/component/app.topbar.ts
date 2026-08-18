import { AfterViewInit, Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { StyleClassModule } from 'primeng/styleclass';

import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule, RouterModule, StyleClassModule, AppConfigurator],
    templateUrl: './app.topbar.html',
    styleUrls: ['./app.topbar.scss']
})
export class AppTopbar implements AfterViewInit {
    layoutService = inject(LayoutService);

    @ViewChild('menuScroll')
    menuScroll!: ElementRef<HTMLDivElement>;

    /*
    ============================================================
    MENU
    ============================================================
    */

    items: MenuItem[] = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: '/'
        },

        {
            label: 'Master Data',
            icon: 'pi pi-database',
            items: [
                {
                    label: 'Customers',
                    icon: 'pi pi-users',
                    routerLink: '/master/customers'
                },
                {
                    label: 'Suppliers',
                    icon: 'pi pi-building',
                    routerLink: '/master/suppliers'
                },
                {
                    label: 'Products',
                    icon: 'pi pi-box',
                    routerLink: '/master/products'
                },
                {
                    label: 'Employees',
                    icon: 'pi pi-user',
                    routerLink: '/master/employees'
                }
            ]
        },

        {
            label: 'Sales',
            icon: 'pi pi-shopping-cart',
            items: [
                {
                    label: 'Customers',
                    routerLink: '/sales/customers'
                },
                {
                    label: 'Sales Orders',
                    routerLink: '/sales/orders'
                },
                {
                    label: 'Invoices',
                    routerLink: '/sales/invoices'
                },
                {
                    label: 'Returns',
                    routerLink: '/sales/returns'
                },
                {
                    separator: true
                },
                {
                    label: 'Sales Reports',
                    routerLink: '/sales/reports'
                }
            ]
        },

        {
            label: 'Purchasing',
            icon: 'pi pi-shopping-bag',
            items: [
                {
                    label: 'Suppliers',
                    routerLink: '/purchasing/suppliers'
                },
                {
                    label: 'Purchase Orders',
                    routerLink: '/purchasing/orders'
                },
                {
                    label: 'Goods Receipt',
                    routerLink: '/purchasing/receipts'
                },
                {
                    label: 'Purchase Returns',
                    routerLink: '/purchasing/returns'
                }
            ]
        },

        {
            label: 'Inventory',
            icon: 'pi pi-box',
            items: [
                {
                    label: 'Items',
                    routerLink: '/inventory/items'
                },
                {
                    label: 'Warehouses',
                    routerLink: '/inventory/warehouses'
                },
                {
                    label: 'Stock In',
                    routerLink: '/inventory/stock-in'
                },
                {
                    label: 'Stock Out',
                    routerLink: '/inventory/stock-out'
                },
                {
                    label: 'Stock Transfer',
                    routerLink: '/inventory/transfer'
                },
                {
                    separator: true
                },
                {
                    label: 'Inventory Reports',
                    routerLink: '/inventory/reports'
                }
            ]
        },

        {
            label: 'Accounting',
            icon: 'pi pi-calculator',
            items: [
                {
                    label: 'Chart of Accounts',
                    routerLink: '/accounting/accounts'
                },
                {
                    label: 'Journal Entries',
                    routerLink: '/accounting/journal'
                },
                {
                    label: 'Receivable',
                    routerLink: '/accounting/receivable'
                },
                {
                    label: 'Payable',
                    routerLink: '/accounting/payable'
                },
                {
                    label: 'General Ledger',
                    routerLink: '/accounting/ledger'
                },
                {
                    separator: true
                },
                {
                    label: 'Financial Reports',
                    routerLink: '/accounting/reports'
                }
            ]
        },

        {
            label: 'Reports',
            icon: 'pi pi-chart-bar',
            items: [
                {
                    label: 'Sales Reports',
                    routerLink: '/reports/sales'
                },
                {
                    label: 'Purchase Reports',
                    routerLink: '/reports/purchase'
                },
                {
                    label: 'Inventory Reports',
                    routerLink: '/reports/inventory'
                },
                {
                    label: 'Financial Reports',
                    routerLink: '/reports/financial'
                }
            ]
        },

        {
            label: 'Settings',
            icon: 'pi pi-cog',
            items: [
                {
                    label: 'Company',
                    routerLink: '/settings/company'
                },
                {
                    label: 'Users',
                    routerLink: '/settings/users'
                },
                {
                    label: 'Roles & Permissions',
                    routerLink: '/settings/roles'
                },
                {
                    label: 'System Settings',
                    routerLink: '/settings/system'
                }
            ]
        }
    ];

    /*
    ============================================================
    CURRENT MENU
    ============================================================
    */

    openMenu: MenuItem | null = null;

    /*
       Position of dropdown on screen
    */

    menuTop = 64;

    menuLeft = 0;

    /*
    ============================================================
    HORIZONTAL SCROLL
    ============================================================
    */

    canScrollLeft = false;

    canScrollRight = false;

    /*
    ============================================================
    INIT
    ============================================================
    */

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.updateScrollButtons();
        });
    }

    /*
    ============================================================
    RESIZE
    ============================================================
    */

    @HostListener('window:resize')
    onResize(): void {
        this.updateScrollButtons();

        if (this.openMenu) {
            setTimeout(() => {
                this.repositionDropdown();
            });
        }
    }

    /*
    ============================================================
    CLICK OUTSIDE
    ============================================================
    */

    @HostListener('document:click')
    onDocumentClick(): void {
        this.closeMenu();
    }

    /*
    ============================================================
    TOGGLE MENU
    ============================================================
    */

    toggleMenu(item: MenuItem, event: MouseEvent): void {
        /*
        Prevent document click
        */

        event.stopPropagation();

        /*
        Menu without children
        */

        if (!item.items || item.items.length === 0) {
            this.closeMenu();

            return;
        }

        /*
        Toggle
        */

        if (this.openMenu === item) {
            this.closeMenu();

            return;
        }

        /*
        Open selected menu
        */

        this.openMenu = item;

        /*
        Calculate dropdown position
        */

        const button = event.currentTarget as HTMLElement;

        const rect = button.getBoundingClientRect();

        this.menuTop = rect.bottom;

        this.menuLeft = rect.left;

        /*
        Make sure dropdown doesn't go outside
        right side of screen.
        */

        setTimeout(() => {
            this.repositionDropdown();
        });
    }

    /*
    ============================================================
    REPOSITION DROPDOWN
    ============================================================
    */

    repositionDropdown(): void {
        const screenWidth = window.innerWidth;

        /*
        Approximate dropdown width
        */

        const dropdownWidth = 250;

        /*
        If dropdown would go outside right
        */

        if (this.menuLeft + dropdownWidth > screenWidth - 10) {
            this.menuLeft = screenWidth - dropdownWidth - 10;
        }

        /*
        Never go outside left
        */

        if (this.menuLeft < 10) {
            this.menuLeft = 10;
        }
    }

    /*
    ============================================================
    CLOSE MENU
    ============================================================
    */

    closeMenu(): void {
        this.openMenu = null;
    }

    /*
    ============================================================
    MENU SCROLL
    ============================================================
    */

    onMenuScroll(): void {
        this.updateScrollButtons();

        /*
        Close dropdown while horizontal scrolling.
        This avoids the dropdown being detached from
        its parent button.
        */

        if (this.openMenu) {
            this.closeMenu();
        }
    }

    /*
    ============================================================
    MOUSE WHEEL
    ============================================================
    */

    onMenuWheel(event: WheelEvent): void {
        if (!this.menuScroll) {
            return;
        }

        const element = this.menuScroll.nativeElement;

        /*
        Only convert wheel to horizontal
        when horizontal scrolling is possible.
        */

        if (element.scrollWidth <= element.clientWidth) {
            return;
        }

        event.preventDefault();

        element.scrollLeft += event.deltaY;

        this.updateScrollButtons();

        /*
        Close dropdown
        */

        if (this.openMenu) {
            this.closeMenu();
        }
    }

    /*
    ============================================================
    SCROLL LEFT
    ============================================================
    */

    scrollMenuLeft(): void {
        if (!this.menuScroll) {
            return;
        }

        this.menuScroll.nativeElement.scrollBy({
            left: -250,
            behavior: 'smooth'
        });

        this.closeMenu();

        setTimeout(() => {
            this.updateScrollButtons();
        }, 300);
    }

    /*
    ============================================================
    SCROLL RIGHT
    ============================================================
    */

    scrollMenuRight(): void {
        if (!this.menuScroll) {
            return;
        }

        this.menuScroll.nativeElement.scrollBy({
            left: 250,
            behavior: 'smooth'
        });

        this.closeMenu();

        setTimeout(() => {
            this.updateScrollButtons();
        }, 300);
    }

    /*
    ============================================================
    UPDATE SCROLL BUTTONS
    ============================================================
    */

    updateScrollButtons(): void {
        if (!this.menuScroll) {
            return;
        }

        const element = this.menuScroll.nativeElement;

        this.canScrollLeft = element.scrollLeft > 5;

        this.canScrollRight = element.scrollLeft + element.clientWidth < element.scrollWidth - 5;
    }

    /*
    ============================================================
    DARK MODE
    ============================================================
    */

    toggleDarkMode(): void {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }
}
