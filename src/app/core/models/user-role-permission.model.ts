export interface UserRolePermission {
    permissionId: number;

    roleId: number;
    roleNo?: string | null;
    roleName?: string | null;

    menuId: number;
    menuNo?: string | null;
    menuName?: string | null;
    routerLink?: string | null;

    levelId?: number | null;
    isInactive?: boolean | null;

    note?: string | null;

    createdAt?: string | null;
    createdBy?: number | null;

    editedAt?: string | null;
    editedBy?: number | null;
}

export interface UserRolePermissionQuery {
    page: number;
    pageSize: number;

    search?: string;

    roleId?: number | null;
    menuId?: number | null;

    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateUserRolePermissionRequest {
    roleId: number;
    menuId: number;

    levelId?: number | null;
    isInactive?: boolean | null;

    note?: string | null;
}

export interface UpdateUserRolePermissionRequest {
    roleId: number;
    menuId: number;

    levelId?: number | null;
    isInactive?: boolean | null;

    note?: string | null;
}
