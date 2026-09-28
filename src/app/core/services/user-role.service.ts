import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { UserRole, UserRoleQuery, CreateUserRoleRequest, UpdateUserRoleRequest } from '../models/user-role.model';

export interface UserRolePagedResult {
    items: UserRole[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

@Injectable({
    providedIn: 'root'
})
export class UserRoleService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${API_BASE_URL}/userrole`;

    getPage(query: UserRoleQuery): Observable<UserRolePagedResult> {
        let params = new HttpParams()
            .set('page', query.page.toString())
            .set('pageSize', query.pageSize.toString())
            .set('sortField', query.sortField ?? 'roleNo')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        return this.http.get<UserRolePagedResult>(this.apiUrl, { params });
    }

    getById(roleId: number): Observable<UserRole> {
        return this.http.get<UserRole>(`${this.apiUrl}/${roleId}`);
    }

    create(request: CreateUserRoleRequest): Observable<UserRole> {
        return this.http.post<UserRole>(this.apiUrl, request);
    }

    update(roleId: number, request: UpdateUserRoleRequest): Observable<UserRole> {
        return this.http.put<UserRole>(`${this.apiUrl}/${roleId}`, request);
    }

    delete(roleId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${roleId}`);
    }
}
