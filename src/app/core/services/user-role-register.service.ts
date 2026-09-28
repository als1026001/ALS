import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateUserRoleRegisterRequest, UpdateUserRoleRegisterRequest, UserRoleRegister, UserRoleRegisterQuery } from '../models/user-role-register.model';

import { API_BASE_URL } from '../config/api.config';

export interface UserRoleRegisterPagedResult {
    items: UserRoleRegister[];

    totalCount: number;

    page: number;
    pageSize: number;
    totalPages: number;
}

@Injectable({
    providedIn: 'root'
})
export class UserRoleRegisterService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/userroleregister`;

    getPage(query: UserRoleRegisterQuery): Observable<UserRoleRegisterPagedResult> {
        let params = new HttpParams()
            .set('page', query.page.toString())
            .set('pageSize', query.pageSize.toString())
            .set('sortField', query.sortField || 'userName')
            .set('sortDirection', query.sortDirection || 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        if (query.userId != null) {
            params = params.set('userId', query.userId.toString());
        }

        if (query.roleId != null) {
            params = params.set('roleId', query.roleId.toString());
        }

        return this.http.get<UserRoleRegisterPagedResult>(this.apiUrl, { params });
    }

    getById(userRoleId: number): Observable<UserRoleRegister> {
        return this.http.get<UserRoleRegister>(`${this.apiUrl}/${userRoleId}`);
    }

    create(request: CreateUserRoleRegisterRequest): Observable<UserRoleRegister> {
        return this.http.post<UserRoleRegister>(this.apiUrl, request);
    }

    update(userRoleId: number, request: UpdateUserRoleRegisterRequest): Observable<UserRoleRegister> {
        return this.http.put<UserRoleRegister>(`${this.apiUrl}/${userRoleId}`, request);
    }

    delete(userRoleId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userRoleId}`);
    }
}
