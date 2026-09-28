import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { User, UserQuery, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

export interface UserPagedResult {
    items: User[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${API_BASE_URL}/user`;

    getPage(query: UserQuery): Observable<UserPagedResult> {
        let params = new HttpParams()
            .set('page', query.page.toString())
            .set('pageSize', query.pageSize.toString())
            .set('sortField', query.sortField ?? 'userName')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        return this.http.get<UserPagedResult>(this.apiUrl, { params });
    }

    getById(userId: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${userId}`);
    }

    create(request: CreateUserRequest): Observable<User> {
        return this.http.post<User>(this.apiUrl, request);
    }

    update(userId: number, request: UpdateUserRequest): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${userId}`, request);
    }

    delete(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userId}`);
    }
}
