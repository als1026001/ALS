export interface MenuSetup {
    menuId: number;
    publicId: string;

    menuNo: string;
    menuName: string;

    parentMenuId?: number | null;
    parentMenuNo?: string | null;
    parentMenuName?: string | null;

    seqNo: number;
    menuTypeId: number;

    icon?: string | null;
    routerLink?: string | null;
    menuUrl?: string | null;

    isInactive: boolean;
    isVisible: boolean;
    isSecurity: boolean;
    isExternal: boolean;

    target?: string | null;
    permissionCode?: string | null;
    note?: string | null;

    createdAt?: string | null;
    createdBy?: number | null;
    editedAt?: string | null;
    editedBy?: number | null;
}

export interface MenuParentLookup {
    menuId: number;
    menuNo: string;
    menuName: string;
    parentMenuId?: number | null;
}

export interface MenuSetupQuery {
    page: number;
    pageSize: number;
    search?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateMenuSetupRequest {
    menuNo: string;
    menuName: string;

    parentMenuId?: number | null;

    seqNo: number;
    menuTypeId: number;

    icon?: string | null;
    routerLink?: string | null;
    menuUrl?: string | null;

    isInactive: boolean;
    isVisible: boolean;
    isSecurity: boolean;
    isExternal: boolean;

    target?: string | null;
    permissionCode?: string | null;
    note?: string | null;
}

export interface UpdateMenuSetupRequest {
    menuNo: string;
    menuName: string;

    parentMenuId?: number | null;

    seqNo: number;
    menuTypeId: number;

    icon?: string | null;
    routerLink?: string | null;
    menuUrl?: string | null;

    isInactive: boolean;
    isVisible: boolean;
    isSecurity: boolean;
    isExternal: boolean;

    target?: string | null;
    permissionCode?: string | null;
    note?: string | null;
}

export interface PagedMenuSetupResult {
    items: MenuSetup[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages?: number;
}
