export interface ListViewColumn {
    viewColumnId: number;

    viewId: number;
    viewCode?: string | null;
    viewName?: string | null;

    fieldId: number;
    fieldCode?: string | null;
    fieldName?: string | null;

    columnOrder?: number | null;
    columnWidth?: number | null;
    columnLabel?: string | null;

    isVisible?: boolean | null;
    isSortable?: boolean | null;

    sortOrder?: number | null;
    sortDirection?: number | null;

    isFilterable?: boolean | null;

    note?: string | null;

    createdAt?: string | null;
    createdBy?: number | null;
    editedAt?: string | null;
    editedBy?: number | null;
}

export interface ListViewColumnQuery {
    page: number;
    pageSize: number;

    search?: string;
    viewId?: number;
    fieldId?: number;
    isVisible?: boolean;

    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateListViewColumnRequest {
    viewId: number;
    fieldId: number;

    columnOrder?: number | null;
    columnWidth?: number | null;
    columnLabel?: string | null;

    isVisible?: boolean | null;
    isSortable?: boolean | null;

    sortOrder?: number | null;
    sortDirection?: number | null;

    isFilterable?: boolean | null;

    note?: string | null;
}

export interface UpdateListViewColumnRequest {
    viewId: number;
    fieldId: number;

    columnOrder?: number | null;
    columnWidth?: number | null;
    columnLabel?: string | null;

    isVisible?: boolean | null;
    isSortable?: boolean | null;

    sortOrder?: number | null;
    sortDirection?: number | null;

    isFilterable?: boolean | null;

    note?: string | null;
}
