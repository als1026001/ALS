export interface IndexMenu {
    indexMenuId: number;
    publicId: string;
    menuNo: string;
    menuName: string;
    routerLink: string;
    icon?: string | null;
    seqNo: number;
    isVisible: boolean;
    isInactive: boolean;
    note?: string | null;
    createdAt?: string | null;
    createdBy?: number | null;
    editedAt?: string | null;
    editedBy?: number | null;
}

export interface IndexMenuQuery {
    page: number;
    pageSize: number;
    search?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateIndexMenuRequest {
    menuNo: string;
    menuName: string;
    routerLink: string;
    icon?: string | null;
    seqNo: number;
    isVisible: boolean;
    isInactive: boolean;
    note?: string | null;
}

export interface UpdateIndexMenuRequest {
    menuNo: string;
    menuName: string;
    routerLink: string;
    icon?: string | null;
    seqNo: number;
    isVisible: boolean;
    isInactive: boolean;
    note?: string | null;
}

export interface PagedIndexMenuResult {
    items: IndexMenu[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages?: number;
}
