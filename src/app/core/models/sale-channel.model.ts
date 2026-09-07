export interface SaleChannel {
    saleChannelId: number;
    publicId: string;

    saleChannelNo: string;
    saleChannelName?: string | null;
    note?: string | null;

    createdAt?: string | null;
    createdBy?: number | null;

    editedAt?: string | null;
    editedBy?: number | null;
}

export interface SaleChannelQuery {
    page: number;
    pageSize: number;
    search?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateSaleChannelRequest {
    saleChannelNo: string;
    saleChannelName?: string | null;
    note?: string | null;
}

export interface UpdateSaleChannelRequest {
    saleChannelNo: string;
    saleChannelName?: string | null;
    note?: string | null;
}
