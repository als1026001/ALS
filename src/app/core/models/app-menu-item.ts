export interface AppMenuItem {
    menuId: number;
    publicId: string;
    menuNo: string;
    label: string;
    menuTypeId?: number | null;
    icon?: string | null;
    routerLink?: string | null;
    url?: string | null;
    isExternal: boolean;
    target?: string | null;
    items?: AppMenuItem[];
}
