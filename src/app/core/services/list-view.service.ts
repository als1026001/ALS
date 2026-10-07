import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { ListView, ListViewQuery, CreateListViewRequest, UpdateListViewRequest } from '../models/list-view.model';

export interface ListViewPagedResult {
    items: ListView[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

@Injectable({
    providedIn: 'root'
})
export class ListViewService {
    private readonly apiUrl = `${API_BASE_URL}/listview`;

    constructor(private readonly http: HttpClient) {}

    getPage(query: ListViewQuery): Observable<ListViewPagedResult> {
        let params = new HttpParams().set('page', query.page.toString()).set('pageSize', query.pageSize.toString());

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        if (query.menuId != null) {
            params = params.set('menuId', query.menuId.toString());
        }

        if (query.isActive != null) {
            params = params.set('isActive', query.isActive.toString());
        }

        if (query.sortField) {
            params = params.set('sortField', query.sortField);
        }

        if (query.sortDirection) {
            params = params.set('sortDirection', query.sortDirection);
        }

        return this.http.get<ListViewPagedResult>(this.apiUrl, { params });
    }

    getById(viewId: number): Observable<ListView> {
        return this.http.get<ListView>(`${this.apiUrl}/${viewId}`);
    }

    create(request: CreateListViewRequest): Observable<ListView> {
        return this.http.post<ListView>(this.apiUrl, request);
    }

    update(viewId: number, request: UpdateListViewRequest): Observable<ListView> {
        return this.http.put<ListView>(`${this.apiUrl}/${viewId}`, request);
    }

    delete(viewId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${viewId}`);
    }
}
