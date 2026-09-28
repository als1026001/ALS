export interface MenuGroup {
    menuGroupId: number;
    publicId?: string | null;

    menuGroupNo: string;
    menuGroupName: string;

    note?: string | null;

    isInactive: boolean;

    createdAt?: string | null;
    createdBy?: number | null;

    editedAt?: string | null;
    editedBy?: number | null;
}

export interface MenuGroupQuery {
    page: number;
    pageSize: number;

    search?: string;

    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface MenuGroupPagedResult {
    items: MenuGroup[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface CreateMenuGroupRequest {
    menuGroupNo: string;
    menuGroupName: string;

    note?: string | null;

    isInactive: boolean;
}

export interface UpdateMenuGroupRequest {
    menuGroupNo: string;
    menuGroupName: string;

    note?: string | null;

    isInactive: boolean;
}
