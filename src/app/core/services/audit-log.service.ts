import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { PagedResult } from '../models/paged-result.model';
import { AuditLog, AuditLogQuery } from '../models/audit-log.model';

@Injectable({
    providedIn: 'root'
})
export class AuditLogService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${API_BASE_URL}/audit-logs`;

    getPage(query: AuditLogQuery): Observable<PagedResult<AuditLog>> {
        let params = new HttpParams()
            .set('page', query.page.toString())
            .set('pageSize', query.pageSize.toString());

        if (query.fromDate) {
            params = params.set('fromDate', query.fromDate);
        }

        if (query.toDate) {
            params = params.set('toDate', query.toDate);
        }

        if (query.userName?.trim()) {
            params = params.set('userName', query.userName.trim());
        }

        if (query.action?.trim()) {
            params = params.set('action', query.action.trim());
        }

        if (query.auditType?.trim()) {
            params = params.set('auditType', query.auditType.trim());
        }

        if (query.tableName?.trim()) {
            params = params.set('tableName', query.tableName.trim());
        }

        if (query.recordId?.trim()) {
            params = params.set('recordId', query.recordId.trim());
        }

        if (query.isSuccess !== undefined) {
            params = params.set(
                'isSuccess',
                query.isSuccess.toString()
            );
        }

        return this.http.get<PagedResult<AuditLog>>(
            this.apiUrl,
            { params }
        );
    }

    getById(auditId: number): Observable<AuditLog> {
        return this.http.get<AuditLog>(
            `${this.apiUrl}/${auditId}`
        );
    }
}
