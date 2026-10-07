export interface AutoGenerateNumber {
    refFunctionCode: number;
    refFunctionName?: string | null;

    prefix?: string | null;
    suffix?: string | null;

    minimumDigit?: number | null;
    initialNumber?: number | null;
    currentNumber?: number | null;

    isUseSubsidiary?: boolean | null;
    isUseLocation?: boolean | null;
    isAllowOverride?: boolean | null;

    note?: string | null;
    isInactive?: boolean | null;

    createdAt?: string | null;
    createdBy?: number | null;

    editedAt?: string | null;
    editedBy?: number | null;
}

export interface AutoGenerateNumberQuery {
    page: number;
    pageSize: number;

    search?: string;

    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateAutoGenerateNumberRequest {
    refFunctionCode: number;
    refFunctionName?: string | null;

    prefix?: string | null;
    suffix?: string | null;

    minimumDigit?: number | null;
    initialNumber?: number | null;
    currentNumber?: number | null;

    isUseSubsidiary?: boolean | null;
    isUseLocation?: boolean | null;
    isAllowOverride?: boolean | null;

    note?: string | null;
    isInactive?: boolean | null;
}

export interface UpdateAutoGenerateNumberRequest {
    refFunctionCode: number;
    refFunctionName?: string | null;

    prefix?: string | null;
    suffix?: string | null;

    minimumDigit?: number | null;
    initialNumber?: number | null;
    currentNumber?: number | null;

    isUseSubsidiary?: boolean | null;
    isUseLocation?: boolean | null;
    isAllowOverride?: boolean | null;

    note?: string | null;
    isInactive?: boolean | null;
}