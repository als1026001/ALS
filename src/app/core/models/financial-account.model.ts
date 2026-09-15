export interface FinancialAccount {
    accountId: number;
    publicId: string;
    accountNo: string;
    fatherAccountId?: number | null;
    accountName?: string | null;
    accountNameLegal?: string | null;
    currencyId?: number | null;
    accountTypeId?: number | null;
    isDetail: boolean;
    isInactive: boolean;
    note?: string | null;
    createdAt?: string | null;
    createdBy?: number | null;
    editedAt?: string | null;
    editedBy?: number | null;
}

export interface FinancialAccountQuery {
    page: number;
    pageSize: number;
    search?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateFinancialAccountRequest {
    accountNo: string;
    fatherAccountId?: number | null;
    accountName?: string | null;
    accountNameLegal?: string | null;
    currencyId?: number | null;
    accountTypeId?: number | null;
    isDetail: boolean;
    isInactive: boolean;
    note?: string | null;
}

export interface UpdateFinancialAccountRequest {
    accountNo: string;
    fatherAccountId?: number | null;
    accountName?: string | null;
    accountNameLegal?: string | null;
    currencyId?: number | null;
    accountTypeId?: number | null;
    isDetail: boolean;
    isInactive: boolean;
    note?: string | null;
}

export interface PagedFinancialAccountResult {
    items: FinancialAccount[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages?: number;
}

export interface FinancialAccountLookup {
    accountId: number;
    publicId: string;
    accountNo: string;
    fatherAccountId?: number | null;
    accountName?: string | null;
    accountNameLegal?: string | null;
    currencyId?: number | null;
    accountTypeId?: number | null;
    isDetail: boolean;
    isInactive: boolean;
    note?: string | null;
    createdAt?: string | null;
    createdBy?: number | null;
    editedAt?: string | null;
    editedBy?: number | null;
}
