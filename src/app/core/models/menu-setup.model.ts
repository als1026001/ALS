export interface MenuTranslation {
    langCode: 'vi' | 'en' | 'cn';
    menuName: string;
}

export interface MenuSetup {
    menuId: number;
    publicId: string;

    menuNo: string;
    menuName: string;

    menuNameVi?: string | null;
    menuNameEn?: string | null;
    menuNameCn?: string | null;

    parentMenuId?: number | null;
    parentMenuNo?: string | null;
    parentMenuName?: string | null;
    parentMenuNameVi?: string | null;
    parentMenuNameEn?: string | null;
    parentMenuNameCn?: string | null;

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
    menuNameVi?: string | null;
    menuNameEn?: string | null;
    menuNameCn?: string | null;
    parentMenuId?: number | null;
    displayName?: string;
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

    translations?: MenuTranslation[];

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

    translations?: MenuTranslation[];

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
