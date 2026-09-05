import { AppMenuItem } from '../menu.types';

export const HIERARCHY_MENU: AppMenuItem = {
    label: 'Hierarchy',
    path: '/hierarchy',
    items: [
        {
            label: 'Submenu 1',
            icon: 'pi pi-fw pi-bookmark',
            path: '/hierarchy/submenu_1',
            items: [
                {
                    label: 'Submenu 1.1',
                    icon: 'pi pi-fw pi-bookmark',
                    path: '/hierarchy/submenu_1/submenu_1_1',
                    items: [
                        { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                        { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                        { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                    ]
                },
                {
                    label: 'Submenu 1.2',
                    icon: 'pi pi-fw pi-bookmark',
                    path: '/hierarchy/submenu_1/submenu_1_2',
                    items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                }
            ]
        },
        {
            label: 'Submenu 2',
            icon: 'pi pi-fw pi-bookmark',
            path: '/hierarchy/submenu_2',
            items: [
                {
                    label: 'Submenu 2.1',
                    icon: 'pi pi-fw pi-bookmark',
                    path: '/hierarchy/submenu_2/submenu_2_1',
                    items: [
                        { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                        { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                    ]
                },
                {
                    label: 'Submenu 2.2',
                    icon: 'pi pi-fw pi-bookmark',
                    path: '/hierarchy/submenu_2/submenu_2_2',
                    items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                }
            ]
        }
    ]
};
