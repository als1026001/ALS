export interface LoginRequest {
    tenantId: number;
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    expiresAt: string;

    userId: number;
    tenantId: number;
    companyId: number;

    username: string;
    displayName?: string | null;
}