export interface ListView {
    viewId: number;
    menuId: number;
    viewCode: string;
    viewName: string;

    isDefault?: boolean | null;
    isSystem?: boolean | null;
    isPublic?: boolean | null;
    isActive?: boolean | null;

    note?: string | null;

    createdAt?: string | null;
    createdBy?: number | null;
    editedAt?: string | null;
    editedBy?: number | null;
}

export interface ListViewQuery {
    page: number;
    pageSize: number;

    search?: string;
    menuId?: number;
    isActive?: boolean;

    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateListViewRequest {
    menuId: number;
    viewCode: string;
    viewName: string;

    isDefault?: boolean | null;
    isSystem?: boolean | null;
    isPublic?: boolean | null;
    isActive?: boolean | null;

    note?: string | null;
}

export interface UpdateListViewRequest {
    menuId: number;
    viewCode: string;
    viewName: string;

    isDefault?: boolean | null;
    isSystem?: boolean | null;
    isPublic?: boolean | null;
    isActive?: boolean | null;

    note?: string | null;
}
