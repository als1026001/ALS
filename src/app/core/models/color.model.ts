export interface Color {
    colorId: number;
    publicId: string;
    colorNo: string;
    colorName?: string | null;
    createdAt?: string | null;
    createdBy?: number | null;
    editedAt?: string | null;
    editedBy?: number | null;
}

export interface ColorQuery {
    page: number;
    pageSize: number;
    search?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateColorRequest {
    colorNo: string;
    colorName?: string | null;
}

export interface UpdateColorRequest {
    colorNo: string;
    colorName?: string | null;
}
