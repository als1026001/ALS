export interface MenuField {
    fieldId: number;

    menuId: number;
    menuNo: string;
    menuName: string;

    fieldCode: string;
    fieldName: string;

    dataType?: string | null;
    databaseField?: string | null;
    defaultLabel?: string | null;

    isAvailable: boolean;

    createdAt?: string | null;
    createdBy?: number | null;

    editedAt?: string | null;
    editedBy?: number | null;
}

export interface MenuFieldQuery {
    search?: string;

    menuId?: number | null;

    sortField?: string;
    sortDirection?: 'asc' | 'desc';

    page?: number;
    pageSize?: number;
}

export interface CreateMenuFieldRequest {
    menuId: number;

    fieldCode: string;
    fieldName: string;

    dataType?: string | null;
    databaseField?: string | null;
    defaultLabel?: string | null;

    isAvailable: boolean;
}

export interface UpdateMenuFieldRequest {
    menuId: number;

    fieldCode: string;
    fieldName: string;

    dataType?: string | null;
    databaseField?: string | null;
    defaultLabel?: string | null;

    isAvailable: boolean;
}

export interface MenuFieldPagedResult {
    items: MenuField[];

    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
