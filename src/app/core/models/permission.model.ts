export interface MenuPermission {
    menuId: number;
    levelId: number;
}

export interface MenuAccess {
    menuId: number;
    levelId: number;
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}

export interface RouteAccess {
    routerLink: string;
    levelId: number;
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}
