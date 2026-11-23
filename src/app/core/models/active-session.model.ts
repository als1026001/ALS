export interface ActiveSession {
    sessionId: string;
    userId: number;
    userName: string | null;
    displayName: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAtUtc: string;
    lastSeenAtUtc: string;
    expiresAtUtc: string;
    revokedAtUtc: string | null;
    isOnline: boolean;
    status: string;
}

export interface ActiveSessionQuery {
    page: number;
    pageSize: number;
}

export interface ActiveSessionPage {
    items: ActiveSession[];
    totalCount: number;
    page: number;
    pageSize: number;
}