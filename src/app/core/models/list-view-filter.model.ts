export interface ListViewFilter {
    viewFilterId: number;

    viewId: number;
    viewCode?: string | null;
    viewName?: string | null;

    fieldId: number;
    fieldCode?: string | null;
    fieldName?: string | null;

    filterOrder: number;
    filterType?: number | null;
    defaultValue?: string | null;
    isVisible?: boolean | null;
}

export interface ListViewFilterQuery {
    page: number;
    pageSize: number;

    search?: string;

    viewId?: number;
    fieldId?: number;
    isVisible?: boolean;

    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateListViewFilterRequest {
    viewId: number;
    fieldId: number;
    filterOrder: number;

    filterType?: number | null;
    defaultValue?: string | null;
    isVisible?: boolean | null;
}

export interface UpdateListViewFilterRequest {
    viewId: number;
    fieldId: number;
    filterOrder: number;

    filterType?: number | null;
    defaultValue?: string | null;
    isVisible?: boolean | null;
}

export interface ListViewFilterTypeOption {
    label: string;
    value: number;
}
