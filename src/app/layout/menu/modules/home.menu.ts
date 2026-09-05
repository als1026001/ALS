import { AppMenuItem } from '../menu.types';

export const HOME_MENU: AppMenuItem = {
    label: 'Home',
    items: [
        {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/']
        }
    ]
};
