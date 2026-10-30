export interface HrDepartment {
    departmentId: number;
    publicId?: string | null;
    departmentCode: string;
    departmentName: string;
    seqNo?: number | null;
    note?: string | null;
    createdAt?: string | null;
    createdBy?: number | null;
    editedAt?: string | null;
    editedBy?: number | null;
}

export interface HrDepartmentQuery {
    page: number;
    pageSize: number;
    search?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateHrDepartmentRequest {
    departmentCode: string;
    departmentName: string;
    seqNo?: number | null;
    note?: string | null;
}

export interface UpdateHrDepartmentRequest {
    departmentCode: string;
    departmentName: string;
    seqNo?: number | null;
    note?: string | null;
}
