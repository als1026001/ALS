import { AppMenuItem } from '../menu.types';

export const PAGES_MENU: AppMenuItem = {
    label: 'Pages',
    icon: 'pi pi-fw pi-briefcase',
    path: '/pages',
    items: [
        {
            label: 'Landing',
            icon: 'pi pi-fw pi-globe',
            routerLink: ['/landing']
        },
        {
            label: 'Auth',
            icon: 'pi pi-fw pi-user',
            path: '/auth',
            items: [
                {
                    label: 'Login',
                    icon: 'pi pi-fw pi-sign-in',
                    routerLink: ['/auth/login']
                },
                {
                    label: 'Error',
                    icon: 'pi pi-fw pi-times-circle',
                    routerLink: ['/auth/error']
                },
                {
                    label: 'Access Denied',
                    icon: 'pi pi-fw pi-lock',
                    routerLink: ['/auth/access']
                }
            ]
        },
        {
            label: 'Crud',
            icon: 'pi pi-fw pi-pencil',
            routerLink: ['/pages/crud']
        },
        {
            label: 'Not Found',
            icon: 'pi pi-fw pi-exclamation-circle',
            routerLink: ['/pages/notfound']
        },
        {
            label: 'Empty',
            icon: 'pi pi-fw pi-circle-off',
            routerLink: ['/pages/empty']
        }
    ]
};
