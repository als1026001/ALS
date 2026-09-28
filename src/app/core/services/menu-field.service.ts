import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { MenuField, MenuFieldQuery, MenuFieldPagedResult, CreateMenuFieldRequest, UpdateMenuFieldRequest } from '../models/menu-field.model';

@Injectable({
    providedIn: 'root'
})
export class MenuFieldService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/menufield`;

    getPage(query: MenuFieldQuery): Observable<MenuFieldPagedResult> {
        let params = new HttpParams()
            .set('page', (query.page ?? 1).toString())
            .set('pageSize', (query.pageSize ?? 20).toString())
            .set('sortField', query.sortField ?? 'fieldCode')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        if (query.menuId != null) {
            params = params.set('menuId', query.menuId.toString());
        }

        return this.http.get<MenuFieldPagedResult>(this.apiUrl, { params });
    }

    getById(fieldId: number): Observable<MenuField> {
        return this.http.get<MenuField>(`${this.apiUrl}/${fieldId}`);
    }

    create(request: CreateMenuFieldRequest): Observable<MenuField> {
        return this.http.post<MenuField>(this.apiUrl, request);
    }

    update(fieldId: number, request: UpdateMenuFieldRequest): Observable<MenuField> {
        return this.http.put<MenuField>(`${this.apiUrl}/${fieldId}`, request);
    }

    delete(fieldId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${fieldId}`);
    }
}
