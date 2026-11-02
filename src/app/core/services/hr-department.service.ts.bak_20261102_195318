import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { PagedResult } from '../models/paged-result.model';

import {
    HrDepartment,
    HrDepartmentQuery,
    CreateHrDepartmentRequest,
    UpdateHrDepartmentRequest
} from '../models/hr-department.model';

@Injectable({
    providedIn: 'root'
})
export class HrDepartmentService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/hrdepartment`;

    getPage(query: HrDepartmentQuery): Observable<PagedResult<HrDepartment>> {

        let params = new HttpParams()
            .set('page', query.page)
            .set('pageSize', query.pageSize)
            .set('sortField', query.sortField ?? 'departmentCode')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        return this.http.get<PagedResult<HrDepartment>>(
            this.apiUrl,
            { params }
        );
    }

    getById(departmentId: number): Observable<HrDepartment> {

        return this.http.get<HrDepartment>(
            `${this.apiUrl}/${departmentId}`
        );
    }

    create(request: CreateHrDepartmentRequest): Observable<HrDepartment> {

        return this.http.post<HrDepartment>(
            this.apiUrl,
            request
        );
    }

    update(
        departmentId: number,
        request: UpdateHrDepartmentRequest
    ): Observable<HrDepartment> {

        return this.http.put<HrDepartment>(
            `${this.apiUrl}/${departmentId}`,
            request
        );
    }

    exportExcel(query: HrDepartmentQuery): Observable<Blob> {

        let params = new HttpParams()
            .set('sortField', query.sortField ?? 'departmentCode')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        return this.http.get(
            `${this.apiUrl}/export`,
            {
                params,
                responseType: 'blob'
            }
        );
    }
}
