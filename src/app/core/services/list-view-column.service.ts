import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import { ListViewColumn, ListViewColumnQuery, CreateListViewColumnRequest, UpdateListViewColumnRequest } from '../models/list-view-column.model';

export interface PagedListViewColumnResult {
    items: ListViewColumn[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

@Injectable({
    providedIn: 'root'
})
export class ListViewColumnService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/listviewcolumn`;

    getPage(query: ListViewColumnQuery): Observable<PagedListViewColumnResult> {
        let params = new HttpParams()
            .set('page', query.page)
            .set('pageSize', query.pageSize)
            .set('sortField', query.sortField ?? 'columnOrder')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        if (query.viewId != null) {
            params = params.set('viewId', query.viewId.toString());
        }

        if (query.fieldId != null) {
            params = params.set('fieldId', query.fieldId.toString());
        }

        if (query.isVisible != null) {
            params = params.set('isVisible', query.isVisible.toString());
        }

        return this.http.get<PagedListViewColumnResult>(this.apiUrl, { params });
    }

    getById(viewColumnId: number): Observable<ListViewColumn> {
        return this.http.get<ListViewColumn>(`${this.apiUrl}/${viewColumnId}`);
    }

    create(request: CreateListViewColumnRequest): Observable<ListViewColumn> {
        return this.http.post<ListViewColumn>(this.apiUrl, request);
    }

    update(viewColumnId: number, request: UpdateListViewColumnRequest): Observable<ListViewColumn> {
        return this.http.put<ListViewColumn>(`${this.apiUrl}/${viewColumnId}`, request);
    }

    delete(viewColumnId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${viewColumnId}`);
    }
}
