export interface UserRoleRegister {
    userRoleId: number;

    userId: number;
    userName?: string | null;
    displayName?: string | null;

    roleId: number;
    roleNo?: string | null;
    roleName?: string | null;

    note?: string | null;
    isInactive?: boolean | null;

    createdAt?: string | null;
    createdBy?: number | null;
    editedAt?: string | null;
    editedBy?: number | null;
}

export interface UserRoleRegisterQuery {
    page: number;
    pageSize: number;

    search?: string;

    userId?: number | null;
    roleId?: number | null;

    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateUserRoleRegisterRequest {
    userId: number;
    roleId: number;

    note?: string | null;
    isInactive?: boolean | null;
}

export interface UpdateUserRoleRegisterRequest {
    userId: number;
    roleId: number;

    note?: string | null;
    isInactive?: boolean | null;
}
