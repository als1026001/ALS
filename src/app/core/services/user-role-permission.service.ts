import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { UserRolePermission, UserRolePermissionQuery, CreateUserRolePermissionRequest, UpdateUserRolePermissionRequest } from '../models/user-role-permission.model';

export interface UserRolePermissionPagedResult {
    items: UserRolePermission[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

@Injectable({
    providedIn: 'root'
})
export class UserRolePermissionService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/userrolepermission`;

    getPage(query: UserRolePermissionQuery): Observable<UserRolePermissionPagedResult> {
        let params = new HttpParams()
            .set('page', query.page.toString())
            .set('pageSize', query.pageSize.toString())
            .set('sortField', query.sortField ?? 'roleNo')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        if (query.roleId !== undefined && query.roleId !== null) {
            params = params.set('roleId', query.roleId.toString());
        }

        if (query.menuId !== undefined && query.menuId !== null) {
            params = params.set('menuId', query.menuId.toString());
        }

        return this.http.get<UserRolePermissionPagedResult>(this.apiUrl, { params });
    }

    getById(permissionId: number): Observable<UserRolePermission> {
        return this.http.get<UserRolePermission>(`${this.apiUrl}/${permissionId}`);
    }

    create(request: CreateUserRolePermissionRequest): Observable<UserRolePermission> {
        return this.http.post<UserRolePermission>(this.apiUrl, request);
    }

    update(permissionId: number, request: UpdateUserRolePermissionRequest): Observable<UserRolePermission> {
        return this.http.put<UserRolePermission>(`${this.apiUrl}/${permissionId}`, request);
    }

    delete(permissionId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${permissionId}`);
    }
}
