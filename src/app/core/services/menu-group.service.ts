import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { MenuGroup, MenuGroupQuery, MenuGroupPagedResult, CreateMenuGroupRequest, UpdateMenuGroupRequest } from '../models/menu-group.model';

@Injectable({
    providedIn: 'root'
})
export class MenuGroupService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/menugroup`;

    getPage(query: MenuGroupQuery): Observable<MenuGroupPagedResult> {
        let params = new HttpParams()
            .set('page', (query.page ?? 1).toString())
            .set('pageSize', (query.pageSize ?? 20).toString())
            .set('sortField', query.sortField ?? 'menuGroupNo')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        return this.http.get<MenuGroupPagedResult>(this.apiUrl, { params });
    }

    getById(menuGroupId: number): Observable<MenuGroup> {
        return this.http.get<MenuGroup>(`${this.apiUrl}/${menuGroupId}`);
    }

    create(request: CreateMenuGroupRequest): Observable<MenuGroup> {
        return this.http.post<MenuGroup>(this.apiUrl, request);
    }

    update(menuGroupId: number, request: UpdateMenuGroupRequest): Observable<MenuGroup> {
        return this.http.put<MenuGroup>(`${this.apiUrl}/${menuGroupId}`, request);
    }

    delete(menuGroupId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${menuGroupId}`);
    }
}
