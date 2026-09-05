import { AppMenuItem } from '../menu.types';

export const GET_STARTED_MENU: AppMenuItem = {
    label: 'Get Started',
    items: [
        {
            label: 'Documentation',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/documentation']
        },
        {
            label: 'View Source',
            icon: 'pi pi-fw pi-github',
            url: 'https://github.com/primefaces/sakai-ng',
            target: '_blank'
        }
    ]
};
