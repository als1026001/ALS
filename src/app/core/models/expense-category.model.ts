export interface ExpenseCategory {
    expenseId: number;
    expenseNo: string;
    expenseName: string;
    accountId?: number | null;
    note?: string | null;
    isInactive?: boolean | null;
    createdAt?: string | null;
    createdBy?: number | null;
    editedAt?: string | null;
    editedBy?: number | null;
}

export interface ExpenseCategoryQuery {
    page: number;
    pageSize: number;
    search?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateExpenseCategoryRequest {
    expenseNo: string;
    expenseName: string;
    accountId?: number | null;
    note?: string | null;
    isInactive?: boolean | null;
}

export interface UpdateExpenseCategoryRequest {
    expenseNo: string;
    expenseName: string;
    accountId?: number | null;
    note?: string | null;
    isInactive?: boolean | null;
}

export interface FinancialAccountLookup {
    accountId: number;
    accountNo: string;
    accountName: string;
}
