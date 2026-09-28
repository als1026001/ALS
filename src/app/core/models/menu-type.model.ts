export interface MenuType {
    menuTypeId: number;
    publicId?: string | null;
    menuTypeNo: string;
    menuTypeName?: string | null;
    note?: string | null;
    isInactive?: boolean | null;
    createdAt?: string | null;
    createdBy?: number | null;
    editedAt?: string | null;
    editedBy?: number | null;
}

export interface MenuTypeQuery {
    page: number;
    pageSize: number;
    search?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface MenuTypePagedResult {
    items: MenuType[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface CreateMenuTypeRequest {
    menuTypeNo: string;
    menuTypeName?: string | null;
    note?: string | null;
    isInactive?: boolean | null;
}

export interface UpdateMenuTypeRequest {
    menuTypeNo: string;
    menuTypeName?: string | null;
    note?: string | null;
    isInactive?: boolean | null;
}
