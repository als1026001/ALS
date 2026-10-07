export interface Company {
    companyId: number;
    publicId: string;

    companyNo?: string | null;
    accountId?: number | null;
    companyName?: string | null;
    taxCode?: string | null;
    legalName?: string | null;

    website?: string | null;

    address?: string | null;
    addressShipping?: string | null;
    addressReturn?: string | null;

    countryId?: number | null;
    timeZoneId?: number | null;
    currencyId?: number | null;

    firstFiscalMonth?: string | null;
    emailReturnAddress?: string | null;

    primaryDataCenterId?: string | null;
    recoveryDataCenterId?: string | null;

    allowIpAddress?: string | null;

    companyLoginUrl?: string | null;
    companyUiUrl?: string | null;
    restWebServiceUrl?: string | null;
    restletsUrl?: string | null;

    note?: string | null;

    isActive: boolean;

    createdAt: string;
    createdBy?: number | null;

    updatedAt?: string | null;
    updatedBy?: number | null;
}

export interface CompanyQuery {
    page: number;
    pageSize: number;
    search?: string;
    isActive?: boolean | null;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateCompanyRequest {
    companyNo?: string | null;
    accountId?: number | null;
    companyName?: string | null;
    taxCode?: string | null;
    legalName?: string | null;
    website?: string | null;
    address?: string | null;
    addressShipping?: string | null;
    addressReturn?: string | null;
    countryId?: number | null;
    timeZoneId?: number | null;
    currencyId?: number | null;
    firstFiscalMonth?: string | null;
    emailReturnAddress?: string | null;
    primaryDataCenterId?: string | null;
    recoveryDataCenterId?: string | null;
    allowIpAddress?: string | null;
    companyLoginUrl?: string | null;
    companyUiUrl?: string | null;
    restWebServiceUrl?: string | null;
    restletsUrl?: string | null;
    note?: string | null;
    isActive: boolean;
}

export interface UpdateCompanyRequest {
    companyNo?: string | null;
    accountId?: number | null;
    companyName?: string | null;
    taxCode?: string | null;
    legalName?: string | null;
    website?: string | null;
    address?: string | null;
    addressShipping?: string | null;
    addressReturn?: string | null;
    countryId?: number | null;
    timeZoneId?: number | null;
    currencyId?: number | null;
    firstFiscalMonth?: string | null;
    emailReturnAddress?: string | null;
    primaryDataCenterId?: string | null;
    recoveryDataCenterId?: string | null;
    allowIpAddress?: string | null;
    companyLoginUrl?: string | null;
    companyUiUrl?: string | null;
    restWebServiceUrl?: string | null;
    restletsUrl?: string | null;
    note?: string | null;
    isActive: boolean;
}
