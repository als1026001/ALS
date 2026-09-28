export interface UserRole {
    roleId: number;
    publicId?: string | null;

    roleNo: string;
    roleName: string;

    roleTypeId?: number | null;

    isSingleSignOnOnly?: boolean | null;
    isWebServiceRoleOnly?: boolean | null;

    isRestrictRoleByDeviceId?: boolean | null;
    isRestrictRoleByIpAddress?: boolean | null;

    twoFactorAuthenticationModeId?: number | null;
    durationOfTrustedDeviceModeId?: number | null;

    isInactive?: boolean | null;

    note?: string | null;

    createdAt?: string | null;
    createdBy?: number | null;

    editedAt?: string | null;
    editedBy?: number | null;
}

export interface UserRoleQuery {
    page: number;
    pageSize: number;

    search?: string;

    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateUserRoleRequest {
    roleNo: string;
    roleName: string;

    roleTypeId?: number | null;

    isSingleSignOnOnly?: boolean | null;
    isWebServiceRoleOnly?: boolean | null;

    isRestrictRoleByDeviceId?: boolean | null;
    isRestrictRoleByIpAddress?: boolean | null;

    twoFactorAuthenticationModeId?: number | null;
    durationOfTrustedDeviceModeId?: number | null;

    isInactive?: boolean | null;

    note?: string | null;
}

export interface UpdateUserRoleRequest {
    roleNo: string;
    roleName: string;

    roleTypeId?: number | null;

    isSingleSignOnOnly?: boolean | null;
    isWebServiceRoleOnly?: boolean | null;

    isRestrictRoleByDeviceId?: boolean | null;
    isRestrictRoleByIpAddress?: boolean | null;

    twoFactorAuthenticationModeId?: number | null;
    durationOfTrustedDeviceModeId?: number | null;

    isInactive?: boolean | null;

    note?: string | null;
}
