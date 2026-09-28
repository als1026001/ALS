import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { MenuType, MenuTypeQuery, MenuTypePagedResult, CreateMenuTypeRequest, UpdateMenuTypeRequest } from '../models/menu-type.model';

@Injectable({
    providedIn: 'root'
})
export class MenuTypeService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/menutype`;

    getPage(query: MenuTypeQuery): Observable<MenuTypePagedResult> {
        let params = new HttpParams()
            .set('page', (query.page ?? 1).toString())
            .set('pageSize', (query.pageSize ?? 20).toString())
            .set('sortField', query.sortField ?? 'menuTypeNo')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        return this.http.get<MenuTypePagedResult>(this.apiUrl, { params });
    }

    getById(menuTypeId: number): Observable<MenuType> {
        return this.http.get<MenuType>(`${this.apiUrl}/${menuTypeId}`);
    }

    create(request: CreateMenuTypeRequest): Observable<MenuType> {
        return this.http.post<MenuType>(this.apiUrl, request);
    }

    update(menuTypeId: number, request: UpdateMenuTypeRequest): Observable<MenuType> {
        return this.http.put<MenuType>(`${this.apiUrl}/${menuTypeId}`, request);
    }

    delete(menuTypeId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${menuTypeId}`);
    }
}
