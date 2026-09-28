export interface User {
    userId: number;
    publicId?: string | null;
    userName: string;
    displayName?: string | null;
    userGroupId?: number | null;
    manageByUserId?: number | null;

    isInactive?: boolean | null;
    isAllowAccess?: boolean | null;
    isInheritIpRule?: boolean | null;

    isPasswordRenewByDayInterval?: boolean | null;
    passwordRenewDayInterval?: number | null;

    isSendAccessNotificationEmail?: boolean | null;

    note?: string | null;

    createdAt?: string | null;
    createdBy?: number | null;
    editedAt?: string | null;
    editedBy?: number | null;
}

export interface UserQuery {
    page: number;
    pageSize: number;
    search?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateUserRequest {
    userName: string;
    displayName?: string | null;
    password: string;

    userGroupId?: number | null;
    manageByUserId?: number | null;

    isInactive?: boolean | null;
    isAllowAccess?: boolean | null;
    isInheritIpRule?: boolean | null;

    isPasswordRenewByDayInterval?: boolean | null;
    passwordRenewDayInterval?: number | null;

    isSendAccessNotificationEmail?: boolean | null;

    note?: string | null;
}

export interface UpdateUserRequest {
    userName: string;
    displayName?: string | null;

    // Blank means keep the current password.
    password?: string | null;

    userGroupId?: number | null;
    manageByUserId?: number | null;

    isInactive?: boolean | null;
    isAllowAccess?: boolean | null;
    isInheritIpRule?: boolean | null;

    isPasswordRenewByDayInterval?: boolean | null;
    passwordRenewDayInterval?: number | null;

    isSendAccessNotificationEmail?: boolean | null;

    note?: string | null;
}
