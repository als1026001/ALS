export interface AuditLog {
    auditId: number;
    tenantId: number | null;
    companyId: number | null;

    userId: number | null;
    userName: string | null;

    auditType: string;
    action: string;

    tableName: string | null;
    recordId: string | null;

    oldValues: string | null;
    newValues: string | null;

    ipAddress: string | null;

    isSuccess: boolean;
    description: string | null;

    createdAt: string;
}

export interface AuditLogQuery {
    page: number;
    pageSize: number;

    fromDate?: string;
    toDate?: string;

    userName?: string;
    action?: string;
    auditType?: string;
    tableName?: string;
    recordId?: string;

    isSuccess?: boolean;
}
